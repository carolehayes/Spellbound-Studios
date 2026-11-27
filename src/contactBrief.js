export const STUDIO_INBOX = 'carolehayes@gmail.com';

export function formatProjectBrief(data) {
  const fields = [
    ['Name', 'name'], ['Email', 'email'], ['Project idea', 'idea'], ['Audience', 'audience'],
    ['Problem to solve', 'problem'], ['Must-have features', 'features'], ['Help needed', 'help'],
    ['Platforms', 'platforms'], ['Timing', 'timing'], ['Budget', 'budget'], ['Reference links', 'references'], ['Other notes', 'anythingElse'],
  ];
  return ['Spellbound Studios project inquiry', '', ...fields.flatMap(([label, key]) => [`${label}: ${String(data[key] || '').trim() || 'Not provided'}`, ''])].join('\n');
}

export function projectEmailHref(data) {
  const subject = `Spellbound Studios inquiry: ${String(data.idea || 'New project').trim().replace(/[\r\n]/g, ' ').slice(0, 160)}`;
  return `mailto:${STUDIO_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatProjectBrief(data))}`;
}
