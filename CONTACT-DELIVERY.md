# Direct contact delivery (prepared, not enabled)

The current live site offers the explicit email-draft handoff to the temporary inbox. The proposed direct-delivery version uses Resend on the server and retains that fallback. It remains disabled unless the required server-only settings are configured and the enable switch is set. Do not enter any secret into chat, public source, or client-side environment variables.

## Required configuration

- `RESEND_API_KEY`: a sending credential authorized for this studio project, stored securely in Vercel.
- `STUDIO_CONTACT_FROM`: a sender address on a verified sending domain.
- `STUDIO_CONTACT_TO`: the preferred inquiry inbox (currently `carolehayes@gmail.com`).
- `DATABASE_URL` or `POSTGRES_URL`: authorized studio rate-limiting database connection; the route creates a small isolated counter table only when enabled.
- `STUDIO_CONTACT_RATE_SALT`: unique secret for hashing rate-limit identifiers.
- `STUDIO_CONTACT_ENABLED`: set to `true` only after configuration and verification.

The route accepts fixed-recipient, bounded, plain-text inquiries; it uses allowlisted site origins, a honeypot, persistent per-client/global rate counters and provider idempotency. No email contents or credentials should be logged. Rate counters contain hashed identities and short-lived timestamps, not inquiry content. The provider receives the submitted brief and the visitor's reply-to address only after explicit direct submission.

## Verification before enabling

1. Confirm the provider account/domain is authorized for this project and that the studio database can safely create the isolated counter table.
2. Configure the authorized credentials in the project settings; do not reuse secrets from another project without permission.
3. Test disabled and invalid-input responses. Enable only when ready for a bounded fictional test from the intended production origin.
4. Send one clearly labeled test inquiry, confirm receipt in the selected inbox, verify the reply-to, then verify the visitor success/fallback states and rate limits.
5. If delivery cannot be confirmed, disable the switch and continue using the existing email handoff.

Provider reference: https://resend.com/docs/api-reference/emails/send-email
