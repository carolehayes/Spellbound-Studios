/* global process */
import { neon } from '@neondatabase/serverless';
import { createHmac } from 'node:crypto';
import { formatProjectBrief } from '../src/contactBrief.js';

const origins = new Set(['https://spellboundstudios.dev', 'https://www.spellboundstudios.dev', 'https://spellbound-studios.vercel.app']);
const maxFields = { name: 120, email: 254, idea: 160, audience: 1500, problem: 4000, features: 4000, help: 80, platforms: 80, timing: 200, budget: 80, references: 400, anythingElse: 4000 };
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export function normalizeInquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const result = {};
  for (const [key, limit] of Object.entries(maxFields)) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > limit) return null;
    result[key] = value.trim();
  }
  if (!result.name || !result.idea || !result.problem || !result.help || !emailPattern.test(result.email)) return null;
  if (/[\r\n]/.test(result.email)) return null;
  return result;
}

function config() {
  const db = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const { STUDIO_CONTACT_ENABLED, RESEND_API_KEY, STUDIO_CONTACT_FROM, STUDIO_CONTACT_TO, STUDIO_CONTACT_RATE_SALT } = process.env;
  if (STUDIO_CONTACT_ENABLED !== 'true' || !db || !RESEND_API_KEY || !STUDIO_CONTACT_FROM || !emailPattern.test(STUDIO_CONTACT_TO || '') || !STUDIO_CONTACT_RATE_SALT) return null;
  return { db, key: RESEND_API_KEY, from: STUDIO_CONTACT_FROM, to: STUDIO_CONTACT_TO, salt: STUDIO_CONTACT_RATE_SALT };
}

async function rateAllowed(sql, hashedIp) {
  // The persistent, atomic hour bucket is not dependent on function memory.
  await sql`create table if not exists studio_contact_rate (identity_hash text not null, hour_bucket timestamptz not null, hits integer not null default 1, primary key (identity_hash, hour_bucket))`;
  await sql`delete from studio_contact_rate where hour_bucket < now() - interval '2 days'`;
  for (const [identity, maximum] of [[hashedIp, 3], ['global', 30]]) {
    const rows = await sql`insert into studio_contact_rate (identity_hash, hour_bucket) values (${identity}, date_trunc('hour', now())) on conflict (identity_hash, hour_bucket) do update set hits = studio_contact_rate.hits + 1 where studio_contact_rate.hits < ${maximum} returning hits`;
    if (!rows.length) return false;
  }
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const settings = config();
  if (req.method === 'GET') return res.status(200).json({ enabled: !!settings });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!origins.has(String(req.headers.origin || ''))) return res.status(403).json({ error: 'Not allowed' });
  if (!settings) return res.status(503).json({ error: 'Direct delivery is not configured.' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: 'Invalid format' });
  if (Number(req.headers['content-length'] || 0) > 30000) return res.status(413).json({ error: 'Inquiry is too large.' });
  if (req.body?.website) return res.status(400).json({ error: 'Unable to accept this inquiry.' });
  const inquiry = normalizeInquiry(req.body);
  const requestId = req.body?.requestId;
  if (!inquiry || typeof requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(requestId)) return res.status(400).json({ error: 'Please check the required fields.' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if (!ip) return res.status(503).json({ error: 'Unable to confirm the request.' });
  try {
    const hashedIp = createHmac('sha256', settings.salt).update(ip).digest('hex');
    if (!await rateAllowed(neon(settings.db), hashedIp)) return res.status(429).json({ error: 'Too many inquiries. Please try again later or use email.' });
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${settings.key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `studio-inquiry/${requestId}` },
      body: JSON.stringify({ from: settings.from, to: [settings.to], reply_to: inquiry.email, subject: `Spellbound Studios inquiry: ${inquiry.idea.replace(/[\r\n]/g, ' ')}`, text: formatProjectBrief(inquiry) }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) { console.error('Studio contact provider returned status', response.status); return res.status(502).json({ error: 'Delivery could not be confirmed.' }); }
    const result = await response.json();
    if (typeof result.id !== 'string' || !result.id) return res.status(502).json({ error: 'Delivery could not be confirmed.' });
    return res.status(200).json({ ok: true });
  } catch {
    console.error('Studio contact delivery unavailable');
    return res.status(502).json({ error: 'Delivery could not be confirmed.' });
  }
}
