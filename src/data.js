const phases = ['Idea', 'UX concept', 'Visual design', 'Core build', 'Feature development', 'Testing', 'Launch'];

const makeMilestones = (currentIndex) => phases.map((name, index) => ({
  name,
  status: index < currentIndex ? 'complete' : index === currentIndex ? 'in-progress' : 'planned',
}));

export const projects = [
  {
    slug: 'smoothie-spellbook',
    name: 'Smoothie Spellbook',
    tagline: 'A more intuitive way to nourish your day.',
    shortDescription: 'A flexible recipe, pantry, and planning companion with practical nutrition and a little everyday magic.',
    longDescription: 'Smoothie Spellbook brings recipes, pantry awareness, shopping, meal planning, and creative recipe-making into one customizable home. Its ingredient layer can hold both nutritional details and traditional metaphysical associations without confusing one for the other.',
    categories: ['Everyday Life', 'Creativity & Self'],
    status: 'Active Build',
    phase: 'Visual design',
    accent: 'berry',
    image: '/images/screenshots/smoothie/home.png',
    imageLabel: 'Current Build',
    liveUrl: 'https://smoothie-spellbook.vercel.app',
    featured: true,
    lastUpdated: '2026-10-03',
    currentFocus: 'Defining the core experience and reusable visual system.',
    nextMilestone: 'Translate the agreed flows into a focused core build.',
    notes: 'Product scope is rich; the first release needs a deliberately small center.',
    features: ['Recipes and personal collections', 'Pantry and Pantry Scan concepts', 'Use What I Have suggestions', 'Shopping and meal planning', 'AI-assisted recipe creation', 'Nutrition and metaphysical ingredient layers', 'Custom spellbook interiors and covers'],
    milestones: makeMilestones(2),
    recentlyCompleted: ['Core product themes collected', 'Primary feature groups organized', 'Light visual direction chosen'],
    workingOn: ['Core navigation and recipe flow', 'A flexible ingredient data model', 'Visual language for book customization'],
    nextUp: ['Prioritize first-release features', 'Prototype recipe creation', 'Plan Pantry Scan research'],
    backlog: ['Shared spellbooks', 'Seasonal collections', 'Print-friendly recipe cards'],
    screenshots: [
      { src: '/images/screenshots/smoothie/home.png', label: 'Current Build', caption: 'Home and personalized recommendations' },
      { src: '/images/screenshots/smoothie/recipes.png', label: 'Current Build', caption: 'Recipe library and filters' },
      { src: '/images/screenshots/smoothie/pantry.png', label: 'Current Build', caption: 'Pantry and Use What I Have' },
      { src: '/images/screenshots/smoothie/plan.png', label: 'Current Build', caption: 'Flexible weekly planning' },
    ],
  },
  {
    slug: 'kitchen-spellbook',
    name: 'Kitchen Spellbook',
    tagline: 'Your whole kitchen, gathered into one beautiful book.',
    shortDescription: 'The full-recipe sibling to Smoothie Spellbook, designed for cooking, planning, importing, and family favorites.',
    longDescription: 'Kitchen Spellbook expands the same thoughtful foundation into everyday cooking: recipe importing, pantry awareness, Use What I Have, meal plans, shopping, a focused cooking mode, family favorites, and selectable book styles.',
    categories: ['Everyday Life'], status: 'Prototype', phase: 'UX concept', accent: 'terracotta', image: '/images/kitchen.jpg', featured: true, lastUpdated: '2026-10-03',
    currentFocus: 'Clarifying where shared foundations end and the cooking-specific experience begins.', nextMilestone: 'Map the core recipe-to-cooking journey.', notes: 'Designed as a sibling product, while keeping its own purpose and pace.',
    features: ['Recipe importing', 'Pantry and Use What I Have', 'Meal plans and shopping lists', 'Distraction-light cooking mode', 'Family favorites', 'Selectable book styles'],
    milestones: makeMilestones(1), recentlyCompleted: ['Product relationship defined', 'Feature inventory gathered'], workingOn: ['Core cooking journeys', 'Shared Spellbook foundations'], nextUp: ['Import flow concept', 'Cooking mode prototype'], backlog: ['Household collaboration', 'Seasonal menus'], screenshots: [
      { src: '/images/screenshots/kitchen/dashboard-concept.png', label: 'Concept Design', caption: 'Dashboard, pantry, meal plan, and shopping direction' },
      { src: '/images/kitchen.jpg', label: 'Concept Direction', caption: 'Kitchen Spellbook visual atmosphere' },
    ],
  },
  {
    slug: 'cattery-management',
    name: 'Cattery Management',
    displayNote: 'Name in progress',
    tagline: 'A calmer operating system for thoughtful breeders.',
    shortDescription: 'One organized home for cats, litters, kittens, families, health, paperwork, communication, and daily operations.',
    longDescription: 'A full cattery operating system built around the real shape of breeder work: cats, litters, kittens, families, waitlists, health, contracts, invoices and payments, communications, guardians, and inventory. The owner portal and kitten selection workflows live inside this product—not as separate apps.',
    categories: ['Cats & Breeding'], status: 'Active Build', phase: 'Core build', accent: 'blue', image: '/images/cattery.jpg', liveUrl: 'https://spellbound-cattery-app.vercel.app', featured: true, lastUpdated: '2026-10-03',
    currentFocus: 'Bringing related breeder workflows into one coherent system.', nextMilestone: 'Complete the connective workflows between kittens, families, and records.', notes: 'The final product name is intentionally still open.',
    features: ['Cats, litters, and kittens', 'Families and waitlist', 'Health records', 'Contracts, invoices, and payments', 'Communications and guardians', 'Inventory', 'Built-in owner portal', 'Built-in kitten selection workflow'],
    milestones: makeMilestones(3), recentlyCompleted: ['Product boundaries clarified', 'Portal and selections confirmed as integrated workflows'], workingOn: ['Core operating records', 'Connected family journey'], nextUp: ['Refine permissions', 'Simplify daily breeder views'], backlog: ['Modular breeder tool connections', 'Optional public-site widgets'], screenshots: [
      { src: '/images/screenshots/cattery/home.png', label: 'Current Build', caption: 'Secure cattery management sign-in' },
      { src: '/images/screenshots/cattery/store.png', label: 'Current Build', caption: 'Public kitten storefront' },
      { src: '/images/screenshots/cattery/litter-calendar.png', label: 'Current Build', caption: 'Public litter calendar' },
      { src: '/images/cattery.jpg', label: 'Concept Direction', caption: 'Cattery product visual direction' },
    ],
  },
  {
    slug: 'ai-group-chat', name: 'AI Group Chat', tagline: 'Bring several minds into the same conversation.', shortDescription: 'A multi-AI conversation room where models can explore a problem with the user and with one another.',
    longDescription: 'AI Group Chat explores collaborative conversations across multiple AI models: shared context, distinct perspectives, model-to-model discussion, and a synthesis that helps the user see the whole exchange clearly.',
    categories: ['AI & Consciousness'], status: 'Design', phase: 'Visual design', accent: 'indigo', image: '/images/ai-group.jpg', featured: true, lastUpdated: '2026-10-03', currentFocus: 'Defining orchestration, shared context, and legible turn-taking.', nextMilestone: 'Prototype one complete collaborative conversation.', notes: 'AI Group Chat is the current product name; the former name is retired.',
    features: ['Multiple models in one room', 'Shared conversation context', 'Model-to-model discussion', 'User-directed participation', 'Clear synthesis', 'Perspective and source labeling'], milestones: makeMilestones(2), recentlyCompleted: ['Current name confirmed', 'Collaboration premise defined'], workingOn: ['Conversation roles', 'Synthesis behavior'], nextUp: ['Core room prototype', 'Model transparency patterns'], backlog: ['Saved expert panels', 'Reusable conversation templates'], screenshots: [
      { src: '/images/screenshots/ai-group/conversation-concept.png', label: 'Concept Design', caption: 'Multi-model room with shared context and synthesis' },
      { src: '/images/ai-group.jpg', label: 'Concept Direction', caption: 'Collaborative intelligence visual direction' },
    ],
  },
  {
    slug: 'phoenix-chat', name: 'Phoenix Chat', tagline: 'A thoughtful home for AI experiences worth remembering.', shortDescription: 'A preservation-minded concept for revisiting retired models and carefully reconstructed older AI experiences.',
    longDescription: 'Phoenix Chat is part archive, part conversation space: a way to remember the feel and history of retired AI systems. Every experience must clearly distinguish genuine access to an older model from a modern-model simulation or reconstruction.',
    categories: ['AI & Consciousness'], status: 'Planning', phase: 'UX concept', accent: 'ember', image: '/images/phoenix.jpg', featured: false, lastUpdated: '2026-10-03', currentFocus: 'Researching what can be preserved truthfully and how to label every experience.', nextMilestone: 'Define the provenance and disclosure system.', notes: 'Model availability is the central constraint. No reconstruction should be presented as the original.',
    features: ['Retired-model archive concept', 'Conversation experiences', 'Model history and context', 'Provenance labels', 'Genuine-access vs reconstruction disclosure', 'Personal memory and reflection'], milestones: makeMilestones(1), recentlyCompleted: ['Transparency principle captured', 'Preservation purpose defined'], workingOn: ['Access research', 'Disclosure language'], nextUp: ['Archive structure concept', 'First experience prototype'], backlog: ['Community memories', 'Comparative model timelines'], screenshots: [
      { src: '/images/screenshots/phoenix/archive-concept.png', label: 'Concept Design', caption: 'Archive concept with explicit reconstruction disclosure' },
      { src: '/images/phoenix.jpg', label: 'Concept Direction', caption: 'Phoenix Chat preservation atmosphere' },
    ],
  },
  {
    slug: 'holy-gossip',
    name: 'Holy Gossip',
    tagline: 'The Bible, basically—same stories, fresh voices, honest receipts.',
    shortDescription: 'A playful, thoughtful way to explore Bible stories through different storytellers, formats, themes, and levels of detail.',
    longDescription: 'Holy Gossip makes Bible stories approachable without treating them carelessly. People can choose a storyteller, story format, and depth; search by verse, topic, person, or half-remembered phrase; explore Jesus-focused stories; and use the Receipts layer to distinguish the biblical account, creative retelling, context, and interpretation.',
    categories: ['Faith & Story', 'Creativity & Self'],
    status: 'Active Build',
    phase: 'Feature development',
    accent: 'gospel',
    image: '/images/screenshots/holy-gossip/home.png',
    imageLabel: 'Current Build',
    liveUrl: 'https://holy-gossip.vercel.app',
    featured: true,
    lastUpdated: '2026-10-03',
    currentFocus: 'Growing the story library and refining the path from the public site into the app experience.',
    nextMilestone: 'Connect more complete stories to the storyteller, format, and theme choices.',
    notes: 'The public web experience is live. App Store and Google Play availability are still labeled coming soon.',
    features: ['Verse, topic, person, event, and question search', 'Selectable storytellers and voices', 'Gossip, cinematic, newscast, group chat, front page, and graphic-novel formats', 'Quick Sip, Tea Break, and Full Pot depth', 'Jesus-focused exploration', 'Selectable visual themes', 'Receipts for account, context, interpretation, and creative retelling'],
    milestones: makeMilestones(4),
    recentlyCompleted: ['Public web experience established', 'Storyteller and format choices designed', 'Jesus exploration and visual themes added'],
    workingOn: ['Growing the story library', 'Refining the app experience', 'Keeping humor and accuracy in balance'],
    nextUp: ['Connect more full story experiences', 'Expand search pathways', 'Continue mobile app planning'],
    backlog: ['Native app release', 'Additional storytellers', 'More shareable formats'],
    screenshots: [
      { src: '/images/screenshots/holy-gossip/home.png', label: 'Current Build', caption: 'Public home and app preview' },
      { src: '/images/screenshots/holy-gossip/stories.png', label: 'Current Build', caption: 'Story format, storyteller, depth, and tone choices' },
      { src: '/images/screenshots/holy-gossip/jesus.png', label: 'Current Build', caption: 'Jesus story and question explorer' },
      { src: '/images/screenshots/holy-gossip/themes.png', label: 'Current Build', caption: 'Theme and atmosphere selector' },
    ],
  },
  {
    slug: 'liminal-dream-journal', name: 'Liminal Dream Journal', tagline: 'Meet your dreams before the morning carries them away.', shortDescription: 'A dictation-first dream journal for capturing raw memories, finding symbols, and following recurring threads.',
    longDescription: 'Liminal starts with the fragile first minutes after waking: fast voice capture, a preserved raw entry, a gently cleaned version, and room for analysis, symbols, connections, search, notes, visualization, and lucid-dream tools.',
    categories: ['Creativity & Self', 'AI & Consciousness'], status: 'Prototype', phase: 'UX concept', accent: 'moon', image: '/images/liminal.jpg', liveUrl: 'https://liminal-dream-journal.vercel.app', featured: true, lastUpdated: '2026-10-03', currentFocus: 'Keeping capture effortless while leaving interpretation in the dreamer’s hands.', nextMilestone: 'Prototype raw-to-cleaned dictation review.', notes: 'Generated audio or imagery would be optional creative layers, not replacements for the original dream record.',
    features: ['Dictation-first capture', 'Raw and cleaned entries', 'AI-assisted analysis', 'Symbols and recurring connections', 'Search and notes', 'Visualization and lucid-dream tools', 'Optional audio and image generation'], milestones: makeMilestones(1), recentlyCompleted: ['Capture philosophy defined', 'Feature landscape collected'], workingOn: ['Dictation review flow', 'Raw-entry preservation'], nextUp: ['Symbol connections prototype', 'Search structure'], backlog: ['Dream visualization', 'Lucid practice tools'], screenshots: [
      { src: '/images/screenshots/liminal/home.png', label: 'Current Build', caption: 'Private sign-in for the current prototype' },
      { src: '/images/screenshots/liminal/home-concept.png', label: 'Concept Design', caption: 'Capture, recent dreams, recurring symbols, and connections' },
      { src: '/images/liminal.jpg', label: 'Concept Direction', caption: 'Liminal visual atmosphere' },
    ],
  },
  {
    slug: 'haunt', name: 'HAUNT', tagline: 'Find your look, your night, and your people.', shortDescription: 'A goth lifestyle and community app for style, events, venues, music, discoveries, and a playful virtual wardrobe.',
    longDescription: 'HAUNT gathers the many parts of goth life—looks and outfit inspiration, events, Goth Radar, venues, music, deals, Goth Passport, community, and saved discoveries—with a virtual wardrobe and paper-doll-style try-on built from a user-uploaded full-body photo.',
    categories: ['Creativity & Self'], status: 'Prototype', phase: 'Feature development', accent: 'haunt', image: '/images/screenshots/haunt/home.png', imageLabel: 'Current Build', liveUrl: 'https://haunt-peach.vercel.app', featured: false, lastUpdated: '2026-10-03', currentFocus: 'Balancing discovery, community, and personal style without losing clarity.', nextMilestone: 'Connect the wardrobe and local discovery loops into the working prototype.', notes: 'A public prototype is available. Photo-based try-on will require careful consent, privacy, and expectation-setting.',
    features: ['Looks and outfit inspiration', 'Events and Goth Radar', 'Venues, music, and deals', 'Goth Passport', 'Community and saved items', 'Virtual wardrobe', 'Full-body photo paper-doll try-on'], milestones: makeMilestones(2), recentlyCompleted: ['Experience pillars organized', 'Light-site accent direction defined'], workingOn: ['Wardrobe concept', 'Discovery structure'], nextUp: ['Photo privacy requirements', 'Local radar prototype'], backlog: ['Creator profiles', 'Travel collections'], screenshots: [
      { src: '/images/screenshots/haunt/home.png', label: 'Current Build', caption: 'HAUNT home and discovery paths' },
      { src: '/images/screenshots/haunt/looks.png', label: 'Current Build', caption: 'Looks and outfit inspiration' },
      { src: '/images/screenshots/haunt/dressing-room.png', label: 'Current Build', caption: 'Dressing Room experience' },
    ],
  },
  {
    slug: 'kitten-corner', name: 'Kitten Corner', tagline: 'A playful little world for kitten families.', shortDescription: 'Interactive games, guides, growth notes, and contests for families—designed for the cattery website and possibly as a download later.',
    longDescription: 'Kitten Corner is a separate, smaller family-engagement project. It belongs first on the cattery website and could eventually become downloadable; it is not a module of the cattery management product.',
    categories: ['Cats & Breeding', 'Experiments'], status: 'Idea', phase: 'Idea', accent: 'blue', image: '/images/cattery.jpg', featured: false, lastUpdated: '2026-10-03', currentFocus: 'Collecting the most delightful and genuinely useful family activities.', nextMilestone: 'Choose one small website experience to prototype.', notes: 'Separate from the cattery management app.',
    features: ['Kitten-themed games', 'Family guides', 'Growth information', 'Contests and activities', 'Cattery website integration', 'Possible future download'], milestones: makeMilestones(0), recentlyCompleted: ['Project boundary clarified'], workingOn: ['Idea collection'], nextUp: ['Select first mini-experience'], backlog: ['Downloadable version', 'Seasonal activities'], screenshots: [
      { src: '/images/screenshots/kitten-corner/home-concept.png', label: 'Concept Design', caption: 'Play, learn, grow, and family activity direction' },
      { src: '/images/cattery.jpg', label: 'Concept Direction', caption: 'Warm family-and-kitten atmosphere' },
    ],
  },
];

export const incubatorIdeas = [
  { name: 'Consciousness Portals', state: 'Exploring', accent: 'violet', spark: 'A more experiential way to explore consciousness than a flat library of information.', mightBecome: 'Interactive maps, portals, dialogues, dream and codex tools, and community journeys.', image: '/images/liminal.jpg' },
  { name: 'Carole OS', state: 'Growing', accent: 'sage', spark: 'Ideas, projects, people, resources, and relationships deserve to be seen together.', mightBecome: 'A visual personal operating system and external brain built around connections.', image: '/images/studio-hero.jpg' },
  { name: 'Breeder mini-app ecosystem', state: 'Spark', accent: 'blue', spark: 'Some breeder jobs may work best as small, focused tools that can still connect.', mightBecome: 'A modular strategy exploring ideas once called SpellBorn, SpellStock, SpellShow, SpellBook, SpellLedger, SpellHealth, SpellMatch, and SpellMap.', image: '/images/cattery.jpg' },
];

export const journalEntries = [
  { date: '2026-10-03', project: 'Holy Gossip', title: 'A missing project returns to the wall', summary: 'Holy Gossip joins the studio directory with real build captures and its playful-but-careful storytelling promise intact.', tags: ['story', 'faith', 'studio'] },
  { date: '2026-10-03', project: 'Spellbound Studios', title: 'A studio takes shape', summary: 'The first public studio structure comes together around a shared design language and one central source of project truth.', tags: ['studio', 'foundation'] },
  { date: '2026-10-02', project: 'Phoenix Chat', title: 'Preservation needs provenance', summary: 'A clear principle: genuine access and thoughtful reconstruction can both matter, but they must never be confused.', tags: ['ai', 'transparency'] },
  { date: '2026-10-01', project: 'Cattery Management', title: 'One connected breeder journey', summary: 'Owner access and kitten selections belong inside the operating system, close to the records and people they serve.', tags: ['product', 'cats'] },
  { date: '2026-09-30', project: 'Liminal Dream Journal', title: 'Keep the raw dream', summary: 'The original dictated memory remains alongside any cleaned or interpreted version.', tags: ['dreams', 'design principle'] },
];

export const statusOptions = ['All statuses', 'Live', 'Active Build', 'Prototype', 'Design', 'Planning', 'Idea', 'Paused'];
export const categoryOptions = ['All categories', 'Everyday Life', 'Cats & Breeding', 'AI & Consciousness', 'Creativity & Self', 'Faith & Story', 'Experiments'];
