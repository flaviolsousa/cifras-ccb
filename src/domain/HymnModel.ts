export interface KeySignature {
  accidental: number;
}

export interface TimeSignature {
  sigN: number;
  sigD: number;
}

export interface Tempo {
  reference: number;
  text: string;
  duration: number;
  introDuration: number;
}

export interface Stanza {
  type: string;
  code?: string;
  text?: string[];
  ref?: string;
}

export interface Score {
  introduction: string[];
  stanzas: Stanza[];
}

export interface Tone {
  original: string;
  recommended: string;
  selected: string;
  capo: number;
}

export interface HymnModel {
  version: string;
  code: string;
  title: string;
  level: number;
  difficulty: number;
  tone: Tone;
  rhythm: string;
  content?: string[];
  score: Score;
  keySig: KeySignature;
  measures: TimeSignature;
  time: Tempo;
}
