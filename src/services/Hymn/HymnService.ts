import hymnImports from "./HymnImports";
export interface HymnModel {
  version: string;
  title: string;
  difficulty: number;
  tone: string;
  content: string[];
}

async function readFile(file: string): Promise<HymnModel | null> {
  return hymnImports[file] || null;
}

class HymnService {
  static async getContent(hymnCode: string): Promise<string> {
    const json: HymnModel | null = await readFile(hymnCode);
    if (!json) {
      return "TBD";
    }

    const lines = json.content.join("\n");
    return lines;
  }
}

export default HymnService;
