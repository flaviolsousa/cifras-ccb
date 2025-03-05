interface KeySignature {
  accidental: number;
}

interface TimeSignature {
  sigN: number;
  sigD: number;
}

interface Tempo {
  reference: number;
  text: string;
}

export interface HymnModel {
  version: string;
  code: string;
  title: string;
  difficulty: number;
  tone: string;
  content: string[];
  keySig: KeySignature;
  measures: TimeSignature;
  time: Tempo;
}
