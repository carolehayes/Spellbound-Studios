# Launchpad milestone 1 — owner review

This is a preview implementation, not a commercial launch. No sale eligibility, pricing or research publication has been approved. Existing project slugs and public catalog records are reused; no patient, customer, buyer, collaborator or private client data is present. Two known public portfolio records demonstrate listing structure only, and the interface explicitly states neither is offered for sale.

## Preview

Run `LAUNCHPAD_REVIEW=1 npm run build` for a local review build, or use Vite dev. Vercel preview builds activate the example route; normal production builds exclude the route, navigation item and dynamically imported preview code. This flag is a build exclusion, not identity authorization. Do not put confidential records in the review bundle, even on a protected deployment. Do not merge before owner approval.

## What's implemented

- Shared studio navigation, editorial listing layout, two differentiated sample treatments, five listing sections, illustrative acquisition modes, non-transmitting interest selectors, and a link to existing manual email intake.
- Calculator separates gross, annual gross, monthly surplus and simple recovery with hypothetical values; negative surplus has no recovery period.
- Frozen required scope calculation counts only verified applicable weight; unassessed scope returns no percentage. No real feature audit or readiness claim.

## Next gates

1. Confirm permitted repository and hosting visibility; owner reviews layout, visual treatments and approval model. No production merge or paid commitments.
2. Confirm server-side owner identity and data storage architecture; private commercial settings and public allowlisted projection. No migration until authorization, roles and data isolation are verified. Database fields must never be embedded in static browser bundles.
3. Audit the first selected project's rights, dependencies and versioned launch scope; assess required readiness gates separately. Actual availability is an explicit owner action, not inferred from code progress.
4. Draft sourced and dated market reports; validate competitor signals, direct evidence and hypothetical scenarios separately. Owner approval required before publishing any report or price.
5. Implement consent-aware lead routes only after verified authorized inbox/storage integration. Contact PR #6 remains separate; existing manual email draft is unchanged. No claims that any preview interaction saves or sends an inquiry.
6. Later: private buyer portal, written scope and acceptance milestones, escrow/payment and transfer arrangements after appropriate contractual, security and operational review.

The user's handoff contains the full market-validation and architecture proposal. Preserve it as owner review material, not production public copy.
