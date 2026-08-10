export type LabTrack = {
  id: string;
  label: string;
  language: string;
  concepts: string[];
};

export const labTracks: LabTrack[] = [
  {
    id: 'javascript-core',
    label: 'JavaScript fundamentals',
    language: 'JavaScript',
    concepts: ['Scope and closures', 'Async control flow', 'Objects and prototypes'],
  },
  {
    id: 'typescript-core',
    label: 'TypeScript in practice',
    language: 'TypeScript',
    concepts: ['Narrowing and inference', 'Generics', 'Type-safe APIs'],
  },
  {
    id: 'python-core',
    label: 'Python fundamentals',
    language: 'Python',
    concepts: ['Data structures', 'Functions and decorators', 'Errors and testing'],
  },
  {
    id: 'backend-core',
    label: 'Backend engineering',
    language: 'Python',
    concepts: ['HTTP boundaries', 'Persistence', 'Observability'],
  },
];
