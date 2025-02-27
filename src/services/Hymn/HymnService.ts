import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export interface HymnModel {
  version: string;
  title: string;
  difficulty: number;
  content: string[];
}

const assetsMapping: { [key: string]: HymnModel } = {
  "001.json": require("../../../data/lyrics/001.json"),
};

async function readFile(file: string): Promise<HymnModel | null> {
  return assetsMapping[file] || null;
}

class HymnService {
  static async getContent(hymnCode: string): Promise<string> {
    const json: HymnModel | null = await readFile(`${hymnCode}.json`);
    if (!json) {
      return "TBD";
    }

    const lines = json.content.join("\n");
    return lines;
  }
}

export default HymnService;
