import { HymnModel } from "../../domain/HymnModel";
import { Hymns, getHymnModel } from "./HymnImports";
import { transpose } from "chord-transposer";

const CHORD_MAP = {
  Gb: "F#",
  Bb: "A#",
};

async function readFile(file: string): Promise<HymnModel | null> {
  return (await getHymnModel(file)) || null;
}

function transposeChordsLine(line: string, fromKey: string, toKey: string): string {
  const parts = line.split(/(\[[^\]]+\])/g);
  let result = "";

  parts.forEach((part) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      let [chord, notes] = part.slice(1, -1).split("|");
      let chordSymbol = "";
      if (chord.endsWith("°")) {
        chord = chord.slice(0, -1);
        chordSymbol = "°";
      }
      try {
        let transposed = transpose(chord).fromKey(fromKey).toKey(toKey);
        transposed = CHORD_MAP[`[${transposed}}`] || transposed;
        console.log(`Transposing chord: ${chord}${chordSymbol} from ${fromKey} to ${toKey} => ${transposed}${chordSymbol}`);
        result += `[${transposed}${chordSymbol}${!!notes ? `|${notes}` : ""}]`;
      } catch (e: any) {
        console.error(e);
        result += `${part}:ERROR`;
      }
    } else {
      result += part;
    }
  });

  return result;
}

class HymnService {
  static async getHymn(hymnCode: string): Promise<HymnModel | null> {
    const hymnData: HymnModel | null = await readFile(hymnCode);
    if (!hymnData) {
      return null;
    }

    const hymnMetaData = Hymns.find((hymn) => hymn.code === hymnCode);
    if (hymnMetaData) {
      const hymn = JSON.parse(
        JSON.stringify({
          ...hymnMetaData,
          ...hymnData,
        }),
      );
      hymn.tone.selected = hymn.tone.selected ?? hymn.tone.recommended;
      hymn.tone.recommended = hymn.tone.recommended ?? hymn.tone.selected;
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
          text: stanza.text?.map((line) => transposeChordsLine(line, hymn.tone.selected, newTone)),
        })),
      },
    };
    return transposedHymn;
  }

  static async logTranspose(hymnCode: string, newTone: string) {
    const hymn: HymnModel | null = await readFile(hymnCode);
    if (!hymn) return null;

    console.log(`TODO: Disable in production: Transposing hymn ${hymnCode} from ${hymn?.tone?.original} to ${newTone}`);

    if (hymn) {
      const transposedHymn = HymnService.transposeHymn(hymn, newTone);
      console.log("--");
      console.log(JSON.stringify(transposedHymn, null, 2));
      console.log("--");
    } else {
      console.error(`Hino ${hymnCode} não encontrado.`);
    }
  }

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

      let diff = origIdx - selIdx;
      if (diff < 0) diff += 12;
      return diff;
    } catch {
      return 0;
    }
  }

  static splitChord(chord: string): { chord: string; notes: string } {
    const content = chord.startsWith("[") && chord.endsWith("]") ? chord.slice(1, -1) : chord;
    const [chordName, notes] = content.split("|");
    return {
      chord: chordName.trim(),
      notes: notes?.trim(),
    };
  }
}

export default HymnService;
