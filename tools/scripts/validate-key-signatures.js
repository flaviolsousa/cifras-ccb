/* eslint-disable */

const fs = require("fs");
const path = require("path");

// Mapeamento de acidentes para tonalidades
const keySignatureMap = {
  "-7": "Cb",
  "-6": "Gb",
  "-5": "Db",
  "-4": "Ab",
  "-3": "Eb",
  "-2": "Bb",
  "-1": "F",
  0: "C",
  1: "G",
  2: "D",
  3: "A",
  4: "E",
  5: "B",
  6: "F#",
  7: "C#",
};

const hymnsFilePath = path.join(__dirname, "..", "..", "data", "Hymns.json");
const lyricsDir = path.join(__dirname, "..", "..", "data", "lyrics");

// Ler arquivo Hymns.json
const hymnsData = JSON.parse(fs.readFileSync(hymnsFilePath, "utf8"));

const discrepancies = [];
const codeDiscrepancies = [];

// Processar cada hino
hymnsData.forEach((hymn) => {
  const code = hymn.code;
  const accidentals = hymn.keySig?.accidental;

  console.log(code, accidentals);
  // Pular se não tiver código ou acidentes
  if (!code || accidentals === undefined) {
    return;
  }

  // Determinar o tom esperado baseado nos acidentes
  const expectedKey = keySignatureMap[accidentals.toString()];

  // Ler arquivo de letra correspondente
  const lyricsFilePath = path.join(lyricsDir, `${code}.json`);

  if (!fs.existsSync(lyricsFilePath)) {
    console.log(`Arquivo não encontrado: ${code}.json`);
    return;
  }

  const lyricsData = JSON.parse(fs.readFileSync(lyricsFilePath, "utf8"));
  const originalTone = lyricsData.tone?.original;
  const jsonCode = lyricsData.code;

  console.log(`Hino ${code}: Acidentes = ${accidentals}, Tom esperado = ${expectedKey}, Tom original = ${originalTone}`);

  // Verificar se há divergência entre o code do JSON e o nome do arquivo
  if (jsonCode && jsonCode !== code) {
    codeDiscrepancies.push({
      fileName: code,
      expectedCode: code,
      actualCode: jsonCode,
    });
  }

  // Verificar se há divergência no tom
  if (originalTone && originalTone !== expectedKey) {
    discrepancies.push({
      code: code,
      accidentals: accidentals,
      expectedKey: expectedKey,
      actualKey: originalTone,
    });
  }
});

// Exibir resultados
if (discrepancies.length > 0) {
  console.log("\n=== HINOS COM DIVERGÊNCIAS CODE ===\n");
  discrepancies.forEach((item) => {
    console.log(`Hino ${item.code}:`);
    console.log(`  Acidentes: ${item.accidentals}`);
    console.log(`  Tom esperado: ${item.expectedKey}`);
    console.log(`  Tom atual: ${item.actualKey}`);
    console.log("");
  });
  console.log(`Total de divergências: ${discrepancies.length}`);

  // Mostrar apenas os códigos
  console.log("\n=== CÓDIGOS COM CAMPO HARMÔNICO ===");
  console.log(discrepancies.map((d) => d.code).join(", "));
} else {
  console.log("\n✓ Nenhuma divergência encontrada! Todos os tons estão corretos.");
}

// Exibir discrepâncias de código
if (codeDiscrepancies.length > 0) {
  console.log("\n=== DISCREPÂNCIAS DE code ===\n");
  codeDiscrepancies.forEach((item) => {
    console.log(`Arquivo: ${item.fileName}.json`);
    console.log(`  Código esperado: ${item.expectedCode}`);
    console.log(`  Código atual: ${item.actualCode}`);
    console.log("");
  });
  console.log(`Total de discrepâncias de código: ${codeDiscrepancies.length}`);
}
