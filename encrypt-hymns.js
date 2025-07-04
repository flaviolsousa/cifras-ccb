#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const Utf8 = require("crypto-js/enc-utf8");

// Encryption configuration
const BASE_KEY = "4cbb0d-89b-540ff-5602a520e0-610-9dcb";
const extraKey = "flaViolao-ccb3ncrypT";
const combined = BASE_KEY + extraKey;

/**
 * Generates the encryption key by combining the base + environment variable
 */
function generateKey() {
  // Generate SHA-256 hash to get exactly 32 bytes
  return SHA256(combined).toString();
}

/**
 * Encrypts the content using AES (crypto-js)
 */
function encryptContent(content) {
  const key = generateKey();
  const encrypted = AES.encrypt(JSON.stringify(content), key).toString();
  return encrypted;
}

/**
 * Decrypts the content using AES (crypto-js)
 */
function decryptContent(encryptedData) {
  const key = generateKey();
  const decrypted = AES.decrypt(encryptedData, key).toString(Utf8);
  return JSON.parse(decrypted);
}

/**
 * Processes the special Hymns.json file (array-based encryption)
 */
function processHymnsFile(filePath, isEncrypt = true, outputDir = null) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    if (!Array.isArray(data)) {
      console.error(`❌ Hymns.json must contain an array`);
      return;
    }

    if (isEncrypt) {
      // Encrypt: each item becomes {code, enc}
      const result = data.map((item) => {
        const { code, ...contentToEncrypt } = item;
        const encrypted = encryptContent(contentToEncrypt);
        return {
          code: code,
          enc: encrypted,
        };
      });

      const outputPath = outputDir ? path.join(outputDir, path.basename(filePath)) : filePath;
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`✓ Encrypted: ${path.basename(filePath)} (${result.length} items)`);
    } else {
      // Decrypt: restore original array structure
      const result = data.map((item) => {
        if (!item.enc) {
          console.log(`⚠ Item with code ${item.code} is not encrypted`);
          return item;
        }

        const decryptedContent = decryptContent(item.enc);
        return {
          code: item.code,
          ...decryptedContent,
        };
      });

      const outputPath = outputDir ? path.join(outputDir, path.basename(filePath)) : filePath;
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`✓ Decrypted: ${path.basename(filePath)} (${result.length} items)`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${path.basename(filePath)}: ${error.message}`);
  }
}

/**
 * Processes a JSON file
 */
function processFile(filePath, isEncrypt = true, outputDir = null) {
  // Check if it's the special Hymns.json file
  if (path.basename(filePath) === "Hymns.json") {
    processHymnsFile(filePath, isEncrypt, outputDir);
    return;
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    if (isEncrypt) {
      // Encrypt: keep only 'code' and add 'enc'
      const { code, ...contentToEncrypt } = data;
      const encrypted = encryptContent(contentToEncrypt);

      const result = {
        code: code,
        enc: encrypted,
      };

      // Determine output file
      const outputPath = outputDir ? path.join(outputDir, path.basename(filePath)) : filePath;

      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`✓ Encrypted: ${path.basename(filePath)}`);
    } else {
      // Decrypt: restore original content
      if (!data.enc) {
        console.log(`⚠ File ${path.basename(filePath)} is not encrypted`);
        return;
      }

      const decryptedContent = decryptContent(data.enc);
      const result = {
        code: data.code,
        ...decryptedContent,
      };

      const outputPath = outputDir ? path.join(outputDir, path.basename(filePath)) : filePath;

      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
      console.log(`✓ Decrypted: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${path.basename(filePath)}: ${error.message}`);
  }
}

/**
 * Processes all files in the lyrics folder
 */
function processAllFiles(isEncrypt = true, override = false) {
  const lyricsDir = path.join(__dirname, "data", "lyrics");
  const outputDir = override ? null : path.join(__dirname, "lyrics-gen-enc");

  if (!fs.existsSync(lyricsDir)) {
    console.error("❌ Lyrics directory not found:", lyricsDir);
    return;
  }

  // Create output directory if needed
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }

  const files = fs.readdirSync(lyricsDir).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.log("⚠ No JSON files found in lyrics directory");
    return;
  }

  console.log(`🔄 Processing ${files.length} files...`);
  console.log(`📁 Output: ${outputDir || "overriding original files"}`);

  files.forEach((file) => {
    const filePath = path.join(lyricsDir, file);
    processFile(filePath, isEncrypt, outputDir);
  });

  console.log(`✅ Completed processing ${files.length} files`);
}

/**
 * Processes a specific file
 */
function processSingleFile(filename, isEncrypt = true, override = false) {
  let filePath;
  let outputDir;

  // Check if it's Hymns.json (located in /data)
  if (filename === "Hymns.json") {
    if (isEncrypt) {
      // For encryption, use the original file in /data
      const dataDir = path.join(__dirname, "data");
      filePath = path.join(dataDir, filename);
      outputDir = override ? null : path.join(__dirname, "lyrics-gen-enc");
    } else {
      // For decryption, use the encrypted file in /lyrics-gen-enc or original if override
      if (override) {
        const dataDir = path.join(__dirname, "data");
        filePath = path.join(dataDir, filename);
        outputDir = null; // Override original
      } else {
        const encDir = path.join(__dirname, "lyrics-gen-enc");
        filePath = path.join(encDir, filename);
        outputDir = path.join(__dirname, "lyrics-gen-enc");
      }
    }
  } else {
    // Regular hymn files (located in /data/lyrics)
    if (isEncrypt) {
      // For encryption, use the original file in /data/lyrics
      const lyricsDir = path.join(__dirname, "data", "lyrics");
      filePath = path.join(lyricsDir, filename);
      outputDir = override ? null : path.join(__dirname, "lyrics-gen-enc");
    } else {
      // For decryption, use the encrypted file in /lyrics-gen-enc or original if override
      if (override) {
        const lyricsDir = path.join(__dirname, "data", "lyrics");
        filePath = path.join(lyricsDir, filename);
        outputDir = null; // Override original
      } else {
        const encDir = path.join(__dirname, "lyrics-gen-enc");
        filePath = path.join(encDir, filename);
        outputDir = path.join(__dirname, "lyrics-gen-enc");
      }
    }
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  // Create output directory if needed
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }

  console.log(`🔄 Processing single file: ${filename}`);
  console.log(`📁 Input: ${filePath}`);
  console.log(`📁 Output: ${outputDir || "overriding original file"}`);

  processFile(filePath, isEncrypt, outputDir);
}

/**
 * Shows CLI help
 */
function showHelp() {
  console.log(`
📖 Violão CCB - Hymns Encryption Tool

Usage:
  node encrypt-hymns.js encrypt [file] [--override]    Encrypt hymns
  node encrypt-hymns.js decrypt [file] [--override]    Decrypt hymns
  node encrypt-hymns.js help                           Show this help

Examples:
  node encrypt-hymns.js encrypt                        Encrypt all files
  node encrypt-hymns.js encrypt 001.json               Encrypt specific file
  node encrypt-hymns.js encrypt Hymns.json             Encrypt Hymns.json (array)
  node encrypt-hymns.js decrypt 001.json               Decrypt specific file
  node encrypt-hymns.js decrypt Hymns.json             Decrypt Hymns.json (array)
  node encrypt-hymns.js encrypt --override             Encrypt all files (override)
  node encrypt-hymns.js decrypt --override             Decrypt all files (override)

Notes:
  - Without --override, output goes to 'lyrics-gen-enc' folder
  - With --override, original files are replaced
  - Hymns.json is treated as array where each item is encrypted separately
    `);
}

/**
 * Main function (CLI)
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "help") {
    showHelp();
    return;
  }

  const command = args[0];
  const hasOverride = args.includes("--override");
  const fileArg = args.find((arg) => arg.endsWith(".json"));

  console.log("🎵 Violão CCB - Hymns Encryption Tool");
  console.log("=====================================");

  switch (command) {
    case "encrypt":
      if (fileArg) {
        processSingleFile(fileArg, true, hasOverride);
      } else {
        processAllFiles(true, hasOverride);
      }
      break;

    case "decrypt":
      if (fileArg) {
        processSingleFile(fileArg, false, hasOverride);
      } else {
        processAllFiles(false, hasOverride);
      }
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export functions for module usage
module.exports = {
  encryptContent,
  decryptContent,
  processFile,
  processAllFiles,
  processSingleFile,
  processHymnsFile,
};
