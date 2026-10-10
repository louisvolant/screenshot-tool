export interface CodeTheme {
  id: string;
  name: string;
  dark: boolean;
  bg: string;
  fg: string;
  gutter: string;
  bar: string;
  accent: string;
  highlight: string;
  tokens: {
    comment: string;
    string: string;
    number: string;
    keyword: string;
    function: string;
    operator: string;
    punctuation: string;
    plain: string;
  };
  defaultBackground: {
    colors: string[];
    angle: number;
  };
}

export const CODE_THEMES: CodeTheme[] = [
  {
    id: 'violine',
    name: 'Violine',
    dark: true,
    bg: '#1e1b2e',
    fg: '#e8e6f3',
    gutter: '#5d5878',
    bar: '#17152a',
    accent: '#8b7fff',
    highlight: 'rgba(139, 127, 255, 0.18)',
    tokens: {
      comment: '#6f6a8a',
      string: '#a5e8b0',
      number: '#ffb86c',
      keyword: '#ff7ab8',
      function: '#8bd5ff',
      operator: '#ff9ed2',
      punctuation: '#a9a4c4',
      plain: '#e8e6f3',
    },
    defaultBackground: { colors: ['#6d5efc', '#ec5fb0', '#a18cd1'], angle: 135 },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    dark: true,
    bg: '#272822',
    fg: '#f8f8f2',
    gutter: '#75715e',
    bar: '#1e1f1a',
    accent: '#e6db74',
    highlight: 'rgba(230, 219, 116, 0.15)',
    tokens: {
      comment: '#75715e',
      string: '#e6db74',
      number: '#ae81ff',
      keyword: '#f92672',
      function: '#a6e22e',
      operator: '#f92672',
      punctuation: '#f8f8f2',
      plain: '#f8f8f2',
    },
    defaultBackground: { colors: ['#fd971f', '#f92672', '#ae81ff'], angle: 135 },
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    dark: true,
    bg: '#282a36',
    fg: '#f8f8f2',
    gutter: '#6272a4',
    bar: '#21222c',
    accent: '#bd93f9',
    highlight: 'rgba(189, 147, 249, 0.16)',
    tokens: {
      comment: '#6272a4',
      string: '#f1fa8c',
      number: '#bd93f9',
      keyword: '#ff79c6',
      function: '#50fa7b',
      operator: '#ff79c6',
      punctuation: '#f8f8f2',
      plain: '#f8f8f2',
    },
    defaultBackground: { colors: ['#44475a', '#6272a4', '#bd93f9'], angle: 135 },
  },
  {
    id: 'ardoise',
    name: 'Ardoise',
    dark: true,
    bg: '#0f172a',
    fg: '#f8fafc',
    gutter: '#475569',
    bar: '#090d16',
    accent: '#38bdf8',
    highlight: 'rgba(56, 189, 248, 0.15)',
    tokens: {
      comment: '#64748b',
      string: '#34d399',
      number: '#f43f5e',
      keyword: '#38bdf8',
      function: '#818cf8',
      operator: '#94a3b8',
      punctuation: '#e2e8f0',
      plain: '#f8fafc',
    },
    defaultBackground: { colors: ['#0369a1', '#0284c7', '#38bdf8'], angle: 140 },
  },
  {
    id: 'fjord',
    name: 'Fjord',
    dark: true,
    bg: '#1c2430',
    fg: '#e2e8f0',
    gutter: '#4a5b70',
    bar: '#141a23',
    accent: '#2dd4bf',
    highlight: 'rgba(45, 212, 191, 0.15)',
    tokens: {
      comment: '#64748b',
      string: '#2dd4bf',
      number: '#f59e0b',
      keyword: '#60a5fa',
      function: '#38bdf8',
      operator: '#a5f3fc',
      punctuation: '#cbd5e1',
      plain: '#e2e8f0',
    },
    defaultBackground: { colors: ['#0f766e', '#0d9488', '#2dd4bf'], angle: 135 },
  },
  {
    id: 'abysse',
    name: 'Abysse',
    dark: true,
    bg: '#0a0d1a',
    fg: '#e0e7ff',
    gutter: '#374151',
    bar: '#05070d',
    accent: '#6366f1',
    highlight: 'rgba(99, 102, 241, 0.18)',
    tokens: {
      comment: '#4b5563',
      string: '#a5b4fc',
      number: '#c084fc',
      keyword: '#6366f1',
      function: '#38bdf8',
      operator: '#818cf8',
      punctuation: '#c7d2fe',
      plain: '#e0e7ff',
    },
    defaultBackground: { colors: ['#1e1b4b', '#312e81', '#4338ca'], angle: 135 },
  },
  {
    id: 'charbon',
    name: 'Charbon',
    dark: true,
    bg: '#18181b',
    fg: '#f4f4f5',
    gutter: '#52525b',
    bar: '#09090b',
    accent: '#a1a1aa',
    highlight: 'rgba(255, 255, 255, 0.08)',
    tokens: {
      comment: '#71717a',
      string: '#a1a1aa',
      number: '#e4e4e7',
      keyword: '#ffffff',
      function: '#d4d4d8',
      operator: '#a1a1aa',
      punctuation: '#e4e4e7',
      plain: '#f4f4f5',
    },
    defaultBackground: { colors: ['#27272a', '#18181b', '#09090b'], angle: 135 },
  },
  {
    id: 'craie',
    name: 'Craie',
    dark: false,
    bg: '#ffffff',
    fg: '#0f172a',
    gutter: '#94a3b8',
    bar: '#f1f5f9',
    accent: '#2563eb',
    highlight: 'rgba(37, 99, 235, 0.1)',
    tokens: {
      comment: '#94a3b8',
      string: '#059669',
      number: '#d97706',
      keyword: '#2563eb',
      function: '#7c3aed',
      operator: '#dc2626',
      punctuation: '#334155',
      plain: '#0f172a',
    },
    defaultBackground: { colors: ['#e2e8f0', '#cbd5e1', '#94a3b8'], angle: 135 },
  },
  {
    id: 'sable',
    name: 'Sable',
    dark: false,
    bg: '#faf8f5',
    fg: '#292524',
    gutter: '#a8a29e',
    bar: '#f5f0ea',
    accent: '#ea580c',
    highlight: 'rgba(234, 88, 12, 0.12)',
    tokens: {
      comment: '#a8a29e',
      string: '#16a34a',
      number: '#ea580c',
      keyword: '#c2410c',
      function: '#4f46e5',
      operator: '#b45309',
      punctuation: '#57534e',
      plain: '#292524',
    },
    defaultBackground: { colors: ['#ffedd5', '#fed7aa', '#fdba74'], angle: 135 },
  },
  {
    id: 'cerise',
    name: 'Cerise',
    dark: true,
    bg: '#25121b',
    fg: '#fce7f3',
    gutter: '#831843',
    bar: '#190a11',
    accent: '#f43f5e',
    highlight: 'rgba(244, 63, 94, 0.18)',
    tokens: {
      comment: '#9d174d',
      string: '#fbcfe8',
      number: '#f472b6',
      keyword: '#f43f5e',
      function: '#fb7185',
      operator: '#fda4af',
      punctuation: '#fce7f3',
      plain: '#fce7f3',
    },
    defaultBackground: { colors: ['#831843', '#be185d', '#f43f5e'], angle: 135 },
  },
];

export function getTheme(id: string): CodeTheme {
  return CODE_THEMES.find((t) => t.id === id) || CODE_THEMES[0];
}
