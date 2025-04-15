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
}

export default HymnService;
