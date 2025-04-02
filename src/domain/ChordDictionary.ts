export interface ChordDefinition {
  frets: number[];
  fingers: number[];
}

export interface ChordDictionary {
  [key: string]: ChordDefinition;
}
