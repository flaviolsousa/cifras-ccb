/* eslint-disable */

/**
 * Script to update Hymns.json with:
 * 1. 'level' attribute from corresponding lyrics files
 * 2. 'chords' attribute by extracting distinct chords from lyrics files
 * 3. 'rhythm' attribute from corresponding lyrics files
 */
const fs = require("fs");
const path = require("path");

// Define paths
const hymnsPath = path.join(__dirname, "../../data/Hymns.json");
const lyricsDir = path.join(__dirname, "../../data/lyrics");

// Load Hymns.json
let hymns;
try {
  const hymnsData = fs.readFileSync(hymnsPath, "utf8");
  hymns = JSON.parse(hymnsData);
  console.log(`Loaded Hymns.json with ${hymns.length} entries`);
} catch (error) {
  console.error("Error loading Hymns.json:", error);
  process.exit(1);
}

// Track the number of updates
let levelUpdatedCount = 0;
let levelMissingCount = 0;
let chordsUpdatedCount = 0;
let rhythmUpdatedCount = 0;
let rhythmMissingCount = 0;

/**
 * Updates the hymn level based on the lyrics file
 * @param {Object} hymn - The hymn object to update
 * @param {Object} lyrics - The lyrics object containing level information
 * @param {string} code - The hymn code
 * @returns {boolean} - Whether the level was updated
 */
function updateHymnLevel(hymn, lyrics, code) {
  if (lyrics.level !== undefined) {
    hymn.level = lyrics.level;
    console.log(`Added level ${lyrics.level} to hymn ${code} - ${hymn.title}`);
    return true;
  } else {
    console.warn(`No level found in lyrics file for hymn ${code} - ${hymn.title}`);
    return false;
  }
}

/**
 * Extracts distinct chords from lyrics and updates the hymn
 * @param {Object} hymn - The hymn object to update
 * @param {Object} lyrics - The lyrics object containing chord information
 * @param {string} code - The hymn code
 * @returns {boolean} - Whether chords were updated
 */
function extractAndUpdateChords(hymn, lyrics, code) {
  const allChords = new Set();

  // Extract chords from stanzas
  if (lyrics.score && lyrics.score.stanzas) {
    lyrics.score.stanzas.forEach((stanza) => {
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
  if (lyrics.score && lyrics.score.introduction) {
    lyrics.score.introduction.forEach((chord) => {
      allChords.add(chord);
    });
  }

  // Update hymn with distinct chords
  const distinctChords = Array.from(allChords).sort();
  hymn.chords = distinctChords;

  if (distinctChords.length > 0) {
    console.log(`Added ${distinctChords.length} distinct chords to hymn ${code} - ${hymn.title}`);
    return true;
  }
  return false;
}

/**
 * Updates the hymn rhythm based on the lyrics file
 * @param {Object} hymn - The hymn object to update
 * @param {Object} lyrics - The lyrics object containing rhythm information
 * @param {string} code - The hymn code
 * @returns {boolean} - Whether the rhythm was updated
 */
function updateHymnRhythm(hymn, lyrics, code) {
  if (lyrics.rhythm !== undefined) {
    hymn.rhythm = lyrics.rhythm;
    console.log(`Added rhythm "${lyrics.rhythm}" to hymn ${code} - ${hymn.title}`);
    return true;
  } else {
    console.warn(`No rhythm found in lyrics file for hymn ${code} - ${hymn.title}`);
    return false;
  }
}

// Process each hymn
hymns = hymns.map((hymn) => {
  // Skip empty or undefined entries
  if (!hymn || Object.keys(hymn).length === 0) {
    return hymn;
  }

  const code = hymn.code;
  if (!code) {
    console.warn("Found hymn without code:", hymn);
    return hymn;
  }

  // Path to the corresponding lyrics file
  const lyricsPath = path.join(lyricsDir, `${code}.json`);

  // Check if the lyrics file exists
  if (fs.existsSync(lyricsPath)) {
    try {
      // Read the lyrics file
      const lyricsData = fs.readFileSync(lyricsPath, "utf8");
      const lyrics = JSON.parse(lyricsData);

      // 1. Update level
      if (updateHymnLevel(hymn, lyrics, code)) {
        levelUpdatedCount++;
      } else {
        levelMissingCount++;
      }

      // 2. Extract and update chords
      if (extractAndUpdateChords(hymn, lyrics, code)) {
        chordsUpdatedCount++;
      }

      // 3. Update rhythm
      if (updateHymnRhythm(hymn, lyrics, code)) {
        rhythmUpdatedCount++;
      } else {
        rhythmMissingCount++;
      }
    } catch (error) {
      console.error(`Error processing lyrics file for hymn ${code}:`, error);
    }
  } else {
    console.warn(`No lyrics file found for hymn ${code} - ${hymn.title}`);
    levelMissingCount++;
    rhythmMissingCount++;
  }

  return hymn;
});

// Save the updated Hymns.json
try {
  fs.writeFileSync(hymnsPath, JSON.stringify(hymns, null, 2), "utf8");
  console.log(`\nUpdate complete!`);
  console.log(`Updated ${levelUpdatedCount} hymns with level information`);
  console.log(`Missing level information for ${levelMissingCount} hymns`);
  console.log(`Updated ${chordsUpdatedCount} hymns with chord information`);
  console.log(`Updated ${rhythmUpdatedCount} hymns with rhythm information`);
  console.log(`Missing rhythm information for ${rhythmMissingCount} hymns`);
} catch (error) {
  console.error("Error saving updated Hymns.json:", error);
}
