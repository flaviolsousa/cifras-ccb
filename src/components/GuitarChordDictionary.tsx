import { type ChordDictionary } from "../domain/ChordDictionary";

export const chordDictionary: ChordDictionary = {
  // Chords of A
  A: { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "A#°": { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  A7: { frets: [0, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
  A9: { frets: [0, 0, 2, 4, 2, 0], fingers: [0, 0, 1, 3, 2, 0] },
  Am: { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  "A°": { frets: [0, 0, 1, 2, 1, -1], fingers: [0, 0, 1, 3, 2, 0] },

  // Chords of B
  B: { frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 2, 3, 4, 1] },
  B7: { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
  Bb: { frets: [1, 1, 3, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1] },
  Bb9: { frets: [1, 1, 3, 1, 1, 1], fingers: [1, 1, 3, 1, 1, 1] },
  Bm: { frets: [2, 2, 4, 4, 3, 2], fingers: [1, 1, 3, 4, 2, 1] },
  Bm7: { frets: [2, 2, 4, 2, 3, 2], fingers: [1, 1, 4, 1, 3, 1] },
  "Bm7(5-)": { frets: [2, 2, 3, 2, 3, 2], fingers: [1, 1, 3, 1, 4, 1] },
  "B°": { frets: [2, 0, 2, 3, 2, -1], fingers: [1, 0, 2, 4, 3, 0] },

  // Chords of C
  C: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "C#": { frets: [-1, 4, 3, 1, 2, 1], fingers: [0, 4, 3, 1, 2, 1] },
  "C#7": { frets: [-1, 4, 3, 4, 2, -1], fingers: [0, 3, 2, 4, 1, 0] },
  "C#m": { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
  "C#m7": { frets: [-1, 4, 2, 4, 3, -1], fingers: [0, 3, 1, 4, 2, 0] },
  "C#°": { frets: [-1, 3, 4, 2, 4, -1], fingers: [0, 2, 3, 1, 4, 0] },
  "C/A#": { frets: [-1, 1, 2, 0, 1, 0], fingers: [0, 1, 2, 0, 1, 0] },
  "C/E": { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "C5+": { frets: [-1, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
  C7: { frets: [0, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
  C9: { frets: [3, 3, 2, 3, 3, 3], fingers: [2, 2, 1, 3, 3, 4] },
  Cm: { frets: [-1, 3, 1, 0, 1, -1], fingers: [0, 3, 1, 0, 2, 0] },
  "C°": { frets: [-1, 3, 4, 2, 4, 2], fingers: [0, 2, 3, 1, 4, 1] },

  // Chords of D
  D: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 2, 3, 1] },
  "D#": { frets: [-1, -1, 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3] },
  "D#7": { frets: [-1, -1, 1, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4] },
  "D#°": { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
  "D/A": { frets: [-1, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "D/F#": { frets: [2, -1, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  "D5+": { frets: [-1, -1, 0, 3, 3, 2], fingers: [0, 0, 0, 2, 3, 1] },
  D7: { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  Dm: { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  Dm6: { frets: [-1, -1, 0, 2, 0, 1], fingers: [0, 0, 0, 2, 0, 1] },
  "D°": { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2] },

  // Chords of E
  E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  E4: { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0] },
  E7: { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  Em7: { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "E°": { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 3, 0, 4, 0] },

  // Chords of F
  F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  "F#": { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1] },
  "F#7": { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 4, 1, 3, 1, 1] },
  "F#m": { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
  "F#m7": { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1] },
  "F#°": { frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 3, 1, 4, 1] },
  F7: { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1] },
  Fm: { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
  "F°": { frets: [1, 2, 3, 1, -1, -1], fingers: [1, 2, 3, 1, 0, 0] },

  // Chords of G
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  "G#": { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1] },
  "G#7": { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1] },
  "G#m": { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
  "G#°": { frets: [4, 5, 6, 4, -1, -1], fingers: [1, 2, 3, 1, 0, 0] },
  "G/B": { frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 2, 0, 0, 0, 3] },
  G4: { frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
  G7: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  Gm: { frets: [3, 1, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
  "G°": { frets: [3, 4, 5, 3, -1, -1], fingers: [1, 2, 3, 1, 0, 0] },
};

export const getGuitarChordData = (chord: string) => {
  return chordDictionary[chord] || { frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0] };
};
