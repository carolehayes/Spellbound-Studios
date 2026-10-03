# Spellbound Studios

The first working version of the public Spellbound Studios website for `spellboundstudios.dev`.

## What is included

- Home, Apps, Project Detail, Progress, Incubator, Journal, About, and Contact pages
- Responsive desktop and mobile layouts
- One central project data source in `src/data.js`
- Search and category/status filtering
- Studio-wide and per-project progress views derived from milestone data
- Concept gallery with an accessible lightbox
- Structured Incubator ideas and Journal entries
- A project-intake form that saves a private draft to the current browser

## Local development

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run lint
npm run build
```

## Content notes

- Project imagery is concept art and is labeled accordingly on project pages.
- Project statuses and milestone records are editable seed content; update them in `src/data.js` as the studio work changes.
- The contact form does **not** transmit data in this first version. It saves a local browser draft until a real inbox or form service is connected.
- Pricing examples are visibly marked as pending final review.
- The site is ready for a later database or lightweight admin layer without duplicating project content across pages.

No production deployment has been configured or performed.
