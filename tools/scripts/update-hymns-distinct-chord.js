const fs = require("fs");
const path = require("path");

// Paths
const hymnsJsonPath = path.join(__dirname, "../../data/Hymns.json");
const lyricsDir = path.join(__dirname, "../../data/lyrics");

// Load Hymns.json
console.log("Loading Hymns.json...");
const hymnsData = JSON.parse(fs.readFileSync(hymnsJsonPath, "utf8"));

// Process each hymn
console.log("Processing hymns and extracting distinct chords...");
let updatedCount = 0;

hymnsData.forEach((hymn) => {
  const code = hymn.code;
  const lyricsPath = path.join(lyricsDir, `${code}.json`);

  // Check if lyrics file exists
  if (fs.existsSync(lyricsPath)) {
    try {
      const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, "utf8"));

      // Extract chords from stanzas
      const allChords = new Set();

      if (lyricsData.score && lyricsData.score.stanzas) {
        lyricsData.score.stanzas.forEach((stanza) => {
          if (stanza.type === "ref") return; // Skip refs as they point to other stanzas

          if (stanza.text && Array.isArray(stanza.text)) {
            stanza.text.forEach((line) => {
              // Extract chords using regex
              const chordRegex = /\[([^\|\]]+)(?:\|[^\]]+)?\]/g;
              let match;

              while ((match = chordRegex.exec(line)) !== null) {
                allChords.add(match[1]);
              }
            });
          }
        });
      }

      // Add introduction chords if they exist
      if (lyricsData.score && lyricsData.score.introduction) {
        lyricsData.score.introduction.forEach((chord) => {
          allChords.add(chord);
        });
      }

      // Update hymn with distinct chords
      const distinctChords = Array.from(allChords).sort();
      hymn.chords = distinctChords;
      updatedCount++;
    } catch (error) {
      console.error(`Error processing ${code}.json:`, error.message);
    }
  } else {
    console.log(`Lyrics file not found for hymn ${code}`);
  }
});

// Save updated Hymns.json
fs.writeFileSync(hymnsJsonPath, JSON.stringify(hymnsData, null, 2), "utf8");
console.log(`Finished updating! Added chord information to ${updatedCount} hymns.`);
