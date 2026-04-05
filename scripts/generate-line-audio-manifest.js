const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "docs", "voice-prompts.csv");
const audioRoot = path.join(root, "public", "asset", "audio", "lines");
const manifestPath = path.join(audioRoot, "manifest.json");
const supportedFormats = ["mp3", "wav", "opus", "aac", "flac", "pcm"];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }

      row.push(value);
      value = "";

      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function sceneDirName(sceneId) {
  return sceneId.replace(/[^a-z0-9-]+/gi, "_");
}

function findExistingFile(sceneId, originalName) {
  const baseName = originalName.replace(/\.mp3$/i, "");
  const folder = path.join(audioRoot, sceneDirName(sceneId));

  for (const format of supportedFormats) {
    const fileName = `${baseName}.${format}`;
    const absolutePath = path.join(folder, fileName);
    if (fs.existsSync(absolutePath)) {
      return {
        fileName,
        format,
        publicSrc: `/asset/audio/lines/${sceneDirName(sceneId)}/${fileName}`,
      };
    }
  }

  return null;
}

function main() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Missing CSV: ${csvPath}`);
  }

  fs.mkdirSync(audioRoot, { recursive: true });

  const csvRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const [header, ...dataRows] = csvRows;
  const index = Object.fromEntries(header.map((name, position) => [name, position]));
  const manifest = [];

  for (const row of dataRows) {
    const sceneId = row[index.scene_id];
    const sceneTitle = row[index.scene_title];
    const speaker = row[index.speaker];
    const emotion = row[index.emotion];
    const lineText = row[index.line_text];
    const sceneOrder = Number.parseInt(row[index.scene_order] || "0", 10);
    const existing = findExistingFile(sceneId, row[index.mp3_name]);

    if (!existing) {
      continue;
    }

    manifest.push({
      scene_order: Number.isNaN(sceneOrder) ? 0 : sceneOrder,
      scene_id: sceneId,
      scene_title: sceneTitle,
      speaker,
      emotion,
      text: lineText,
      src: existing.publicSrc,
      format: existing.format,
    });
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Saved ${manifest.length} manifest entries to ${manifestPath}`);
}

main();
