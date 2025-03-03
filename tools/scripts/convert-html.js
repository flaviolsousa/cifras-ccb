const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Read the HTML file
const htmlFilePath = path.join(__dirname, "cifrasccb", "input.html");
const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

// Read the titles JSON file
const titlesFilePath = path.join(__dirname, "cifrasccb", "titles.json");
const titlesContent = fs.readFileSync(titlesFilePath, "utf-8");
const titles = JSON.parse(titlesContent);

// Parse the HTML content
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Create the output directory if it doesn't exist
const outputDir = path.join(__dirname, "cifrasccb", "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Process each <pre> tag inside the <body>
const preTags = document.querySelectorAll("body pre");
preTags.forEach((preTag) => {
  const id = preTag.id;
  if (id) {
    if (id == "005") {
      console.log(id);
    }
    const titleEntry = titles.find((title) => title.id === id);
    if (titleEntry) {
      const content = preTag.textContent.trim().replace(/<b>(.*?)<\/b>/g, "$1");
      const lines = content.split("\n");

      // Find the tone line and remove it from the content
      const toneLineIndex = lines.findIndex((line) => line.startsWith("Tom: "));
      const tone = lines[toneLineIndex].replace("Tom: ", "");
      lines.splice(toneLineIndex, 1);

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

      // Create the JSON object
      const jsonObject = {
        version: "v1",
        title: titleEntry.title,
        difficulty: 3, // Default difficulty, can be adjusted
        tone: tone,
        content: lines,
      };

      // Write the JSON object to a file
      const outputFilePath = path.join(outputDir, `${titleEntry.code}.json`);
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonObject, null, 2), "utf-8");
    }
  }
});
