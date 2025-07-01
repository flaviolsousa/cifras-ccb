/* eslint-disable */

/**
 * Script to add the 'level' attribute to Hymns.json by copying it from the corresponding lyrics files
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
let updatedCount = 0;
let missingCount = 0;

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
      // Read the lyrics file and get the level
      const lyricsData = fs.readFileSync(lyricsPath, "utf8");
      const lyrics = JSON.parse(lyricsData);

      // Only update if the level exists in the lyrics file
      if (lyrics.level !== undefined) {
        hymn.level = lyrics.level;
        updatedCount++;
        console.log(`Added level ${lyrics.level} to hymn ${code} - ${hymn.title}`);
      } else {
        console.warn(`No level found in lyrics file for hymn ${code} - ${hymn.title}`);
        missingCount++;
      }
    } catch (error) {
      console.error(`Error processing lyrics file for hymn ${code}:`, error);
    }
  } else {
    console.warn(`No lyrics file found for hymn ${code} - ${hymn.title}`);
    missingCount++;
  }

  return hymn;
});

// Save the updated Hymns.json
try {
  fs.writeFileSync(hymnsPath, JSON.stringify(hymns, null, 2), "utf8");
  console.log(`\nUpdate complete!`);
  console.log(`Updated ${updatedCount} hymns with level information`);
  console.log(`Missing level information for ${missingCount} hymns`);
} catch (error) {
  console.error("Error saving updated Hymns.json:", error);
}
