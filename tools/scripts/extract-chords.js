const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "cifrasccb", "output");
const allChords = new Set();

// Read all JSON files from output directory
fs.readdirSync(outputDir)
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    if (
      [
        "302.json",
        "304.json",
        "306.json",
        "306.json",
        "309.json",
        "313.json",
        "315.json",
        "334.json",
        "344.json",
        "347.json",
        "352.json",
        "357.json",
        "360.json",
        "362.json",
        "406.json",
        "303.json",
        "308.json",
        "324.json",
        "327.json",
        "330.json",
        "389.json",
        "307.json",
        "329.json",
        "332.json",
        "337.json",
        "337.json",
        "337.json",
        "337.json",
        "340.json",
        "345.json",
        "384.json",
        "273.json",
        "273.json",
        "316.json",
        "335.json",
        "343.json",
        "343.json",
        "356.json",
        "361.json",

        "311.json",
        "311.json",
        "311.json",
        "311.json",
        "318.json",
        "318.json",
        "318.json",
        "318.json",
        "323.json",
        "323.json",
        "323.json",
        "323.json",
        "331.json",
        "331.json",
        "331.json",
        "336.json",
        "336.json",
        "339.json",
        "339.json",
        "339.json",
      ].indexOf(file) >= 0
    ) {
      return;
    }
    const content = JSON.parse(fs.readFileSync(path.join(outputDir, file), "utf8"));
    // Process each stanza
    content.score.stanzas.forEach((stanza) => {
      if (stanza.type != "ref") {
        stanza.verses.forEach((verse) => {
          if (["Grande", "o", "O", "Para", "Jesus"].some((word) => verse.chords.includes(word))) {
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
