import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, ExternalLink, Feather, Menu, Search,
  Sparkles, X, ZoomIn, CalendarDays, Circle, Mail, ShieldCheck, Layers3,
} from 'lucide-react';
import CatteryAppPage from './CatteryAppPage.jsx';
import { categoryOptions, incubatorIdeas, journalEntries, projects, statusOptions } from './data.js';

const navItems = [
  ['Home', '/'], ['Apps', '/apps'], ['Cattery App', '/cattery-app'], ['Progress', '/progress'], ['Incubator', '/incubator'],
  ['Journal', '/journal'], ['About', '/about'], ['Contact', '/contact'],
];

const normalizeMedia = (item) => typeof item === 'string'
  ? { src: item, label: 'Concept Design', caption: '' }
  : item;

const mediaTone = (label = '') => label.toLowerCase().replaceAll(' ', '-');

function useRouter() {
  const [path, setPath] = useState(`${window.location.pathname}${window.location.search}`);
  useEffect(() => {
    const onPop = () => setPath(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (href) => {
    window.history.pushState({}, '', href);
    setPath(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return { path, navigate };
}

function Link({ href, navigate, className = '', children, onClick, ...props }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
          event.preventDefault();
          navigate(href);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function BotanicalMark({ small = false }) {
  return (
    <svg className={small ? 'botanical-mark small' : 'botanical-mark'} viewBox="0 0 52 60" aria-hidden="true">
      <path d="M12 54C25 40 30 25 35 6M22 42C15 37 9 31 7 24M28 32C38 30 44 25 48 19M32 19C26 15 22 10 21 5" />
      <path d="M8 24C13 23 18 26 20 32C14 33 9 30 8 24ZM35 7C41 8 44 13 42 19C36 18 33 13 35 7ZM47 19C48 25 44 29 38 30C37 24 41 20 47 19ZM21 5C27 7 30 12 28 18C22 16 19 11 21 5Z" />
    </svg>
  );
}

function Logo({ navigate }) {
  return (
    <Link href="/" navigate={navigate} className="logo" aria-label="Spellbound Studios home">
      <BotanicalMark />
      <span>Spellbound Studios<small>Tools for a more magical life.</small></span>
    </Link>
  );
}

function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  const currentPath = path.split('?')[0];
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo navigate={navigate} />
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          {navItems.map(([label, href]) => {
            const active = href === '/' ? currentPath === '/' : currentPath.startsWith(href);
            return <Link key={href} href={href} navigate={navigate} onClick={() => setOpen(false)} className={active ? 'active' : ''}>{label}</Link>;
          })}
          <Link href="/contact#build" navigate={navigate} onClick={() => setOpen(false)} className="nav-cta">Build My App</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Logo navigate={navigate} />
        <nav aria-label="Footer navigation">
          {navItems.slice(1).map(([label, href]) => <Link key={href} href={href} navigate={navigate}>{label}</Link>)}
        </nav>
        <p>© 2026 Spellbound Studios. Thoughtful software, made with care.</p>
      </div>
    </footer>
  );
}

function ButtonLink({ href, navigate, children, secondary = false, className = '' }) {
  return <Link href={href} navigate={navigate} className={`button ${secondary ? 'secondary' : ''} ${className}`}>{children}<ArrowRight size={17} /></Link>;
}

function StatusBadge({ status }) {
  const token = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-badge status-${token}`}>{status}</span>;
}

function ImageFrame({ src, alt, className = '', label }) {
  return (
    <figure className={`image-frame ${className}`}>
      <img src={src} alt={alt} />
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

function SectionHeading({ title, intro, link, linkLabel, navigate }) {
  return (
    <div className="section-heading">
      <div><h2>{title}</h2>{intro && <p>{intro}</p>}</div>
      {link && <Link href={link} navigate={navigate} className="text-link">{linkLabel}<ArrowRight size={15} /></Link>}
    </div>
  );
}

function ProjectCard({ project, navigate, wide = false }) {
  return (
    <article className={`project-card accent-${project.accent} ${wide ? 'wide' : ''}`}>
      <Link href={`/apps/${project.slug}`} navigate={navigate} className="project-card-image" aria-label={`View ${project.name}`}>
        <img src={project.image} alt="" />
        <StatusBadge status={project.status} />
      </Link>
      <div className="project-card-copy">
        <p className="project-category">{project.categories[0]}</p>
        <h3><Link href={`/apps/${project.slug}`} navigate={navigate}>{project.name}</Link></h3>
        {project.displayNote && <p className="display-note">— {project.displayNote}</p>}
        <p>{project.shortDescription}</p>
        <Link href={`/apps/${project.slug}`} navigate={navigate} className="round-link" aria-label={`Explore ${project.name}`}><ArrowRight /></Link>
      </div>
    </article>
  );
}

const categories = [
  ['Everyday Life', 'A gentler rhythm for practical days.', '✦'],
  ['Cats & Breeding', 'Tools shaped around real cattery life.', '♧'],
  ['AI & Consciousness', 'New ways to think, connect, and explore.', '◈'],
  ['Creativity & Self', 'Room for expression and reflection.', '❋'],
  ['Faith & Story', 'Old stories, fresh voices, honest context.', '✧'],
  ['Experiments', 'Curious sparks with somewhere to go.', '⌁'],
];

function Home({ navigate }) {
  const active = projects.filter((p) => ['Active Build', 'Prototype', 'Design'].includes(p.status)).slice(0, 3);
  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>Spellbound<br />Studios</h1>
          <p className="hero-tagline">Tools for a more magical life.</p>
          <p>We build thoughtful apps for everyday life, creativity, connection, exploration, and the unusual spaces in between.</p>
          <div className="button-row">
            <ButtonLink href="/apps" navigate={navigate}>Explore the Apps</ButtonLink>
            <ButtonLink href="/progress" navigate={navigate} secondary>See What We’re Building</ButtonLink>
          </div>
          <p className="handwritten">Small tools. Brighter days.</p>
        </div>
        <ImageFrame src="/images/studio-hero.jpg" alt="A warm creative studio desk with notebooks, botanicals, and a cat" className="hero-image" />
      </section>

      <section className="category-rail" aria-label="Project categories">
        {categories.map(([name, description, icon]) => (
          <Link key={name} href={`/apps?category=${encodeURIComponent(name)}`} navigate={navigate}>
            <span className="category-icon">{icon}</span><span><strong>{name}</strong><small>{description}</small></span><ArrowRight size={16} />
          </Link>
        ))}
      </section>

      <section className="page-section featured-section">
        <SectionHeading title="Featured projects" intro="A growing collection of useful, curious tools—each one born from a real need and shaped with care." link="/apps" linkLabel="Explore all apps" navigate={navigate} />
        <div className="featured-grid">
          {projects.filter((p) => p.featured).map((project, index) => <ProjectCard key={project.slug} project={project} navigate={navigate} wide={index === 0} />)}
        </div>
      </section>

      <section className="spark-band">
        <div>
          <Feather size={32} />
          <h2>From spark to software</h2>
          <p>Every project begins with a question, becomes a shape, and grows through clear, visible stages. The progress dashboard keeps that journey honest.</p>
          <ButtonLink href="/progress" navigate={navigate}>Follow the work</ButtonLink>
        </div>
        <div className="spark-steps" aria-label="Development stages">
          {['Idea', 'UX concept', 'Visual design', 'Core build', 'Testing', 'Launch'].map((step, index) => (
            <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>
          ))}
        </div>
      </section>

      <section className="page-section studio-now">
        <SectionHeading title="Currently in the studio" intro="The work with its sleeves rolled up—pulled from the same project records that power every progress view." link="/progress" linkLabel="View full progress" navigate={navigate} />
        <div className="now-grid">
          {active.map((project) => (
            <article key={project.slug}>
              <img src={project.image} alt="" />
              <div><StatusBadge status={project.status} /><h3>{project.name}</h3><p>{project.currentFocus}</p><Link href={`/apps/${project.slug}`} navigate={navigate} className="text-link">Open project<ArrowRight size={15} /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <JournalPreview navigate={navigate} />
      <ClosingCta navigate={navigate} />
    </main>
  );
}

function JournalPreview({ navigate }) {
  return (
    <section className="page-section journal-preview">
      <SectionHeading title="Studio Journal" intro="Notes from the build: decisions, discoveries, and the small steps between idea and launch." link="/journal" linkLabel="Read the journal" navigate={navigate} />
      <div className="journal-row">
        {journalEntries.slice(0, 3).map((entry) => (
          <article key={entry.title}><time>{formatDate(entry.date)}</time><p className="project-category">{entry.project}</p><h3>{entry.title}</h3><p>{entry.summary}</p></article>
        ))}
      </div>
    </section>
  );
}

function ClosingCta({ navigate }) {
  return (
    <section className="closing-cta">
      <BotanicalMark />
      <div><h2>Have an idea tugging at you?</h2><p>Spellbound Studios is new, curious, and open to helping thoughtful app ideas find their first real shape.</p></div>
      <ButtonLink href="/contact#build" navigate={navigate}>Build My App</ButtonLink>
    </section>
  );
}

function PageIntro({ title, children, image }) {
  return (
    <section className="page-intro">
      <div><h1>{title}</h1><p>{children}</p></div>
      {image ? <ImageFrame src={image} alt="" /> : <div className="intro-botanical"><BotanicalMark /><span className="handwritten">Good ideas grow here.</span></div>}
    </section>
  );
}

function AppsPage({ path, navigate }) {
  const params = new URLSearchParams(path.split('?')[1] || '');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'All categories');
  const [status, setStatus] = useState('All statuses');
  const filtered = useMemo(() => projects.filter((project) => {
    const textMatch = `${project.name} ${project.shortDescription} ${project.categories.join(' ')}`.toLowerCase().includes(search.toLowerCase());
    return textMatch && (category === 'All categories' || project.categories.includes(category)) && (status === 'All statuses' || project.status === status);
  }), [search, category, status]);
  return (
    <main>
      <PageIntro title="Apps" image="/images/studio-hero.jpg">Thoughtful tools for practical routines, creative lives, meaningful connection, and the curious edges of experience.</PageIntro>
      <section className="page-section directory">
        <div className="filters">
          <label className="search-field"><Search size={18} /><span className="sr-only">Search apps</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search apps" /></label>
          <label><span className="sr-only">Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}>{categoryOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
          <label><span className="sr-only">Status</span><select value={status} onChange={(e) => setStatus(e.target.value)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></label>
          <p>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</p>
        </div>
        {filtered.length ? <div className="directory-grid">{filtered.map((project) => <ProjectCard key={project.slug} project={project} navigate={navigate} />)}</div> : <div className="empty-state"><Sparkles /><h2>No projects found</h2><p>Try a different search or filter.</p></div>}
      </section>
      <section className="incubator-strip"><div><h2>More ideas are always brewing.</h2><p>The Incubator holds the promising sparks that have not become full projects—yet.</p></div><ButtonLink href="/incubator" navigate={navigate} secondary>Visit the Incubator</ButtonLink></section>
    </main>
  );
}

function ProjectDetail({ project, navigate }) {
  const [lightbox, setLightbox] = useState(null);
  const related = journalEntries.filter((entry) => entry.project.includes(project.name.split(' ')[0]) || entry.project === 'Spellbound Studios').slice(0, 2);
  const gallery = project.screenshots.map(normalizeMedia);
  const hasCurrentBuild = gallery.some((item) => item.label === 'Current Build');
  return (
    <main className={`project-detail accent-${project.accent}`}>
      <section className="project-hero">
        <Link href="/apps" navigate={navigate} className="back-link">← All apps</Link>
        <div className="project-hero-copy">
          <div><p className="project-category">{project.categories.join(' · ')}</p><h1>{project.name}</h1>{project.displayNote && <p className="name-note">{project.displayNote}</p>}<p className="project-tagline">{project.tagline}</p><p>{project.shortDescription}</p><div className="badge-row"><StatusBadge status={project.status} /><span>{project.phase}</span></div>{project.liveUrl && <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">View current build <ExternalLink size={15} /></a>}</div>
          <ImageFrame src={project.image} alt={`${project.name} project preview`} label={project.imageLabel || 'Concept Design'} />
        </div>
      </section>

      <section className="page-section detail-overview">
        <div><p className="section-label">What it is</p><h2>{hasCurrentBuild ? 'A working project with room to grow.' : 'An idea with room to become real.'}</h2><p>{project.longDescription}</p></div>
        <div><p className="section-label">Key features</p><ul className="feature-list">{project.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul></div>
      </section>

      <section className="gallery-section">
        <div className="section-heading"><div><p className="section-label">Inside the project</p><h2>Project gallery</h2><p>{hasCurrentBuild ? 'Real build captures are labeled Current Build. Planned views remain clearly marked as concepts.' : 'These planned views are clearly labeled concepts—not claims of live software.'}</p></div></div>
        <div className="gallery-rail">{gallery.map((item, index) => <button key={`${item.src}-${index}`} onClick={() => setLightbox(index)} aria-label={`Open ${item.caption || `${project.name} image ${index + 1}`}`}><img src={item.src} alt={item.caption || `${project.name} gallery image ${index + 1}`} /><span className={mediaTone(item.label)}><ZoomIn size={17} />{item.label}</span></button>)}</div>
      </section>

      <section className="page-section timeline-section">
        <SectionHeading title="Development timeline" intro={`Current phase: ${project.phase}. Progress comes directly from the project milestone record.`} />
        <MilestoneRail milestones={project.milestones} />
      </section>

      <section className="page-section work-columns">
        <WorkList title="Recently completed" items={project.recentlyCompleted} tone="complete" />
        <WorkList title="Working on now" items={project.workingOn} tone="active" />
        <WorkList title="Up next" items={project.nextUp} tone="next" />
        <WorkList title="Backlog / someday" items={project.backlog} tone="backlog" />
      </section>

      <section className="page-section project-notes">
        <div><Feather /><p className="section-label">Notes / blockers</p><p>{project.notes}</p></div>
        <div><CalendarDays /><p className="section-label">Last project record update</p><p>{formatDate(project.lastUpdated)}</p></div>
      </section>

      <section className="page-section related-journal">
        <SectionHeading title="Related journal entries" link="/journal" linkLabel="All journal notes" navigate={navigate} />
        <div className="journal-row">{related.map((entry) => <article key={entry.title}><time>{formatDate(entry.date)}</time><h3>{entry.title}</h3><p>{entry.summary}</p></article>)}</div>
      </section>
      <ClosingCta navigate={navigate} />
      {lightbox !== null && <Lightbox images={gallery} index={lightbox} name={project.name} setIndex={setLightbox} onClose={() => setLightbox(null)} />}
    </main>
  );
}

function Lightbox({ images, index, name, setIndex, onClose }) {
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') setIndex((index + 1) % images.length); if (e.key === 'ArrowLeft') setIndex((index - 1 + images.length) % images.length); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [images.length, index, onClose, setIndex]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} project gallery`} onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close"><X /></button>
      <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + images.length) % images.length); }} aria-label="Previous">←</button>
      <figure onClick={(e) => e.stopPropagation()}><img src={images[index].src} alt={images[index].caption || `${name} gallery image ${index + 1}`} /><figcaption><strong>{images[index].label}</strong>{images[index].caption ? ` · ${images[index].caption}` : ''} · {index + 1} of {images.length}</figcaption></figure>
      <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % images.length); }} aria-label="Next">→</button>
    </div>
  );
}

function MilestoneRail({ milestones, vertical = false }) {
  return (
    <div className={vertical ? 'milestone-rail vertical' : 'milestone-rail'}>
      {milestones.map((milestone) => (
        <div key={milestone.name} className={`milestone ${milestone.status}`}>
          <span>{milestone.status === 'complete' ? <Check /> : <Circle />}</span>
          <div><strong>{milestone.name}</strong><small>{milestone.status === 'in-progress' ? 'In progress' : milestone.status === 'complete' ? 'Complete' : 'Planned'}</small></div>
        </div>
      ))}
    </div>
  );
}

function WorkList({ title, items, tone }) {
  return <article className={`work-list ${tone}`}><h3>{title}</h3><ul>{items.map((item) => <li key={item}><span />{item}</li>)}</ul></article>;
}

function ProgressPage({ navigate }) {
  const [selected, setSelected] = useState('studio');
  const project = projects.find((item) => item.slug === selected);
  return (
    <main>
      <PageIntro title="Progress">A transparent look at what we’re building—from early sparks to products taking real shape. No invented metrics, just the work as it stands.</PageIntro>
      <section className="page-section progress-page">
        <label className="project-select-label">Select a project<select value={selected} onChange={(e) => setSelected(e.target.value)}><option value="studio">Studio-wide overview</option>{projects.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><ChevronDown /></label>
        {!project ? <StudioOverview setSelected={setSelected} navigate={navigate} /> : <ProjectProgress project={project} navigate={navigate} />}
      </section>
    </main>
  );
}

function StudioOverview({ setSelected, navigate }) {
  const statusCounts = projects.reduce((acc, project) => ({ ...acc, [project.status]: (acc[project.status] || 0) + 1 }), {});
  return (
    <>
      <div className="overview-header"><div><p className="section-label">All projects</p><h2>Studio-wide overview</h2><p>Every project below is driven by the same central data used across this site.</p></div><div className="status-summary">{Object.entries(statusCounts).map(([status, count]) => <span key={status}><strong>{count}</strong>{status}</span>)}</div></div>
      <div className="overview-grid">{projects.map((project) => {
        const complete = project.milestones.filter((item) => item.status === 'complete').length;
        return <article key={project.slug} className={`overview-card accent-${project.accent}`}><img src={project.image} alt="" /><div><StatusBadge status={project.status} /><h3>{project.name}</h3><p>{project.currentFocus}</p><div className="mini-progress"><span style={{ width: `${(complete / project.milestones.length) * 100}%` }} /></div><small>{complete} of {project.milestones.length} stages complete · {project.phase}</small><button onClick={() => setSelected(project.slug)}>View progress <ArrowRight size={15} /></button><Link href={`/apps/${project.slug}`} navigate={navigate}>Project page</Link></div></article>;
      })}</div>
    </>
  );
}

function ProjectProgress({ project, navigate }) {
  const complete = project.milestones.filter((item) => item.status === 'complete').length;
  return (
    <>
      <section className={`progress-focus accent-${project.accent}`}>
        <div className="progress-title"><img src={project.image} alt="" /><div><p className="project-category">{project.categories[0]}</p><h2>{project.name}</h2><p>{project.currentFocus}</p></div><Link href={`/apps/${project.slug}`} navigate={navigate} className="text-link">Project page<ExternalLink size={15} /></Link></div>
        <div className="progress-facts"><div><span>Status</span><StatusBadge status={project.status} /></div><div><span>Overall phase</span><strong>{project.phase}</strong></div><div><span>Stage completion</span><strong>{complete} of {project.milestones.length}</strong></div></div>
        <MilestoneRail milestones={project.milestones} />
      </section>
      <div className="work-columns progress-columns"><WorkList title="Recently completed" items={project.recentlyCompleted} tone="complete" /><WorkList title="Working on now" items={project.workingOn} tone="active" /><WorkList title="Next up" items={project.nextUp} tone="next" /><WorkList title="Backlog" items={project.backlog} tone="backlog" /></div>
      <div className="notes-bar"><Feather /><div><strong>Notes / blockers</strong><p>{project.notes}</p></div></div>
    </>
  );
}

function IncubatorPage({ navigate }) {
  return (
    <main>
      <PageIntro title="Incubator" image="/images/liminal.jpg">A worktable for early ideas, active questions, and promising possibilities—looser than the main studio, but never careless.</PageIntro>
      <section className="page-section incubator-page">
        <div className="incubator-note"><Feather /><p className="handwritten">Practical tools. Creative ideas. A kinder tech future.</p></div>
        <SectionHeading title="Three current sparks" intro="Different paths, with one shared intention: make something helpful, thoughtful, and alive to the people using it." />
        <div className="idea-stack">{incubatorIdeas.map((idea, index) => <article key={idea.name}><span className="note-number">0{index + 1}</span><img src={idea.image} alt="" /><div><span className={`idea-state ${idea.state.toLowerCase()}`}>{idea.state}</span><h2>{idea.name}</h2><p><strong>The spark</strong>{idea.spark}</p><p><strong>What it might become</strong>{idea.mightBecome}</p></div></article>)}</div>
      </section>
      <ClosingCta navigate={navigate} />
    </main>
  );
}

function JournalPage({ navigate }) {
  return (
    <main>
      <PageIntro title="Journal" image="/images/studio-hero.jpg">A record of what the studio is building, learning, and deciding—from early sparks to working software.</PageIntro>
      <section className="page-section journal-page">
        <div className="journal-timeline">{journalEntries.map((entry) => <article key={entry.title}><time>{formatDate(entry.date)}</time><span className="timeline-dot" /><div><p className="project-category">{entry.project}</p><h2>{entry.title}</h2><p>{entry.summary}</p><div className="tag-row">{entry.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div></article>)}</div>
      </section>
      <ClosingCta navigate={navigate} />
    </main>
  );
}

function AboutPage({ navigate }) {
  return (
    <main>
      <PageIntro title="A small studio with a wide-open curiosity." image="/images/studio-hero.jpg">Spellbound Studios builds its own software while helping thoughtful ideas find a practical path into the world.</PageIntro>
      <section className="page-section about-story">
        <div><p className="section-label">Why the studio exists</p><h2>Useful can still feel meaningful.</h2><p>Spellbound Studios is a new, independent creative software studio. The work moves between practical daily tools, niche professional systems, playful creative spaces, AI, and questions about consciousness and connection.</p><p>The common thread is care: listen closely, make the structure understandable, and leave room for personality. The goal is not to add more noise. It is to build things that help people feel a little more capable, connected, curious, or at home.</p></div>
        <ImageFrame src="/images/studio-hero.jpg" alt="A warm, thoughtful creative workspace" />
      </section>
      <section className="page-section principles"><article><Feather /><h3>Start with the real need</h3><p>A beautiful surface matters most when it grows from the problem underneath.</p></article><article><ShieldCheck /><h3>Be honest about the edges</h3><p>Concepts stay labeled as concepts. Simulations do not pretend to be originals.</p></article><article><Layers3 /><h3>Build systems that can grow</h3><p>Shared foundations and central data keep the studio coherent as the ideas multiply.</p></article></section>
      <ClosingCta navigate={navigate} />
    </main>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    localStorage.setItem('spellbound-studios-project-brief', JSON.stringify({ ...formData, savedAt: new Date().toISOString() }));
    setSubmitted(true);
  };
  return (
    <main>
      <PageIntro title="Build My App" image="/images/studio-hero.jpg">Have an app idea that will not leave you alone? Let’s give it shape, find the clearest first version, and see what it could become.</PageIntro>
      <section className="page-section contact-layout" id="build">
        <aside><p className="section-label">A collaborative, personal approach</p><h2>Start with the idea—not the jargon.</h2><p>You do not need a perfect brief. Tell us who the idea is for, what it changes, and what you hope it might do. The first step is a clear conversation about fit, scope, and a useful way forward.</p><div className="contact-promise"><Mail /><p><strong>What happens in this first version?</strong>Your answers are saved only in this browser as a draft. No message is sent until a studio inbox is connected before launch.</p></div></aside>
        <div className="form-wrap">
          {submitted ? <div className="form-success"><Sparkles /><h2>Your project brief is saved.</h2><p>This preview keeps it on this device only—it has not been sent. You can return and update it while the live inbox connection is being prepared.</p><button className="button" onClick={() => setSubmitted(false)}>Edit my brief <ArrowRight size={17} /></button></div> : <ProjectForm onSubmit={handleSubmit} />}
        </div>
      </section>
      <PricingExamples />
    </main>
  );
}

function ProjectForm({ onSubmit }) {
  return (
    <form className="project-form" onSubmit={onSubmit}>
      <div className="form-heading"><p className="section-label">Project intake</p><h2>Tell me about your idea</h2><p>A few honest notes are more useful than a polished pitch.</p></div>
      <div className="form-grid"><label>Name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label></div>
      <label>Project or app idea<input name="idea" required placeholder="A short working title or summary" /></label>
      <label>Who is it for?<textarea name="audience" rows="2" /></label>
      <label>What problem does it solve?<textarea name="problem" rows="3" required /></label>
      <label>Must-have features<textarea name="features" rows="3" /></label>
      <div className="form-grid"><label>What kind of help do you need?<select name="help" required defaultValue=""><option value="" disabled>Choose one</option><option>Strategy</option><option>UX</option><option>Visual design</option><option>Prototype</option><option>Full build</option><option>Unsure</option></select></label><label>Platforms<select name="platforms" defaultValue="Unsure"><option>Web</option><option>iOS</option><option>Android</option><option>All</option><option>Unsure</option></select></label></div>
      <div className="form-grid"><label>Desired timing<input name="timing" placeholder="Flexible, this season, a date…" /></label><label>Budget range<select name="budget" defaultValue="Unsure"><option>Unsure</option><option>Under $5k</option><option>$5k–$15k</option><option>$15k–$30k</option><option>$30k+</option></select></label></div>
      <label>Reference links<input name="references" type="url" placeholder="https://" /></label>
      <label>Anything else?<textarea name="anythingElse" rows="3" /></label>
      <button className="button" type="submit">Save my project brief <ArrowRight size={17} /></button>
    </form>
  );
}

function PricingExamples() {
  return (
    <section className="pricing-section">
      <div><p className="section-label">Example starting ranges — pending final review</p><h2>A first sense of scale</h2><p>These are planning examples, not quotes. Final pricing will be reviewed before publication.</p></div>
      <div className="pricing-rows"><article><span>Focused concept</span><strong>$3k–$7k</strong><p>Product strategy, core UX, and a polished interactive prototype.</p></article><article><span>First working product</span><strong>$8k–$18k</strong><p>A focused web app with a clear core flow and production-minded foundation.</p></article><article><span>Larger custom build</span><strong>$20k+</strong><p>Advanced workflows, integrations, accounts, payments, AI, or multi-platform scope.</p></article></div>
      <p className="pricing-note">Scope, integrations, AI features, accounts and payments, native mobile work, content, and overall complexity can all change the range.</p>
    </section>
  );
}

function NotFound({ navigate }) {
  return <main><section className="not-found"><BotanicalMark /><h1>This path wandered off.</h1><p>The page may have moved, or it may still be waiting in the Incubator.</p><ButtonLink href="/" navigate={navigate}>Back to the studio</ButtonLink></section></main>;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export default function App() {
  const { path, navigate } = useRouter();
  const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
  let page;
  if (cleanPath === '/') page = <Home navigate={navigate} />;
  else if (cleanPath === '/apps') page = <AppsPage path={path} navigate={navigate} />;
  else if (cleanPath.startsWith('/apps/')) {
    const project = projects.find((item) => item.slug === cleanPath.split('/')[2]);
    page = project ? <ProjectDetail project={project} navigate={navigate} /> : <NotFound navigate={navigate} />;
  } else if (cleanPath === '/progress') page = <ProgressPage navigate={navigate} />;
  else if (cleanPath === '/incubator') page = <IncubatorPage navigate={navigate} />;
  else if (cleanPath === '/journal') page = <JournalPage navigate={navigate} />;
  else if (cleanPath === '/about') page = <AboutPage navigate={navigate} />;
  else if (cleanPath === '/contact') page = <ContactPage />;
  else page = <NotFound navigate={navigate} />;

  return <><Header path={path} navigate={navigate} />{page}<Footer navigate={navigate} /></>;
}
