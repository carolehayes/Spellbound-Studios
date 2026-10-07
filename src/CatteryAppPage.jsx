import { useEffect, useState } from 'react';
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

  const choices = state.choices || NAME_CHOICES;
  const showResults = state.voted && state.votes;
  return (
    <section className="page-section ca-poll" id="name">
      <p className="section-label">Help us name it</p>
      <h2>This one needs a name.</h2>
      <p className="ca-lede">I built it because running my cattery meant juggling websites, QuickBooks, notes, spreadsheets and my own overloaded brain. Now I’m turning the system I built for myself into something other breeders can use too. Which of these feels like a place you’d want to run your cattery?</p>
      {state.unavailable ? <p className="ca-note">Voting opens very soon. Meanwhile, the shortlist: {NAME_CHOICES.map((c) => c.label).join(', ')}.</p> : (
        <div className="ca-choices" role="group" aria-label="Name choices">
          {choices.map((c) => {
            const n = showResults ? state.votes[c.id] || 0 : 0;
            const pct = showResults && state.total ? Math.round((n / state.total) * 100) : 0;
            return (
              <button key={c.id} type="button" disabled={busy || state.loading} onClick={() => vote(c.id)}
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
