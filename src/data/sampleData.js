export const COLOR_OPTIONS = [
  { name: 'Violet', value: '#7C7BFF' },
  { name: 'Cyan', value: '#3ECFEB' },
  { name: 'Amber', value: '#F5A623' },
  { name: 'Coral', value: '#FF6B5E' },
  { name: 'Green', value: '#3ECF8E' },
  { name: 'Slate', value: '#8B93A5' },
  { name: 'Pink', value: '#F76FB0' },
];

export const SAMPLE_COLUMNS = [
  { id: 'col-backlog', name: 'Backlog', color: '#8B93A5' },
  { id: 'col-progress', name: 'In Progress', color: '#F5A623' },
  { id: 'col-blocked', name: 'Blocked', color: '#FF6B5E' },
  { id: 'col-done', name: 'Done', color: '#3ECF8E' },
];

export const SAMPLE_TASKS = [
  {
    id: 't1',
    title: 'Define requirements',
    description: 'Interview stakeholders and lock the v1 scope for the launch.',
    columnId: 'col-done',
    dependsOn: [],
    x: 60, y: 260,
  },
  {
    id: 't2',
    title: 'User research',
    description: 'Run 6 customer interviews to validate the core workflow.',
    columnId: 'col-done',
    dependsOn: ['t1'],
    x: 320, y: 100,
  },
  {
    id: 't3',
    title: 'Competitive audit',
    description: 'Review 5 comparable tools for gaps we can win on.',
    columnId: 'col-done',
    dependsOn: ['t1'],
    x: 320, y: 420,
  },
  {
    id: 't4',
    title: 'Design system setup',
    description: 'Establish tokens, components, and the base layout grid.',
    columnId: 'col-progress',
    dependsOn: ['t2', 't3'],
    x: 600, y: 260,
  },
  {
    id: 't5',
    title: 'API schema design',
    description: 'Define the data model for tasks, columns, and dependencies.',
    columnId: 'col-progress',
    dependsOn: ['t2'],
    x: 600, y: 60,
  },
  {
    id: 't6',
    title: 'Build dashboard UI',
    description: 'Implement the board and graph views against the design system.',
    columnId: 'col-backlog',
    dependsOn: ['t4'],
    x: 880, y: 220,
  },
  {
    id: 't7',
    title: 'Build backend endpoints',
    description: 'Stand up CRUD endpoints matching the API schema.',
    columnId: 'col-blocked',
    dependsOn: ['t5'],
    x: 880, y: 420,
  },
  {
    id: 't8',
    title: 'Integration testing',
    description: 'Wire the UI to real endpoints and fix the seams.',
    columnId: 'col-backlog',
    dependsOn: ['t6', 't7'],
    x: 1160, y: 320,
  },
  {
    id: 't9',
    title: 'Beta rollout',
    description: 'Ship to a small group of design partners for feedback.',
    columnId: 'col-backlog',
    dependsOn: ['t8'],
    x: 1440, y: 320,
  },
];

export function freshSampleState() {
  return {
    columns: SAMPLE_COLUMNS.map((c) => ({ ...c })),
    tasks: SAMPLE_TASKS.map((t) => ({ ...t, dependsOn: [...t.dependsOn] })),
  };
}
