import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Heart, Image as ImageIcon, Sparkles } from 'lucide-react';
import { FEATURES, NAME_CHOICES, PLANS, SIGNUP_URL } from './catteryAppData.js';

// A random, anonymous token kept in this browser so one person is one vote. Not an account, not tracking.
function visitorToken() {
  try {
    let t = localStorage.getItem('ss-poll-visitor');
    if (!t) {
      t = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('ss-poll-visitor', t);
    }
    return t;
  } catch { return `tmp${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`; }
}

async function pollCall(method, body, token) {
  const r = await fetch(method === 'GET' ? `/api/poll?v=${encodeURIComponent(token)}` : '/api/poll', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify({ ...body, v: token }) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

const KEY_STORE = 'ss-poll-edit-key';
const readKey = () => { try { return localStorage.getItem(KEY_STORE) || ''; } catch { return ''; } };
const saveKey = (k) => { try { if (k) localStorage.setItem(KEY_STORE, k); else localStorage.removeItem(KEY_STORE); } catch { /* private mode: key just isn't remembered */ } };

// A small right-click menu. Measures its real size before clamping to the window.
function RightMenu({ at, items, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: at.x, top: at.y });
  useLayoutEffect(() => {
    const r = ref.current.getBoundingClientRect();
    setPos({ left: Math.max(8, Math.min(at.x, window.innerWidth - r.width - 8)), top: Math.max(8, Math.min(at.y, window.innerHeight - r.height - 8)) });
  }, [at]);
  useEffect(() => {
    const close = () => onClose();
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('click', close); window.addEventListener('scroll', close, true); window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('click', close); window.removeEventListener('scroll', close, true); window.removeEventListener('keydown', esc); };
  }, [onClose]);
  return (
    <div ref={ref} className="ca-menu" style={pos} role="menu" onContextMenu={(e) => e.preventDefault()}>
      {items.map((it) => <button key={it.label} type="button" role="menuitem" title={it.title} onClick={it.run}>{it.label}</button>)}
    </div>
  );
}

// Editing panel: add, rename, delete names and read suggestions. Needs the editing key.
function EditPanel({ token, adminKey, data, setData, onDone, focusId }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const call = async (op, extra = {}) => {
    setBusy(true); setError('');
    try { setData(await pollCall('POST', { action: 'admin', key: adminKey, op, ...extra }, token)); return true; }
    catch (e) { setError(e.message); return false; }
    finally { setBusy(false); }
  };
  const save = (e, id) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); call('update', { id, label: f.label, line: f.line }); };
  const add = async (e) => { e.preventDefault(); const form = e.currentTarget; const f = Object.fromEntries(new FormData(form)); if (await call('add', { label: f.label, line: f.line })) form.reset(); };
  return (
    <div className="ca-edit">
      <div className="ca-edit-head"><h3>Edit the names</h3><button type="button" className="button secondary" onClick={onDone} title="Close the editor">Done</button></div>
      {data.choices.map((c) => (
        <form key={`${c.id}:${c.label}:${c.line}`} className={`ca-edit-row ${focusId === c.id ? 'focus' : ''}`} onSubmit={(e) => save(e, c.id)}>
          <input name="label" defaultValue={c.label} maxLength="40" required aria-label="Name" />
          <input name="line" defaultValue={c.line} maxLength="90" aria-label="One-line description" />
          <span className="ca-edit-votes" title="Votes for this name">{data.votes?.[c.id] ?? 0} votes</span>
          <button className="button secondary" disabled={busy} title="Save this name and description. Its votes stay.">Save</button>
          <button type="button" className="button secondary" disabled={busy} title="Set this name’s votes back to zero" onClick={() => { if (window.confirm(`Reset the votes for ${c.label}?`)) call('resetVotes', { id: c.id }); }}>Reset votes</button>
          <button type="button" className="button secondary" disabled={busy} title="Remove this name and its votes from the poll" onClick={() => { if (window.confirm(`Delete ${c.label} and its votes?`)) call('delete', { id: c.id }); }}>Delete</button>
        </form>
      ))}
      <form className="ca-edit-row add" onSubmit={add}>
        <input name="label" maxLength="40" placeholder="New name" required aria-label="New name" />
        <input name="line" maxLength="90" placeholder="One-line description" aria-label="New one-line description" />
        <button className="button" disabled={busy} title="Add this name to the poll">Add a name</button>
      </form>
      {error && <p className="ca-error" role="alert">{error}</p>}
      <h4>Ideas people have sent ({data.suggestions?.length || 0})</h4>
      {data.suggestions?.length ? <ul className="ca-ideas">{data.suggestions.map((s) => (
        <li key={s.id}><strong>{s.name}</strong>{s.note ? <span> — {s.note}</span> : null}
          <button type="button" className="button secondary" disabled={busy} title={`Add ${s.name} to the poll`} onClick={() => call('add', { label: s.name, line: s.note || '' })}>Add to poll</button></li>
      ))}</ul> : <p className="ca-note">None yet.</p>}
    </div>
  );
}

function NamePoll() {
  const [token] = useState(visitorToken);
  const [state, setState] = useState({ loading: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [suggested, setSuggested] = useState(false);

  useEffect(() => {
    pollCall('GET', null, token).then((d) => setState({ ...d })).catch(() => setState({ unavailable: true }));
  }, [token]);

  const vote = async (choice) => {
    setBusy(true); setError('');
    try { setState(await pollCall('POST', { action: 'vote', choice }, token)); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };
  const suggest = async (event) => {
    event.preventDefault();
    const f = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true); setError('');
    try { await pollCall('POST', { action: 'suggest', name: f.name, note: f.note, website: f.website }, token); setSuggested(true); }
    catch (e) { setError(e.message); }
    setBusy(false);
  };

  // ── Editing (right-click, or the Edit names button once unlocked on this device) ──
  const [menu, setMenu] = useState(null);
  const [adminKey, setAdminKey] = useState(readKey);
  const [editing, setEditing] = useState(false);
  const [focusId, setFocusId] = useState(null);
  const [unlock, setUnlock] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [unlockError, setUnlockError] = useState('');

  const openEditor = async (key, id = null) => {
    setUnlockError('');
    try {
      const d = await pollCall('POST', { action: 'admin', key, op: 'list' }, token);
      saveKey(key); setAdminKey(key); setAdminData(d); setFocusId(id); setEditing(true); setUnlock(false);
    } catch (e) { saveKey(''); setAdminKey(''); setUnlock(true); setUnlockError(e.message); }
  };
  const startEdit = (id = null) => { setMenu(null); if (adminKey) openEditor(adminKey, id); else { setFocusId(id); setUnlock(true); } };
  const finishEdit = () => {
    setEditing(false);
    pollCall('GET', null, token).then((d) => setState({ ...d })).catch(() => {});
  };
  const onMenu = (e, c) => {
    e.preventDefault();
    const items = [{ label: 'Edit names…', title: 'Open the name editor', run: () => startEdit(c?.id || null) }];
    if (c) items.unshift({ label: `Edit “${c.label}”`, title: `Change the wording of ${c.label}`, run: () => startEdit(c.id) });
    setMenu({ x: e.clientX, y: e.clientY, items });
  };

  const choices = state.choices || NAME_CHOICES;
  const showResults = state.voted && state.votes;
  return (
    <section className="page-section ca-poll" id="name" onContextMenu={(e) => onMenu(e, null)}>
      {menu && <RightMenu at={menu} items={menu.items} onClose={() => setMenu(null)} />}
      <p className="section-label">Help us name it</p>
      <h2>This one needs a name.</h2>
      <p className="ca-lede">I built it because running my cattery meant juggling websites, QuickBooks, notes, spreadsheets and my own overloaded brain. Now I’m turning the system I built for myself into something other breeders can use too. Which of these feels like a place you’d want to run your cattery?</p>
      {state.unavailable ? <p className="ca-note">Voting opens very soon. Meanwhile, the shortlist: {NAME_CHOICES.map((c) => c.label).join(', ')}.</p> : (
        <div className="ca-choices" role="group" aria-label="Name choices">
          {choices.map((c) => {
            const n = showResults ? state.votes[c.id] || 0 : 0;
            const pct = showResults && state.total ? Math.round((n / state.total) * 100) : 0;
            return (
              <button key={c.id} type="button" onContextMenu={(e) => { e.stopPropagation(); onMenu(e, c); }} disabled={busy || state.loading} onClick={() => vote(c.id)}
                className={`ca-choice ${state.mine === c.id ? 'mine' : ''}`}
                title={state.mine === c.id ? 'Your vote. Click another name to change it.' : `Vote for ${c.label}`}>
                {showResults && <span className="ca-bar" style={{ width: `${pct}%` }} aria-hidden="true" />}
                <span className="ca-choice-text"><strong>{c.label}</strong><em>{c.line}</em></span>
                {showResults ? <span className="ca-count">{pct}% · {n}</span> : <span className="ca-count">Vote</span>}
                {state.mine === c.id && <Check size={16} aria-label="Your vote" />}
              </button>
            );
          })}
        </div>
      )}
      {editing && adminData && <EditPanel token={token} adminKey={adminKey} data={adminData} setData={setAdminData} onDone={finishEdit} focusId={focusId} />}
      {unlock && (
        <form className="ca-unlock" onSubmit={(e) => { e.preventDefault(); openEditor(String(new FormData(e.currentTarget).get('key') || '').trim(), focusId); }}>
          <label>Editing key<input name="key" type="password" autoComplete="off" required /></label>
          <button className="button" title="Unlock the name editor on this device">Unlock</button>
          <button type="button" className="button secondary" onClick={() => setUnlock(false)} title="Cancel">Cancel</button>
          {unlockError && <span className="ca-error" role="alert">{unlockError}</span>}
        </form>
      )}
      {adminKey && !editing && !unlock && <button type="button" className="ca-linkbtn" onClick={() => startEdit()} title="Open the name editor">Edit names</button>}
      {showResults && <p className="ca-note">{state.total} {state.total === 1 ? 'vote' : 'votes'} so far. You can change yours any time.</p>}
      {error && <p className="ca-error" role="alert">{error}</p>}
      {suggested ? <p className="ca-thanks"><Heart size={16} /> Thank you, that idea is saved.</p> : (
        <form className="ca-suggest" onSubmit={suggest}>
          <label>Have a better idea?<input name="name" maxLength="60" placeholder="Suggest a name" required /></label>
          <label>Why do you like it? (optional)<input name="note" maxLength="300" /></label>
          <input name="website" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />
          <button className="button secondary" disabled={busy} title="Send your name idea to Carole">Send my idea</button>
        </form>
      )}
    </section>
  );
}

function SignupForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const f = Object.fromEntries(new FormData(event.currentTarget));
    setStatus('sending'); setError('');
    try {
      const r = await fetch(SIGNUP_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, facebookUrl: f.facebookUrl, breed: f.breed, currentSetup: f.currentSetup, wants: f.wants, price: f.price, website: f.website }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Something went wrong. Please try again.');
      setStatus('done');
    } catch (e) { setError(e.message); setStatus('idle'); }
  };
  if (status === 'done') return <div className="form-success ca-done"><Sparkles /><h2>You’re on the list.</h2><p>Thank you. I’ll write to you personally as soon as there’s a way to try it.</p></div>;
  return (
    <form className="project-form" onSubmit={submit}>
      <div className="form-heading"><p className="section-label">Early access</p><h2>Count me in</h2><p>No payment, no commitment. Tell me a little about your cattery.</p></div>
      <div className="form-grid"><label>Your name<input name="name" required autoComplete="name" maxLength="120" /></label><label>Email<input name="email" type="email" required autoComplete="email" maxLength="200" /></label></div>
      <div className="form-grid"><label>Breed(s)<input name="breed" maxLength="120" /></label><label>Facebook link (optional)<input name="facebookUrl" placeholder="facebook.com/yourcattery" maxLength="300" /></label></div>
      <label>How do you keep track of things today?<textarea name="currentSetup" rows="3" maxLength="1000" placeholder="Spreadsheets, paper, another program…" /></label>
      <label>What would you want an app like this to do for you?<textarea name="wants" rows="3" maxLength="2000" placeholder="Anything you’d miss if it weren’t there." /></label>
      <label>What would feel like a fair monthly price?<input name="price" maxLength="300" /></label>
      <input name="website" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />
      {error && <p className="ca-error" role="alert">{error}</p>}
      <button className="button" disabled={status === 'sending'} title="Send your details to join the early-access list">{status === 'sending' ? 'Sending…' : 'Join the early-access list'}</button>
    </form>
  );
}

export default function CatteryAppPage() {
  useEffect(() => {
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, []);
  return (
    <main className="cattery-app">
      <section className="page-intro ca-hero">
        <div>
          <p className="section-label">Early access · built by a breeder, for breeders</p>
          <h1>The Cattery App <span className="ca-pending">name pending</span></h1>
          <p>Litters, kittens, waitlists, families, photos and payments in one calm place. I built it to run my own Siberian cattery, and I’m opening it to a small group of other breeders to try first.</p>
          <div className="button-row"><a className="button" href="#signup" title="Jump to the early-access form">Join early access</a><a className="button secondary" href="#name" title="Jump to the naming poll">Help us name it</a></div>
        </div>
      </section>

      <section className="page-section ca-features">
        <p className="section-label">What it does</p>
        <h2>The whole cattery, in one place.</h2>
        <div className="ca-grid">{FEATURES.map(([t, d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
      </section>

      <section className="page-section ca-shots">
        <p className="section-label">A look inside</p>
        <h2>Screens, coming soon.</h2>
        <p className="ca-lede">I’m preparing a sample cattery with made-up cats and families so you can see the real screens without anyone’s private information. Any images that are generated will be labeled as samples.</p>
        <div className="ca-grid three">{['Litter overview', 'Waitlist and selection', 'Family portal'].map((l) => <div className="ca-shot" key={l} title={`${l}: sample screenshot coming soon`}><ImageIcon size={28} /><span>{l}</span><em>Sample screenshot coming soon</em></div>)}</div>
      </section>

      <section className="page-section ca-plans">
        <p className="section-label">Pricing, plainly</p>
        <h2>Free while we build it together.</h2>
        <p className="ca-lede">{PLANS.intro} {PLANS.beta} {PLANS.referral}</p>
      </section>

      <NamePoll />

      <section className="page-section contact-layout" id="signup">
        <aside>
          <p className="section-label">Be among the first</p>
          <h2>Tell me about your cattery.</h2>
          <p>I’m inviting breeders in small groups so each one gets real attention. What you tell me here shapes what gets built next.</p>
          <p className="ca-note">Your details go to me and nobody else. I won’t add you to anything but this list.</p>
        </aside>
        <div className="form-wrap"><SignupForm /></div>
      </section>
    </main>
  );
}
