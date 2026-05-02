export interface NavItem {
  href: string;
  label: string;
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

export const DOCS_NAV: NavSection[] = [
  {
    title: 'Start here',
    items: [
      { href: '/docs/', label: 'What is slotplate?' },
      { href: '/docs/quickstart/', label: 'Quickstart' },
      { href: '/docs/tour/', label: '10-minute tour' },
      { href: '/docs/principles/', label: 'The 10 principles' },
      { href: '/docs/opinions/', label: 'Opinions' },
      { href: '/docs/testing/', label: 'Testing scenarios' },
      { href: '/docs/agents/', label: 'Using with AI agents' },
    ],
  },
  {
    title: 'Architecture',
    items: [
      { href: '/architecture/', label: 'Overview' },
      { href: '/architecture/layers/', label: 'Layered architecture' },
      { href: '/architecture/client-vs-server/', label: 'Client vs server' },
      { href: '/architecture/spin-lifecycle/', label: 'Spin lifecycle' },
      { href: '/architecture/fsm/', label: 'FSM & phases' },
      { href: '/architecture/events/', label: 'Event flow' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { href: '/concepts/scenes/', label: 'Scenes' },
      { href: '/concepts/state/', label: 'State (MobX)' },
      { href: '/concepts/presenters/', label: 'Presenters' },
      { href: '/concepts/infrastructure/', label: 'Infrastructure' },
      { href: '/concepts/view/', label: 'View (pixi-reels)' },
      { href: '/concepts/timing/', label: 'Timing (no setTimeout)' },
      { href: '/concepts/disposables/', label: 'Disposables' },
      { href: '/concepts/composition-root/', label: 'Composition root' },
      { href: '/concepts/fail-loud/', label: 'Fail loud' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { href: '/guides/add-symbol/', label: 'Add a symbol' },
      { href: '/guides/add-phase/', label: 'Add a phase' },
      { href: '/guides/swap-network/', label: 'Swap the network transport' },
      { href: '/guides/spine/', label: 'Spine symbols' },
      { href: '/guides/bonus/', label: 'Add a bonus game' },
      { href: '/guides/analytics/', label: 'Analytics events' },
      { href: '/guides/responsive/', label: 'Responsive layout' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { href: '/patterns/fsm/', label: 'FSM' },
      { href: '/patterns/presenter/', label: 'Presenter (MVP)' },
      { href: '/patterns/composition-root/', label: 'Composition root' },
      { href: '/patterns/strategy/', label: 'Strategy' },
      { href: '/patterns/command/', label: 'Command' },
      { href: '/patterns/factory/', label: 'Factory' },
      { href: '/patterns/adapter/', label: 'Adapter / DTO' },
      { href: '/patterns/observer/', label: 'Observer' },
      { href: '/patterns/object-pool/', label: 'Object pool' },
      { href: '/patterns/disposable/', label: 'Disposable' },
    ],
  },
];
