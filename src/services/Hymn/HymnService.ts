import { HymnModel } from "../../domain/HymnModel";
import { Hymns, HymnModels } from "./HymnImports";

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
      return {
        ...hymnMetaData,
        ...hymnData,
      };
    }
    return null;
  }
}

export default HymnService;
