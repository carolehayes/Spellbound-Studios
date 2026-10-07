// Everything the Cattery App page says lives here as data, so wording and the naming shortlist
// can change without touching the page code. (Pure JS, no JSX: api/poll.js imports NAME_CHOICES.)

// Where the early-access form posts. Lives in the cattery portal database, staff-only.
export const SIGNUP_URL = 'https://portal.spellboundsiberiancats.com/api/breeder-signup';

// The naming shortlist. `id` is what a vote is stored under — never reuse an id for a different name.
// Struck from an earlier draft because other breeder-software products already use them: Breeder Desk, Litterbook.
export const NAME_CHOICES = [
  { id: 'catteryflow', label: 'CatteryFlow', line: 'The customizable cattery management suite.' },
  { id: 'littermate', label: 'Littermate', line: 'Everything about the litter, kept together.' },
  { id: 'nestwell', label: 'Nestwell', line: 'A well-kept nest for your cattery.' },
  { id: 'cattery-keeper', label: 'Cattery Keeper', line: 'Plain, warm and exactly what it does.' },
];

export const PLANS = {
  intro: 'Plans will run from about $4 to $15 a month, with higher levels to come as we work out what each one includes.',
  beta: 'Beta testers use it free while we build it together, and reduced pricing afterward is shaped by how much you help.',
  referral: 'Refer another breeder and earn free months.',
};

export const FEATURES = [
  ['Litters and kittens', 'Births, weights, collars, photos, health and go-home dates for every kitten, in one place.'],
  ['Waitlist and selection', 'Who is next, who has chosen, and where each family stands, without a spreadsheet.'],
  ['A storefront that is yours', 'Show available kittens on your own page and take deposits through your own payment setup.'],
  ['Family portal', 'Each new owner gets their own login for photos, paperwork and care guides.'],
  ['Messages and records', 'Conversations with families sit beside their kitten, so nothing lives only in your phone.'],
  ['Guardian homes', 'If you place breeding cats in guardian homes, they get a simple portal for weights, health and updates.'],
];
