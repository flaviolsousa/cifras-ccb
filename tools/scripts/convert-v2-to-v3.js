/* eslint-disable */
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "../../data/lyrics-v2");
const outputDir = path.join(__dirname, "../../data/lyrics");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Convert a single verse from v2 to v3 format
function convertVerseToV3(verse) {
  const { chords, lyrics } = verse;
  const chordPositions = [];
  let currentPosition = 0;

  // Split chords and get their positions
  const chordParts = chords.split(/\s+/);
  chordParts.forEach((chord) => {
    if (chord && chord !== "...") {
      const position = chords.indexOf(chord, currentPosition);
      if (position !== -1) {
        chordPositions.push({ chord, position });
        currentPosition = position + chord.length;
      }
    }
  });

  // Sort positions from right to left to avoid offset issues
  chordPositions.sort((a, b) => b.position - a.position);

  // Insert chord markers into lyrics
  let result = lyrics;
  chordPositions.forEach(({ chord, position }) => {
    // Find the corresponding position in lyrics
    const lyricPosition = Math.min(position, lyrics.length);
    // Insert the chord at the calculated position
    result = result.slice(0, lyricPosition) + `[${chord}]` + result.slice(lyricPosition);
  });

  return result;
}

// Convert a hymn from v2 to v3 format
function convertHymnToV3(hymn) {
  const v3Hymn = {
    ...hymn,
    version: "v3",
    score: {
      ...hymn.score,
      stanzas: hymn.score.stanzas.map((stanza) => {
        if (stanza.type === "ref") {
          return stanza;
        }
        return {
          ...stanza,
          text: stanza.verses.map((verse) => convertVerseToV3(verse)),
          verses: undefined, // Remove the old verses array
        };
      }),
    },
  };

  return v3Hymn;
}

// Process all JSON files in the input directory
fs.readdirSync(inputDir)
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    try {
      console.log(`Converting ${file}...`);
      const filePath = path.join(inputDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

      // Skip if already v3
      if (content.version === "v3") {
        console.log(`Skipping ${file} - already v3`);
        return;
      }

      const v3Content = convertHymnToV3(content);
      const outputPath = path.join(outputDir, file);

      fs.writeFileSync(outputPath, JSON.stringify(v3Content, null, 2), "utf8");
      console.log(`Successfully converted ${file} to ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`Error converting ${file}:`, error);
    }
  });

console.log("Conversion complete!");
