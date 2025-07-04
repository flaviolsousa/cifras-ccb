require("dotenv").config();
const { execSync } = require("child_process");

try {
  execSync("node encrypt-hymns.js encrypt --override", { stdio: "inherit", env: process.env });
  execSync("node encrypt-hymns.js encrypt Hymns.json --override", { stdio: "inherit", env: process.env });
  console.log("eas-post-install completed successfully.");
} catch (error) {
  console.error("eas-post-install failed:", error);
  process.exit(1);
}
