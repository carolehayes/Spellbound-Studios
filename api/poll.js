/* global process */
// Naming poll for the Cattery App page. Neon Postgres via @neondatabase/serverless.
//   GET  /api/poll?v=<visitor token>      → { choices:[{id,label,line}], voted:bool, mine, results? }  (results only after voting)
//   POST { action:'vote', v, choice }     → one vote per visitor token; voting again CHANGES it
//   POST { action:'suggest', v, name, note, website } → saved for Carole to read
// Defensive by design: origin allow-list (parsed host), per-IP limits kept in the same database,
// honeypot, length caps, parameterised queries only, choice must be one of the known ids.
import { neon } from '@neondatabase/serverless'
import { createHash } from 'node:crypto'
import { NAME_CHOICES } from '../src/catteryAppData.js'

const HOSTS = new Set(['spellboundstudios.dev', 'www.spellboundstudios.dev', 'spellbound-studios.vercel.app'])
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
const sql = url ? neon(url) : null
let ready = false

function originOk(req) {
  const o = req.headers.origin
  if (!o) return true // same-origin GETs and curl have none; writes still pass every other check
  try { return HOSTS.has(new URL(o).hostname.toLowerCase()) } catch { return false }
}
const hash = (s) => createHash('sha256').update(`${process.env.POLL_SALT || url || 'x'}:${s}`).digest('hex')
const NUL = String.fromCharCode(0)
const clean = (v, max) => String(v ?? '').split(NUL).join('').replace(/\s+/g, ' ').trim().slice(0, max)

async function setup() {
  if (ready) return
  await sql`create table if not exists poll_votes (visitor_hash text primary key, choice text not null, ip_hash text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now())`
  await sql`create table if not exists poll_suggestions (id bigserial primary key, name text not null, note text, visitor_hash text not null, ip_hash text not null, created_at timestamptz not null default now())`
  await sql`create table if not exists poll_hits (ip_hash text not null, kind text not null, at timestamptz not null default now())`
  ready = true
}

async function overLimit(ipHash, kind, max, seconds) {
  const r = await sql`select count(*)::int as n from poll_hits where ip_hash = ${ipHash} and kind = ${kind} and at > now() - make_interval(secs => ${seconds})`
  if (r[0].n >= max) return true
  await sql`insert into poll_hits (ip_hash, kind) values (${ipHash}, ${kind})`
  return false
}

async function results() {
  const rows = await sql`select choice, count(*)::int as n from poll_votes group by choice`
  const byId = Object.fromEntries(rows.map(r => [r.choice, r.n]))
  const total = rows.reduce((a, r) => a + r.n, 0)
  return { total, votes: Object.fromEntries(NAME_CHOICES.map(c => [c.id, byId[c.id] || 0])) }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const origin = req.headers.origin
  if (origin && originOk(req)) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin') }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!originOk(req)) return res.status(403).json({ error: 'Not allowed' })
  if (!sql) return res.status(503).json({ error: 'Voting is not switched on yet.' })

  try {
    await setup()
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
    const ipHash = hash('ip:' + ip)

    if (req.method === 'GET') {
      const v = clean(req.query?.v, 80)
      let mine = null
      if (v.length >= 16) {
        const r = await sql`select choice from poll_votes where visitor_hash = ${hash('v:' + v)}`
        mine = r[0]?.choice || null
      }
      const out = { choices: NAME_CHOICES, voted: !!mine, mine }
      if (mine) Object.assign(out, await results())
      return res.status(200).json(out)
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const b = req.body || {}
    if (clean(b.website, 100)) return res.status(200).json({ ok: true })   // honeypot
    const v = clean(b.v, 80)
    if (v.length < 16) return res.status(400).json({ error: 'Please reload the page and try again.' })
    const vh = hash('v:' + v)

    if (b.action === 'vote') {
      const choice = clean(b.choice, 40)
      if (!NAME_CHOICES.some(c => c.id === choice)) return res.status(400).json({ error: 'Unknown choice.' })
      if (await overLimit(ipHash, 'vote', 20, 3600)) return res.status(429).json({ error: 'Too many votes from here for now. Try again later.' })
      await sql`insert into poll_votes (visitor_hash, choice, ip_hash) values (${vh}, ${choice}, ${ipHash})
                on conflict (visitor_hash) do update set choice = excluded.choice, updated_at = now()`
      return res.status(200).json({ ok: true, voted: true, mine: choice, ...(await results()) })
    }

    if (b.action === 'suggest') {
      const name = clean(b.name, 60)
      const note = clean(b.note, 300) || null
      if (name.length < 2) return res.status(400).json({ error: 'Please type a name.' })
      if (await overLimit(ipHash, 'suggest', 5, 86400)) return res.status(429).json({ error: 'Thank you, that’s plenty of ideas for today!' })
      await sql`insert into poll_suggestions (name, note, visitor_hash, ip_hash) values (${name}, ${note}, ${vh}, ${ipHash})`
      return res.status(200).json({ ok: true })
    }
    return res.status(400).json({ error: 'Unknown action.' })
  } catch (e) {
    console.error('poll error', e?.message)
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}
