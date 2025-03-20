import { store } from "../store/index";
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

interface Verse {
  chords: string;
  lyrics: string;
}

interface Stanza {
  type: string;
  code?: string;
  verses?: Verse[];
  ref?: string;
}

interface Score {
  stanzas: Stanza[];
}

export interface HymnModel {
  version: string;
  code: string;
  title: string;
  difficulty: number;
  tone: string;
  content?: string[];
  score: Score;
  keySig: KeySignature;
  measures: TimeSignature;
  time: Tempo;
}
