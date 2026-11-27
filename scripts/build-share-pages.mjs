import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { projects } from '../src/data.js';

const root = 'https://spellboundstudios.dev';
const html = readFileSync('dist/index.html', 'utf8');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const title = (p) => `${p.name} | Spellbound Studios`;
const description = (p) => `${p.shortDescription} ${p.status}. Explore the project and its development roadmap.`;
mkdirSync('dist/share-pages', { recursive: true });
for (const p of projects) {
  const url = `${root}/apps/${p.slug}`;
  const image = `${root}${p.image}`;
  let page = html.replace(/<title>.*?<\/title>/, `<title>${escape(title(p))}</title>`);
  const fields = { description: description(p), 'og:title': title(p), 'og:description': description(p), 'og:url': url, 'og:image': image, 'twitter:title': title(p), 'twitter:description': description(p), 'twitter:image': image };
  for (const [key, value] of Object.entries(fields)) {
    const regex = new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("[^>]*>)`);
    page = page.replace(regex, (_, prefix, end) => `${prefix}${escape(value)}${end}`);
  }
  page = page.replace(/(<link rel="canonical" href=")[^"]*("[^>]*>)/, (_, prefix, end) => `${prefix}${url}${end}`);
  writeFileSync(`dist/share-pages/${p.slug}.html`, page);
}
console.log(`Generated ${projects.length} individual social sharing pages.`);
