/* eslint-disable */

const fs = require("fs");
const path = require("path");
const { Chord } = require("chord-transposer");

const inputFile = path.join(__dirname, "cifrasccb", "unique_chords.tmp");
const outputFile = path.join(__dirname, "cifrasccb", "unique_chords-transpose.tmp");

// Lê todos os acordes do arquivo de entrada
const chords = fs
  .readFileSync(inputFile, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => !!line);

// Para cada acorde, gera as 12 transposições
const allTransposed = new Set();
chords.forEach((chord) => {
  for (let i = 0; i < 12; i++) {
    try {
      const transposed = Chord.transpose(chord).up(i).toString();
      allTransposed.add(transposed);
    } catch (e) {
      // Se não conseguir transpor, ignora
      allTransposed.add(chord);
    }
  }
});

// Ordena e salva no arquivo de saída
const sorted = Array.from(allTransposed).sort();
fs.writeFileSync(outputFile, sorted.join("\n"), "utf8");
console.log("Transposed chords written to", outputFile);
