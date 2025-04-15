import { HymnModel } from "../../domain/HymnModel";
import { Hymns, HymnModels } from "./HymnImports";
import { transpose } from "chord-transposer";

async function readFile(file: string): Promise<HymnModel | null> {
  return HymnModels[file] || null;
}

class HymnService {
  static async getHymn(hymnCode: string): Promise<HymnModel | null> {
    const hymnData: HymnModel | null = await readFile(hymnCode);
    if (!hymnData) {
      return null;
    }

    const hymnMetaData = Hymns.find((hymn) => hymn.code === hymnCode);
    if (hymnMetaData) {
      const hymn = {
        ...hymnMetaData,
        ...hymnData,
      };
      hymn.tone.selected = hymn.tone.selected || hymn.tone.recommended;
      return hymn;
    }
    return null;
  }

  static transposeHymn(hymn: HymnModel, newTone: string): HymnModel {
    const transposedHymn = {
      ...hymn,
      tone: {
        ...hymn.tone,
        selected: newTone,
      },
      score: {
        ...hymn.score,
        stanzas: hymn.score.stanzas.map((stanza) => ({
          ...stanza,
          verses: stanza.verses?.map((verse) => ({
            ...verse,
            chords: verse.chords
              .split(/([^_\s]+)/g)
              .map((part) => {
                if (part.includes("_") || !part.trim()) return part;
                const match = part.trim().match(/([_.]*)(.*?)([_.°º()-]*$)/);
                const chordPrefix = match?.[1] || "";
                const chord = match?.[2] || part.trim();
                const chordSuffix = match?.[3] || "";
                try {
                  const transposed = transpose(chord).fromKey(hymn.tone.selected).toKey(newTone);
                  return `${chordPrefix}${transposed}${chordSuffix}`;
                } catch (e: any) {
                  console.error(e);
                  return part + ":ERROR";
                }
              })
              .join(""),
          })),
        })),
      },
    };
    return transposedHymn;
  }

  /**
   * Calcula a posição do capotraste (capo) para transformar o tom original no tom selecionado.
   * Retorna o número de casas do capo (0 se não for possível ou não necessário).
   */
  static getCapoPosition(original: string, selected: string): number {
    if (!original || !selected) return 0;
    try {
      // Lista de tons em ordem de semitons (usando sustenidos)
      const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      // Normaliza para sustenido
      const normalize = (tone: string) =>
        tone.replace(/Db/g, "C#").replace(/Eb/g, "D#").replace(/Gb/g, "F#").replace(/Ab/g, "G#").replace(/Bb/g, "A#");

      const orig = normalize(original);
      const sel = normalize(selected);

      const origIdx = chromatic.indexOf(orig);
      const selIdx = chromatic.indexOf(sel);

      if (origIdx === -1 || selIdx === -1) return 0;

      let diff = selIdx - origIdx;
      if (diff < 0) diff += 12;
      return diff;
    } catch {
      return 0;
    }
  }
}

export default HymnService;
