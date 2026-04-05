const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
const voiceCsvPath = path.join(docsDir, "voice-prompts.csv");
const sceneOutputPath = path.join(docsDir, "scene-podcast-prompts.md");
const narratorOutputPath = path.join(docsDir, "narrator-podcast-prompts.md");

const specialSpeakers = new Set(["Narration", "Narra", "Friend1", "Friend2"]);

const voiceProfiles = {
    Narration: "gentle omniscient storyteller, warm and cinematic, clear diction, intimate visual-novel pacing",
    Narra: "reflective narrator, calm and compassionate, light academic warmth, measured and emotionally observant",
    Friend1: "young college-age voice, playful and teasing, light social pressure, lively group-chat energy",
    Friend2: "young college-age voice, bolder and more direct than Friend 1, teasing but not cruel",
    Alex: "player-character young adult voice, introspective and idealistic, emotionally porous, natural conversational pacing",
    Jamie: "warm grounded young adult voice, affectionate, understated, emotionally steady",
    Riley: "sensitive young adult voice, anxious and thoughtful, prone to spiraling but sincere",
    Chris: "friendly social young adult voice, expressive, reactive, capable of reassurance and defensiveness",
    Sam: "independent young adult voice, dry wit under pressure, thoughtful and quietly stubborn",
    Taylor: "kind low-key young adult female voice, respectful, calm, emotionally literate",
    Jordan: "reflective young adult voice, self-aware, comparison-prone, quietly vulnerable",
    Reese: "grounded reassuring young adult voice, steady, practical, emotionally secure",
    Casey: "cautious sincere young adult female voice, careful with words, afraid of overpromising but deeply caring",
    Morgan: "direct emotionally literate young adult voice, patient, future-facing, honest",
    Dana: "socially aware young adult voice, warm but guarded, careful around ambiguity",
    Nico: "affectionate easygoing young adult voice, soft-spoken, flexible, conflict-averse",
    Lea: "expressive emotionally intense young adult voice, tender, stressed, quick to feel silence personally",
    Micah: "caring but stretched-thin young adult voice, supportive, composed, imperfectly responsive",
};

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

function buildCastLines(speakers) {
    return speakers
        .map((speaker) => `- ${speaker}: ${voiceProfiles[speaker] || "grounded young adult voice with clear character separation"}`)
        .join("\n");
}

function choosePrimarySpeakers(rows) {
    const counts = new Map();
    const firstIndex = new Map();

    rows.forEach((row, index) => {
        if (specialSpeakers.has(row.speaker)) {
            return;
        }

        counts.set(row.speaker, (counts.get(row.speaker) || 0) + 1);
        if (!firstIndex.has(row.speaker)) {
            firstIndex.set(row.speaker, index);
        }
    });

    return Array.from(counts.entries())
        .sort((a, b) => {
            if (b[1] !== a[1]) {
                return b[1] - a[1];
            }
            return (firstIndex.get(a[0]) || 0) - (firstIndex.get(b[0]) || 0);
        })
        .slice(0, 2)
        .map(([speaker]) => speaker);
}

function buildDialoguePrompt(scene) {
    const castLines = buildCastLines(scene.primarySpeakers);
    const transcript = scene.dialogueRows
        .map((row) => `${row.speaker} [${row.emotion}]: ${row.line_text}`)
        .join("\n");

    return [
        `Create one long-form two-voice scene podcast for "Beyond the Screen" scene ${scene.scene_order}: ${scene.scene_title}.`,
        `Output filename: ${scene.sceneMp3}`,
        "Format: single MP3 file for this scene using only the two main character voices.",
        "Audio style: clean studio audio only, no music, no ambience, no reverb, no sound effects.",
        "Performance style: grounded visual-novel acting, emotionally clear but never exaggerated.",
        `Allowed voices in this file: ${scene.primarySpeakers.join(" and ")}.`,
        "Important: do not add narrator lines, crowd voices, or support voices here. Those live in the separate narrator companion file.",
        "Branch handling: keep the shared opening first, then continue through the alternate later dialogue in source order so this single file still covers the full scene.",
        "Important: do not paraphrase the spoken lines below. Read the dialogue exactly as written.",
        "",
        "Cast voices:",
        castLines,
        "",
        "Dialogue script:",
        transcript,
    ].join("\n");
}

function buildNarratorPrompt(scenes) {
    const supportSpeakers = Array.from(
        new Set(
            scenes.flatMap((scene) => scene.supportRows.map((row) => row.speaker)),
        ),
    );

    const castLines = buildCastLines(supportSpeakers);
    const scriptSections = scenes.map((scene) => {
        const lines = scene.supportRows
            .map((row) => `${row.speaker} [${row.emotion}]: ${row.line_text}`)
            .join("\n");

        return [
            `Scene ${scene.scene_order}: ${scene.scene_title}`,
            lines,
        ].join("\n");
    });

    return [
        'Create one long-form narrator companion audio file for "Beyond the Screen" that collects all narration, reflective commentary, and any support voices removed from the two-voice scene files.',
        'Output filename: beyond_the_screen_narrator_companion.mp3',
        'Format: single MP3 file covering the full project narrator/support track.',
        'Audio style: clean studio audio only, no music, no ambience, no reverb, no sound effects.',
        'Performance style: grounded, clear, emotionally readable, and easy to layer beside the two-voice scene files.',
        'Important: the two-character scene MP3s should stay limited to the main pair, so this companion file carries Narration, Narra, and any extra support/crowd voices such as Friend1 and Friend2.',
        'Important: do not paraphrase the spoken lines below. Read the dialogue exactly as written.',
        '',
        'Cast voices:',
        castLines,
        '',
        'Narrator/support script:',
        scriptSections.join("\n\n"),
    ].join("\n");
}

if (!fs.existsSync(voiceCsvPath)) {
    console.error("Missing docs/voice-prompts.csv. Run generate:voices first.");
    process.exit(1);
}

const csvRows = parseCsv(fs.readFileSync(voiceCsvPath, "utf8"));
const [header, ...dataRows] = csvRows;
const headerMap = Object.fromEntries(header.map((name, index) => [name, index]));
const scenes = [];

for (const row of dataRows) {
    const sceneId = row[headerMap.scene_id];
    const normalizedRow = {
        scene_order: row[headerMap.scene_order],
        scene_id: sceneId,
        scene_title: row[headerMap.scene_title],
        speaker: row[headerMap.speaker],
        emotion: row[headerMap.emotion],
        line_text: row[headerMap.line_text],
    };

    const existing = scenes.find((scene) => scene.scene_id === sceneId);
    if (existing) {
        existing.rows.push(normalizedRow);
        continue;
    }

    scenes.push({
        scene_order: row[headerMap.scene_order],
        scene_id: sceneId,
        scene_title: row[headerMap.scene_title],
        rows: [normalizedRow],
    });
}

for (const scene of scenes) {
    scene.primarySpeakers = choosePrimarySpeakers(scene.rows);
    scene.dialogueRows = scene.rows.filter((row) => scene.primarySpeakers.includes(row.speaker));
    scene.supportRows = scene.rows.filter((row) => !scene.primarySpeakers.includes(row.speaker));
    scene.sceneMp3 = `s${String(scene.scene_order).padStart(2, "0")}_${scene.scene_id.replace(/-/g, "_")}_duo.mp3`;
}

const sceneMdLines = [
    "# Beyond the Screen Scene Podcast Prompts",
    "",
    "These prompts are designed for generating one two-voice audio file per scene, with narration and support voices moved into a separate companion file.",
    "",
    "## Naming Pattern",
    "",
    "`s##_scene_slug_duo.mp3`",
    "",
    "Example: `s05_commitment_decisions_duo.mp3`",
    "",
    "## Global Notes",
    "",
    "- Each scene prompt creates one single MP3 using only the two main character voices for that route.",
    "- Narration, reflective commentary, and extra support voices are moved out into `narrator-podcast-prompts.md`.",
    "- Because the scenes branch, each duo file still keeps alternate dialogue in source order so you can cover the full route in one file.",
    "",
];

for (const scene of scenes) {
    sceneMdLines.push(`## Scene ${scene.scene_order}: ${scene.scene_title}`);
    sceneMdLines.push("");
    sceneMdLines.push(`Filename: \`${scene.sceneMp3}\``);
    sceneMdLines.push("");
    sceneMdLines.push(`Main voices: ${scene.primarySpeakers.join(" and ")}`);
    sceneMdLines.push("");
    sceneMdLines.push("```text");
    sceneMdLines.push(buildDialoguePrompt(scene));
    sceneMdLines.push("```");
    sceneMdLines.push("");
}

const narratorMdLines = [
    "# Beyond the Screen Narrator Podcast Prompt",
    "",
    "This prompt generates the separate narrator/support track so each scene MP3 can stay limited to two main character voices.",
    "",
    "## Naming Pattern",
    "",
    "`beyond_the_screen_narrator_companion.mp3`",
    "",
    "## Notes",
    "",
    "- This file carries Narration, Narra, and any support or crowd voices moved out of the scene duo files.",
    "- It is designed to complement the two-voice scene MP3s rather than replace them.",
    "",
    "```text",
    buildNarratorPrompt(scenes),
    "```",
    "",
];

fs.writeFileSync(sceneOutputPath, `${sceneMdLines.join("\n")}\n`, "utf8");
fs.writeFileSync(narratorOutputPath, `${narratorMdLines.join("\n")}\n`, "utf8");
console.log(`Generated ${scenes.length} scene duo prompts and 1 narrator companion prompt.`);