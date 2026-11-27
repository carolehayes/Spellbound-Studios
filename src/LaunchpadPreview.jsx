import { useState } from 'react';
import { projects } from './data.js';
import { calculateScenario, summarizeScope } from './launchpadMath.js';
import './launchpad.css';

const examples = ['album-studio', 'kitchen-spellbook'].map((slug) => projects.find((p) => p.slug === slug));
const tabs = ['Overview', 'Features & Progress', 'Market Opportunity', 'Demo', 'Acquisition'];
const modes = [
  ['Concept package', 'Product definition, designs and approved transferable assets.'],
  ['Acquire as-is', 'Existing code, documentation and explicit transferable rights.'],
  ['Finish & launch', 'Acquisition plus agreed commissioned completion.'],
  ['White-label license', 'A branded version under negotiated nonexclusive terms.'],
  ['Exclusive acquisition', 'Specified exclusive product rights, subject to review.'],
  ['Development partnership', 'A separately negotiated collaboration.'],
];
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Scenario() {
  const [values, setValues] = useState({ subscribers: 250, monthlyPrice: 19, expenses: 300, acquisitionCost: 8500 });
  const result = calculateScenario(values);
  return <section className="lp-panel"><h3>Explore a hypothetical business scenario</h3><p>Illustrative inputs only—not an asking price, valuation or revenue forecast.</p><div className="lp-inputs">{[['subscribers','Paying subscribers'],['monthlyPrice','Monthly price ($)'],['expenses','Monthly expenses ($)'],['acquisitionCost','Hypothetical acquisition cost ($)']].map(([key,label]) => <label key={key}>{label}<input type="number" min="0" max="1000000000" value={values[key]} onChange={(e)=>setValues({...values,[key]:e.target.value})}/></label>)}</div><div className="lp-results" aria-live="polite"><div><small>Monthly gross</small><strong>{money.format(result.gross)}</strong></div><div><small>Annual gross</small><strong>{money.format(result.annual)}</strong></div><div><small>Monthly operating surplus</small><strong>{money.format(result.surplus)}</strong></div><div><small>Simple cost recovery</small><strong>{result.recovery === null ? 'Not applicable' : `${result.recovery.toFixed(1)} months`}</strong></div></div><p className="lp-fine">Excludes ramp-up, churn, taxes, owner labor, marketing, provider fees and other costs unless included in expenses. This is arithmetic, not a prediction.</p></section>;
}

export default function LaunchpadPreview() {
  const [selected, setSelected] = useState(examples[0].slug);
  const [tab, setTab] = useState(tabs[0]);
  const [mode, setMode] = useState(modes[0][0]);
  const [intent, setIntent] = useState('');
  const project = examples.find((p) => p.slug === selected);
  const scope = summarizeScope(null);
  return <main className="launchpad-review">
    <div className="lp-notice" role="status">OWNER REVIEW PREVIEW · No sales listings, orders, approved prices or lead collection. The production portfolio remains unchanged.</div>
    <section className="lp-hero"><div><p className="section-label">Spellbound Studios</p><h1>The Launchpad</h1><p className="lp-tagline">Extraordinary ideas. Ready for their next chapter.</p><p>Discover how a curated software collection could become a business of your own, from the earliest creative seed to a carefully scoped launch.</p></div><div className="lp-hero-aside"><span>Dream. Design. Develop.</span><h2>We dream them into existence.<br/>You take them into the world.</h2><small>Illustrative experience for owner review</small></div></section>
    <section className="lp-frame"><div className="lp-heading"><h2>Explore two example listings</h2><p>Existing portfolio records used to demonstrate layout. Neither is offered for sale.</p></div><div className="lp-cards">{examples.map((p)=><button className={`lp-card lp-${p.slug} ${selected===p.slug?'selected':''}`} key={p.slug} aria-pressed={selected===p.slug} onClick={()=>{setSelected(p.slug);setTab(tabs[0]);setIntent('');}}><div className="lp-card-art"><span>{p.name}</span><small>Brand direction · illustrative</small></div><div><span className="lp-pill">Example only · {p.status}</span><h3>{p.name}</h3><p>{p.shortDescription}</p><strong>Explore example</strong></div></button>)}</div></section>
    <section className={`lp-detail lp-${project.slug}`}><div className="lp-detail-header"><div><span className="lp-pill">Not for sale · review example</span><h2>{project.name}</h2><p>{project.tagline}</p></div><div><small>Development stage</small><strong>{project.status}</strong><small>Verified scope completion</small><strong>{scope.progress === null?'Not assessed':`${scope.progress}%`}</strong></div></div><div className="lp-tabs" role="group" aria-label="Listing sections">{tabs.map(t=><button key={t} aria-pressed={tab===t} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="lp-tab-content">
      {tab==='Overview'&&<><h3>What this could become</h3><p>{project.longDescription}</p><p><strong>Potential audience:</strong> {project.slug==='album-studio'?'Photographers, families and photo print businesses.':'Home cooks, recipe creators and cooking communities.'} Audience is a hypothesis, not validated demand.</p><p><strong>Possible business models:</strong> subscriptions, one-time purchase or licensing. No model selected.</p><p>{project.notes}</p></>}
      {tab==='Features & Progress'&&<><h3>Development evidence</h3><p>Catalog scope, not an audited or verified feature list. No frozen acquisition scope yet.</p><ul className="lp-feature-list">{project.features.map(f=><li key={f}>{f}<span>Not assessed</span></li>)}</ul><h3>Launch readiness</h3><p>Security, privacy, testing, billing, export, documentation and transfer rights: not assessed. No readiness claim.</p></>}
      {tab==='Market Opportunity'&&<><h3>Research pending</h3><p>Market evidence, direct validation and commercial projections will be separate. No research report has been approved for publication.</p><Scenario/></>}
      {tab==='Demo'&&<><h3>Demonstration</h3><p>Only approved portfolio captures or fictional demo records may appear. No independent live product demo has been verified for this example.</p><a href={`/apps/${project.slug}`}>View existing portfolio record</a></>}
      {tab==='Acquisition'&&<><h3>Illustrative acquisition options</h3><p>These choices demonstrate the layout only. No price, license or sale is approved.</p><div className="lp-modes">{modes.map(([name,description])=><button key={name} aria-pressed={mode===name} onClick={()=>setMode(name)}><strong>{name}</strong><span>{description}</span></button>)}</div><p role="status">Selected example: {mode}. Pricing and rights would require owner approval and a written agreement.</p></>}
    </div><div className="lp-interest"><h3>Interested in this concept?</h3><div>{['I’d love to use this','I’d love to own this','I’d love to collaborate'].map(i=><button key={i} aria-pressed={intent===i} onClick={()=>setIntent(i)}>{i}</button>)}</div>{intent&&<p role="status">Preview selection: {intent}. No message sent, no lead saved, and no offer made.</p>}</div></section>
    <section className="lp-frame lp-bottom"><h2>Build With Us</h2><p>Commission a project of your own through the existing studio inquiry. The form prepares a manual email draft; it does not transmit messages automatically.</p><a className="button" href="/contact#build">Visit project intake</a></section>
  </main>;
}
