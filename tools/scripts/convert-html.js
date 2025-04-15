/* eslint-disable */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const htmlFilePath = path.join(__dirname, "cifrasccb", "input.html");
const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

const titlesFilePath = path.join(__dirname, "cifrasccb", "titles.json");
const titlesContent = fs.readFileSync(titlesFilePath, "utf-8");
const titles = JSON.parse(titlesContent);

const dom = new JSDOM(htmlContent);
const document = dom.window.document;

const outputDir = path.join(__dirname, "cifrasccb", "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function enrichLines(lines) {
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim() === "" ? "" : lines[i];
  }
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].replace(/\s{2,}.*\s{2,}/, "").trim().length > 8 && lines[i + 1].replace(/\s{2,}.*\s{2,}/, "").trim().length > 8) {
      lines.splice(i + 1, 0, "");
      i++;
    }
  }
}

function linesToScore(lines) {
  const score = { stanzas: [] };
  let currentStanza = null;
  let chorusStanzaRef = null;
  let previousLine = null;
  let lineEven = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("Coro:")) {
      currentStanza = { type: "chorus", verses: [{ chords: lines[++i], lyrics: lines[++i] }] };
      score.stanzas.push(currentStanza);
      chorusStanzaRef = `score.stanzas[${score.stanzas.length - 1}]`;
      lineEven = i % 2 === 0;
      continue;
    }

    if (/^\d\.\s/.test(line)) {
      if (currentStanza) currentStanza.verses.pop();
      const stanzaCode = line.match(/^(\d+)\.\s/)[1];
      const lyrics = line.replace(/^\d\.\s/, "");
      const chords = previousLine.slice(line.match(/^\d\.\s/)[0].length);
      currentStanza = { type: "lyric", code: stanzaCode, verses: [{ chords, lyrics }] };

      score.stanzas.push(currentStanza);
      if (chorusStanzaRef) score.stanzas.push({ type: "ref", ref: chorusStanzaRef });
      lineEven = i % 2 === 0;
      continue;
    }

    if (previousLine !== null && currentStanza !== null) {
      const iEven = i % 2 === 0;
      if ((lineEven && iEven) || (!lineEven && !iEven)) {
        currentStanza.verses.push({
          chords: previousLine,
          lyrics: line,
        });
      }
    }
    previousLine = line;
  }

  return score;
}

const preTags = document.querySelectorAll("body pre");
preTags.forEach((preTag) => {
  const id = preTag.id;
  if (id) {
    if (["273"].indexOf(id) >= 0) return;
    //if (["125"].indexOf(id) < 0) return;

    const titleEntry = titles.find((title) => title.id === id);
    if (titleEntry) {
      // if (titleEntry.code !== "Coro-1") return;
      preTag.innerHTML = preTag.innerHTML.replace(/<strong>/g, "<strong>Coro:");
      const content = preTag.textContent.trim().replace(/<b>(.*?)<\/b>/g, "$1");
      const lines = content.split("\n");

      const toneLineIndex = lines.findIndex((line) => line.startsWith("Tom: "));
      const tone = { recommended: lines[toneLineIndex].replace("Tom: ", "") };
      lines.splice(toneLineIndex, 1);

      enrichLines(lines);
      const score = linesToScore(lines);

      const jsonObject = {
        version: "v2",
        title: titleEntry.title,
        tone,
        //content: lines,
        score,
      };

      const outputFilePath = path.join(outputDir, `${titleEntry.code}.json`);
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonObject, null, 2), "utf-8");
    }
  }
});
