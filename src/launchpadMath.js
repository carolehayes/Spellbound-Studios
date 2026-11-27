export function calculateScenario({ subscribers, monthlyPrice, expenses, acquisitionCost }) {
  const safe = (value) => Math.max(0, Math.min(1e9, Number(value) || 0));
  const gross = safe(subscribers) * safe(monthlyPrice);
  const surplus = gross - safe(expenses);
  return { gross, annual: gross * 12, surplus, recovery: surplus > 0 ? safe(acquisitionCost) / surplus : null };
}

export function summarizeScope(scope) {
  if (!scope?.frozen || !scope.features?.length) return { progress: null, verified: 0, required: 0 };
  const applicable = scope.features.filter((f) => f.required && f.status !== 'not applicable' && Number.isFinite(f.weight) && f.weight > 0);
  const required = applicable.reduce((sum, f) => sum + f.weight, 0);
  const verified = applicable.filter((f) => f.status === 'verified').reduce((sum, f) => sum + f.weight, 0);
  return { progress: required ? Math.round(100 * verified / required) : null, verified, required };
}
