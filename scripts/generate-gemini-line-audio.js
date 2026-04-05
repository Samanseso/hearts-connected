const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const csvPath = path.join(root, "docs", "voice-prompts.csv");
const outputRoot = path.join(root, "public", "asset", "audio", "lines");
const manifestPath = path.join(outputRoot, "manifest.json");

loadDotEnv(envPath);

const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
const apiBase = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

const voiceBySpeaker = {
  Narration: "Kore",
  Narra: "Alnilam",
  Friend1: "Aoede",
  Friend2: "Fenrir",
  Alex: "Puck",
  Jamie: "Zephyr",
  Riley: "Umbriel",
  Chris: "Orus",
  Sam: "Algieba",
  Taylor: "Aoede",
  Jordan: "Schedar",
  Reese: "Iapetus",
  Casey: "Laomedeia",
  Morgan: "Gacrux",
  Dana: "Laomedeia",
  Nico: "Pulcherrima",
  Lea: "Enceladus",
  Micah: "Charon",
};

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function printHelp() {
  console.log(`
Generate Gemini TTS audio line by line from docs/voice-prompts.csv.

Usage:
  node scripts/generate-gemini-line-audio.js [--scene <scene-id>] [--start-at <n>] [--limit <n>] [--overwrite] [--format wav|mp3] [--batch-size <n>] [--wait-seconds <n>]

Examples:
  node scripts/generate-gemini-line-audio.js --scene social-media-expectations
  node scripts/generate-gemini-line-audio.js --scene online-jealousy --limit 12
  node scripts/generate-gemini-line-audio.js --scene comparison-online --start-at 34
  node scripts/generate-gemini-line-audio.js --overwrite --format mp3 --batch-size 3 --wait-seconds 60

Environment:
  GEMINI_API_KEY        Required. Loaded from .env automatically when present.
  GEMINI_TTS_MODEL      Optional, defaults to gemini-2.5-flash-preview-tts
  GEMINI_API_BASE       Optional, defaults to https://generativelanguage.googleapis.com/v1beta

Output:
  public/asset/audio/lines/<scene-id>/<line-file>.(wav|mp3)
  public/asset/audio/lines/manifest.json

Notes:
  WAV works out of the box. MP3 conversion requires ffmpeg in your PATH.
  Default pacing is 3 lines per batch with a 60 second pause between batches.
`);
}

function parseArgs(argv) {
  const options = {
    scene: null,
    startAt: 1,
    limit: null,
    overwrite: false,
    help: false,
    format: "wav",
    batchSize: 3,
    waitSeconds: 60,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--scene") {
      options.scene = argv[i + 1] || null;
      i += 1;
      continue;
    }

    if (arg === "--start-at") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      options.startAt = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
      i += 1;
      continue;
    }

    if (arg === "--limit") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      options.limit = Number.isNaN(parsed) ? null : parsed;
      i += 1;
      continue;
    }

    if (arg === "--batch-size") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      options.batchSize = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
      i += 1;
      continue;
    }

    if (arg === "--wait-seconds") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      options.waitSeconds = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
      i += 1;
      continue;
    }

    if (arg === "--format") {
      const format = (argv[i + 1] || "").toLowerCase();
      if (format === "wav" || format === "mp3") {
        options.format = format;
      } else {
        throw new Error(`Unsupported format: ${argv[i + 1] || ""}. Use wav or mp3.`);
      }
      i += 1;
      continue;
    }

    if (arg === "--overwrite") {
      options.overwrite = true;
    }
  }

  return options;
}

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

function createWavHeader(dataLength, options) {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

function parseMimeType(mimeType) {
  const [fileType, ...params] = (mimeType || "audio/L16;rate=24000").split(";").map((s) => s.trim());
  const [, format] = fileType.split("/");
  const options = {
    numChannels: 1,
    sampleRate: 24000,
    bitsPerSample: 16,
  };

  if (format && format.startsWith("L")) {
    const bits = Number.parseInt(format.slice(1), 10);
    if (!Number.isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }

  for (const param of params) {
    const [key, value] = param.split("=").map((s) => s.trim());
    if (key === "rate") {
      const rate = Number.parseInt(value, 10);
      if (!Number.isNaN(rate)) {
        options.sampleRate = rate;
      }
    }
    if (key === "channels") {
      const channels = Number.parseInt(value, 10);
      if (!Number.isNaN(channels)) {
        options.numChannels = channels;
      }
    }
  }

  return options;
}

function toWavBuffer(inlineData) {
  const options = parseMimeType(inlineData.mimeType);
  const pcm = Buffer.from(inlineData.data || "", "base64");
  const header = createWavHeader(pcm.length, options);
  return Buffer.concat([header, pcm]);
}

function sceneDirName(sceneId) {
  return sceneId.replace(/[^a-z0-9-]+/gi, "_");
}

function checkFetchSupport() {
  if (typeof fetch !== "function") {
    throw new Error("This Node version does not expose fetch(). Please use Node 18+.");
  }
}

function checkFfmpegAvailable() {
  const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return result.status === 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeRows(format) {
  const csvRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const [header, ...dataRows] = csvRows;
  const index = Object.fromEntries(header.map((name, i) => [name, i]));

  return dataRows.map((row) => {
    const mp3Name = row[index.mp3_name];
    const baseName = mp3Name.replace(/\.mp3$/i, "");
    const fileName = `${baseName}.${format}`;
    const sceneId = row[index.scene_id];
    const dirName = sceneDirName(sceneId);

    return {
      scene_order: row[index.scene_order],
      scene_id: sceneId,
      scene_title: row[index.scene_title],
      speaker: row[index.speaker],
      emotion: row[index.emotion],
      line_text: row[index.line_text],
      tts_prompt: row[index.tts_prompt],
      mp3_name: mp3Name,
      output_name: fileName,
      outputDir: path.join(outputRoot, dirName),
      outputPath: path.join(outputRoot, dirName, fileName),
      publicSrc: `/asset/audio/lines/${dirName}/${fileName}`,
    };
  });
}

async function generateLine(row, voiceName) {
  const endpoint = `${apiBase}/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model,
      contents: [{ parts: [{ text: row.tts_prompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    }),
  });

  const payloadText = await response.text();
  let payload;

  try {
    payload = JSON.parse(payloadText);
  } catch {
    throw new Error(`Gemini returned a non-JSON response for ${row.output_name}: ${payloadText.slice(0, 240)}`);
  }

  if (!response.ok) {
    const message = payload?.error?.message || payloadText;
    throw new Error(`Gemini request failed for ${row.output_name}: ${response.status} ${message}`);
  }

  const inlineData = payload?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!inlineData?.data) {
    throw new Error(`No audio returned for ${row.output_name}`);
  }

  return {
    voiceName,
    wavBuffer: toWavBuffer(inlineData),
  };
}

function saveOutput(buffer, outputPath, format) {
  if (format === "wav") {
    fs.writeFileSync(outputPath, buffer);
    return;
  }

  if (!checkFfmpegAvailable()) {
    throw new Error("ffmpeg is required for --format mp3. Install ffmpeg or use --format wav.");
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gemini-tts-"));
  const tempWavPath = path.join(tempDir, "line.wav");
  fs.writeFileSync(tempWavPath, buffer);

  try {
    const result = spawnSync(
      "ffmpeg",
      ["-y", "-hide_banner", "-loglevel", "error", "-i", tempWavPath, "-codec:a", "libmp3lame", "-q:a", "2", outputPath],
      { encoding: "utf8" },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr || "Unknown ffmpeg conversion failure.");
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function generateWithRetry(row, voiceName, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await generateLine(row, voiceName);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(600 * attempt);
      }
    }
  }

  throw lastError;
}

function refreshManifest() {
  const scriptPath = path.join(__dirname, "generate-line-audio-manifest.js");

  if (!fs.existsSync(scriptPath)) {
    console.warn("Manifest generator not found, skipping manifest refresh.");
    return;
  }

  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Failed to refresh the audio manifest after generation.");
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  checkFetchSupport();

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in the environment or .env file.");
  }

  let rows = normalizeRows(options.format);

  if (options.scene) {
    rows = rows.filter((row) => row.scene_id === options.scene);
  }

  if (options.startAt > 1) {
    rows = rows.slice(options.startAt - 1);
  }

  if (typeof options.limit === "number" && options.limit > 0) {
    rows = rows.slice(0, options.limit);
  }

  if (rows.length === 0) {
    throw new Error("No matching rows found in docs/voice-prompts.csv.");
  }

  if (options.format === "mp3" && !checkFfmpegAvailable()) {
    throw new Error("ffmpeg is not available in PATH. Install ffmpeg or rerun with --format wav.");
  }

  fs.mkdirSync(outputRoot, { recursive: true });
  console.log(`Generating ${rows.length} line files as ${options.format.toUpperCase()} using ${model}.`);
  console.log(`Batch size: ${options.batchSize}, wait between batches: ${options.waitSeconds}s, start-at: ${options.startAt}.`);

  let generatedCount = 0;
  const manifest = [];

  for (const [index, row] of rows.entries()) {
    fs.mkdirSync(row.outputDir, { recursive: true });
    const voiceName = voiceBySpeaker[row.speaker] || "Kore";

    if (!options.overwrite && fs.existsSync(row.outputPath)) {
      console.log(`[${index + 1}/${rows.length}] Skipping existing ${row.output_name}`);
      manifest.push({
        scene_order: Number.parseInt(row.scene_order, 10),
        scene_id: row.scene_id,
        scene_title: row.scene_title,
        speaker: row.speaker,
        emotion: row.emotion,
        voice: voiceName,
        text: row.line_text,
        src: row.publicSrc,
        format: options.format,
      });
    } else {
      const result = await generateWithRetry(row, voiceName);
      saveOutput(result.wavBuffer, row.outputPath, options.format);
      generatedCount += 1;

      manifest.push({
        scene_order: Number.parseInt(row.scene_order, 10),
        scene_id: row.scene_id,
        scene_title: row.scene_title,
        speaker: row.speaker,
        emotion: row.emotion,
        voice: result.voiceName,
        text: row.line_text,
        src: row.publicSrc,
        format: options.format,
      });

      console.log(`[${index + 1}/${rows.length}] Generated ${row.output_name}`);
    }

    const completed = index + 1;
    const shouldPause =
      options.waitSeconds > 0 &&
      options.batchSize > 0 &&
      completed < rows.length &&
      completed % options.batchSize === 0;

    if (shouldPause) {
      console.log(`Waiting ${options.waitSeconds}s before the next batch...`);
      await sleep(options.waitSeconds * 1000);
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Saved partial manifest: ${manifestPath}`);
  refreshManifest();
  console.log(`Generated ${generatedCount} new line files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
