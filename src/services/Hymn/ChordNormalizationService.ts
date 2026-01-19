/**
 * Service for normalizing chord names by converting flats to sharps
 * and simplifying enharmonic equivalents to their natural forms when possible.
 *
 * Examples:
 * - Dbm7 → C#m7
 * - Bbmaj7(#11) → A#maj7(#11)
 * - Cb → B
 * - Fb7 → E7
 * - E#dim → Fdim
 * - B#7 → C7
 * - F## → G
 */

class ChordNormalizationService {
  // Chromatic scale using sharps
  private static readonly CHROMATIC_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Map flats to their sharp equivalents (semitone index)
  private static readonly FLAT_SEMITONES: Record<string, number> = {
    Cb: 11, // B
    Db: 1, // C#
    Eb: 3, // D#
    Fb: 4, // E
    Gb: 6, // F#
    Ab: 8, // G#
    Bb: 10, // A#
  };

  // Map sharps to their semitone index
  private static readonly SHARP_SEMITONES: Record<string, number> = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    "E#": 5, // F
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
    "B#": 0, // C
  };

  /**
   * Normalizes a chord name by converting flats to sharps and simplifying
   * enharmonic equivalents to their natural forms when possible.
   *
   * @param chord - The chord name to normalize (e.g., "Dbm7", "E#dim", "C/Eb")
   * @param normalizeSlashBass - Whether to also normalize the bass note in slash chords (default: true)
   * @returns The normalized chord name
   */
  static normalize(chord: string, normalizeSlashBass: boolean = true): string {
    if (!chord || chord.trim() === "") return chord;

    // Handle slash chords (e.g., C/Eb)
    const slashIndex = chord.indexOf("/");
    if (slashIndex !== -1 && normalizeSlashBass) {
      const rootPart = chord.substring(0, slashIndex);
      const bassPart = chord.substring(slashIndex + 1);
      return `${this.normalize(rootPart, false)}/${this.normalize(bassPart, false)}`;
    }

    // Extract the root note (handle double sharps/flats)
    const rootMatch = chord.match(/^([A-G][b#]{0,2})/);
    if (!rootMatch) return chord;

    const root = rootMatch[1];
    const suffix = chord.substring(root.length);

    // Normalize the root note
    const normalizedRoot = this.normalizeRoot(root);

    return normalizedRoot + suffix;
  }

  /**
   * Normalizes a root note by converting flats to sharps and simplifying
   * enharmonic equivalents.
   *
   * @param root - The root note (e.g., "Db", "E#", "F##")
   * @returns The normalized root note
   */
  private static normalizeRoot(root: string): string {
    // Handle double sharps (e.g., F## → G)
    if (root.includes("##")) {
      const baseNote = root[0];
      const baseSemitone = this.SHARP_SEMITONES[baseNote];
      if (baseSemitone !== undefined) {
        const normalizedSemitone = (baseSemitone + 2) % 12;
        return this.CHROMATIC_SHARP[normalizedSemitone];
      }
    }

    // Handle double flats (e.g., Dbb → C)
    if (root.includes("bb")) {
      const baseNote = root[0];
      const baseSemitone = this.SHARP_SEMITONES[baseNote];
      if (baseSemitone !== undefined) {
        const normalizedSemitone = (baseSemitone - 2 + 12) % 12;
        return this.CHROMATIC_SHARP[normalizedSemitone];
      }
    }

    // Handle single flats
    if (root.endsWith("b")) {
      const semitone = this.FLAT_SEMITONES[root];
      if (semitone !== undefined) {
        return this.CHROMATIC_SHARP[semitone];
      }
    }

    // Handle single sharps (including E# and B#)
    if (root.endsWith("#")) {
      const semitone = this.SHARP_SEMITONES[root];
      if (semitone !== undefined) {
        return this.CHROMATIC_SHARP[semitone];
      }
    }

    // Handle natural notes
    const semitone = this.SHARP_SEMITONES[root];
    if (semitone !== undefined) {
      return this.CHROMATIC_SHARP[semitone];
    }

    // If nothing matched, return as is
    return root;
  }

  /**
   * Generates a mapping object for common chord patterns.
   * This can be used as a replacement for the old FLAT_TO_SHARP constant.
   *
   * @returns A record mapping flat/enharmonic chords to their normalized equivalents
   */
  static generateNormalizationMap(): Record<string, string> {
    const map: Record<string, string> = {};

    // Common chord types to generate mappings for
    const suffixes = [
      "", // Major
      "m", // Minor
      "7", // Dominant 7th
      "m7", // Minor 7th
      "maj7", // Major 7th
      "dim", // Diminished
      "aug", // Augmented
      "sus4", // Suspended 4th
      "sus2", // Suspended 2nd
      "6", // Major 6th
      "m6", // Minor 6th
      "9", // 9th
      "m9", // Minor 9th
      "maj9", // Major 9th
      "11", // 11th
      "13", // 13th
      "add9", // Add 9th
      "7sus4", // 7 suspended 4th
    ];

    // Notes that need normalization
    const flatNotes = ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"];
    const sharpNotes = ["E#", "B#"];
    const doubleSharp = ["C##", "D##", "E##", "F##", "G##", "A##", "B##"];

    // Generate mappings for all combinations
    [...flatNotes, ...sharpNotes, ...doubleSharp].forEach((note) => {
      suffixes.forEach((suffix) => {
        const chord = note + suffix;
        const normalized = this.normalize(chord);
        if (chord !== normalized) {
          map[chord] = normalized;
        }
      });
    });

    return map;
  }
}

export default ChordNormalizationService;
