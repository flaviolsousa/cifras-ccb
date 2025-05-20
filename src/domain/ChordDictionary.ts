export interface ChordDefinition {
  frets: number[];
  fingers: number[];
}

export interface ChordDictionary {
  [key: string]: ChordDefinition;
}

export interface GuitarChordProps {
  name: string;
  frets?: number[];
  fingers?: number[];
  size?: number;
}

export interface Bar {
  fret: number;
  finger: number;
  start: number;
  end: number;
}
