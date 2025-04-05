/* eslint-disable */

const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "cifrasccb", "output");
const allChords = new Set();

// Read all JSON files from output directory
fs.readdirSync(outputDir)
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    // if (
    //   [
    //     "302.json",
    //     "339.json",
    //   ].indexOf(file) >= 0
    // ) {
    //   return;
    // }
    const content = JSON.parse(fs.readFileSync(path.join(outputDir, file), "utf8"));
    // Process each stanza
    content.score.stanzas.forEach((stanza) => {
      if (stanza.type != "ref") {
        stanza.verses.forEach((verse) => {
          if (["Jesus", "glorioso", "Minha", "venturoso", "tornou-me"].some((word) => verse.chords.includes(word))) {
            console.log("HINO COM ERRO: " + file);
          }

          const chords = verse.chords
            .trim()
            .split(/\s+/)
            .filter((chord) => chord && chord !== "...");

          // Add each chord to the Set
          chords.forEach((chord) => allChords.add(chord.replaceAll("...", "")));
        });
      }
    });
  });

// Convert Set to sorted Array and write to file
const sortedChords = Array.from(allChords).sort();
console.log("Unique chords found:", sortedChords);

// Write to file
fs.writeFileSync(path.join(__dirname, "cifrasccb", "unique_chords.tmp"), sortedChords.join("\n"), "utf8");
