/* global process */
// Naming poll for the Cattery App page. Neon Postgres via @neondatabase/serverless.
//   GET  /api/poll?v=<visitor token>      → { choices:[{id,label,line}], voted:bool, mine, results? }  (results only after voting)
//   POST { action:'vote', v, choice }     → one vote per visitor token; voting again CHANGES it
//   POST { action:'suggest', v, name, note, website } → saved for Carole to read
// Defensive by design: origin allow-list (parsed host), per-IP limits kept in the same database,
// honeypot, length caps, parameterised queries only, choice must be one of the known ids.
import { neon } from '@neondatabase/serverless'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
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
  await sql`create table if not exists poll_choices (id text primary key, label text not null, line text not null default '', position int not null default 0, created_at timestamptz not null default now())`
  await sql`create table if not exists poll_meta (key text primary key, value text)`
  const seeded = await sql`select 1 from poll_meta where key = 'seeded'`
  if (!seeded.length) {
    for (const [i, c] of NAME_CHOICES.entries()) {
      await sql`insert into poll_choices (id, label, line, position) values (${c.id}, ${c.label}, ${c.line}, ${i}) on conflict (id) do nothing`
    }
    await sql`insert into poll_meta (key, value) values ('seeded', 'yes') on conflict (key) do nothing`
  }
  ready = true
}

const getChoices = () => sql`select id, label, line from poll_choices order by position, created_at`

// The editing key is a Vercel env var (POLL_ADMIN_KEY). Unset = editing is switched off entirely.
function keyOk(given) {
  const real = process.env.POLL_ADMIN_KEY
  if (!real || !given) return false
  const a = createHash('sha256').update(String(given)).digest()
  const b = createHash('sha256').update(real).digest()
  return timingSafeEqual(a, b)
}
const slug = (label) => `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'name'}-${randomBytes(2).toString('hex')}`

async function overLimit(ipHash, kind, max, seconds) {
  const r = await sql`select count(*)::int as n from poll_hits where ip_hash = ${ipHash} and kind = ${kind} and at > now() - make_interval(secs => ${seconds})`
  if (r[0].n >= max) return true
  await sql`insert into poll_hits (ip_hash, kind) values (${ipHash}, ${kind})`
  return false
}

async function results() {
  const choices = await getChoices()
  const rows = await sql`select choice, count(*)::int as n from poll_votes group by choice`
  const byId = Object.fromEntries(rows.map(r => [r.choice, r.n]))
  const votes = Object.fromEntries(choices.map(c => [c.id, byId[c.id] || 0]))
  return { total: Object.values(votes).reduce((a, n) => a + n, 0), votes }
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
      const out = { choices: await getChoices(), voted: !!mine, mine }
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
      const known = await sql`select 1 from poll_choices where id = ${choice}`
      if (!known.length) return res.status(400).json({ error: 'Unknown choice.' })
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
    if (b.action === 'admin') {
      if (!process.env.POLL_ADMIN_KEY) return res.status(503).json({ error: 'Editing is not switched on yet.' })
      // Only WRONG keys count toward the limit, so a long editing session is never throttled.
      const wrong = await sql`select count(*)::int as n from poll_hits where ip_hash = ${ipHash} and kind = 'adminfail' and at > now() - interval '1 hour'`
      if (wrong[0].n >= 10) return res.status(429).json({ error: 'Too many tries. Try again later.' })
      if (!keyOk(b.key)) {
        await sql`insert into poll_hits (ip_hash, kind) values (${ipHash}, 'adminfail')`
        return res.status(401).json({ error: 'That key is not right.' })
      }
      const label = clean(b.label, 40)
      const line = clean(b.line, 90)
      const id = clean(b.id, 60)
      if (b.op === 'add') {
        if (label.length < 2) return res.status(400).json({ error: 'Please type a name.' })
        const pos = await sql`select coalesce(max(position), -1) + 1 as p from poll_choices`
        await sql`insert into poll_choices (id, label, line, position) values (${slug(label)}, ${label}, ${line}, ${pos[0].p})`
      } else if (b.op === 'update') {
        if (label.length < 2) return res.status(400).json({ error: 'Please type a name.' })
        await sql`update poll_choices set label = ${label}, line = ${line} where id = ${id}`
      } else if (b.op === 'delete') {
        await sql`delete from poll_votes where choice = ${id}`
        await sql`delete from poll_choices where id = ${id}`
      } else if (b.op === 'resetVotes') {
        await sql`delete from poll_votes where choice = ${id}`
      } else if (b.op !== 'list') return res.status(400).json({ error: 'Unknown edit.' })
      const suggestions = await sql`select id, name, note, created_at from poll_suggestions order by created_at desc limit 100`
      return res.status(200).json({ ok: true, choices: await getChoices(), ...(await results()), suggestions })
    }
    return res.status(400).json({ error: 'Unknown action.' })
  } catch (e) {
    console.error('poll error', e?.message)
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}
