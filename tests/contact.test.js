/* global process */
import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { normalizeInquiry } from '../api/contact.js';
import { formatProjectBrief, projectEmailHref } from '../src/contactBrief.js';

const sample = { name: 'Example Person', email: 'tester@example.com', idea: 'A & B', problem: 'A fictional workflow', help: 'Prototype' };

test('validates known fields and ignores unsolicited recipient fields', () => {
  const value = normalizeInquiry({ ...sample, to: 'unexpected@example.com' });
  assert.equal(value.name, sample.name);
  assert.equal(value.to, undefined);
  assert.equal(normalizeInquiry({ ...sample, email: 'invalid' }), null);
  assert.equal(normalizeInquiry({ ...sample, name: 'a'.repeat(121) }), null);
  assert.equal(normalizeInquiry({ ...sample, idea: ['a'] }), null);
  assert.equal(normalizeInquiry({ ...sample, problem: '' }), null);
});

test('manual email fallback preserves actual content', () => {
  const url = new URL(projectEmailHref(sample));
  assert.equal(url.pathname, 'carolehayes@gmail.com');
  assert.equal(url.searchParams.get('body'), formatProjectBrief(sample));
  assert.ok(url.searchParams.get('subject').includes('A & B'));
});

function response() {
  return { code: 0, data: null, setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
}

test('disabled endpoint never accepts direct delivery and denies unrelated origins', async () => {
  const old = process.env.STUDIO_CONTACT_ENABLED;
  process.env.STUDIO_CONTACT_ENABLED = 'false';
  try {
    const status = response();
    await handler({ method: 'GET', headers: {} }, status);
    assert.deepEqual(status.data, { enabled: false });
    const denied = response();
    await handler({ method: 'POST', headers: { origin: 'https://example.com' }, body: sample }, denied);
    assert.equal(denied.code, 403);
    const unavailable = response();
    await handler({ method: 'POST', headers: { origin: 'https://spellboundstudios.dev' }, body: sample }, unavailable);
    assert.equal(unavailable.code, 503);
  } finally {
    if (old === undefined) delete process.env.STUDIO_CONTACT_ENABLED;
    else process.env.STUDIO_CONTACT_ENABLED = old;
  }
});
