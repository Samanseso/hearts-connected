const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");

const scenarios = [
    {
        order: 1,
        id: "social-media-expectations",
        title: "Social Media Influence on Relationship Expectations",
        slug: "social_media",
        file: path.join(root, "src", "scenes", "scenarios", "social-media.ts"),
    },
    {
        order: 2,
        id: "online-jealousy",
        title: "Online Jealousy and Trust Issues",
        slug: "online_jealousy",
        file: path.join(root, "src", "scenes", "scenarios", "online-jealousy.ts"),
    },
    {
        order: 3,
        id: "peer-pressure",
        title: "Peer Pressure in Dating",
        slug: "peer_pressure",
        file: path.join(root, "src", "scenes", "scenarios", "peer-pressure.ts"),
    },
    {
        order: 4,
        id: "comparison-online",
        title: "Comparing Relationships Online",
        slug: "comparison_online",
        file: path.join(root, "src", "scenes", "scenarios", "comparison-online.ts"),
    },
    {
        order: 5,
        id: "commitment-decisions",
        title: "Commitment Decisions",
        slug: "commitment_decisions",
        file: path.join(root, "src", "scenes", "scenarios", "commitment-decisions.ts"),
    },
    {
        order: 6,
        id: "dating-norms",
        title: "Dating Norms and Mixed Signals",
        slug: "dating_norms",
        file: path.join(root, "src", "scenes", "scenarios", "dating-norms.ts"),
    },
    {
        order: 7,
        id: "digital-support",
        title: "Digital Availability and Emotional Support",
        slug: "digital_support",
        file: path.join(root, "src", "scenes", "scenarios", "digital-support.ts"),
    },
];

const speakerNames = {
    narra: "Narra",
    alex: "Alex",
    jamie: "Jamie",
    riley: "Riley",
    chris: "Chris",
    sam: "Sam",
    taylor: "Taylor",
    jordan: "Jordan",
    reese: "Reese",
    casey: "Casey",
    morgan: "Morgan",
    dana: "Dana",
    nico: "Nico",
    lea: "Lea",
    micah: "Micah",
};

const voiceProfiles = {
    Narration: "Narration voice: gentle omniscient storyteller, warm and cinematic, clear diction, intimate visual-novel pacing",
    Narra: "Narra voice: reflective narrator, calm and compassionate, light academic warmth, measured and emotionally observant",
    Friend1: "Friend 1 voice: young college-age voice, playful and teasing, light social pressure, lively group-chat energy",
    Friend2: "Friend 2 voice: young college-age voice, bolder and more direct than Friend 1, teasing but not cruel",
    Alex: "Alex voice: player-character young adult voice, introspective and idealistic, emotionally porous, natural conversational pacing",
    Jamie: "Jamie voice: warm grounded young adult voice, affectionate, understated, emotionally steady",
    Riley: "Riley voice: sensitive young adult voice, anxious and thoughtful, prone to spiraling but sincere",
    Chris: "Chris voice: friendly social young adult voice, expressive, reactive, capable of reassurance and defensiveness",
    Sam: "Sam voice: independent young adult voice, dry wit under pressure, thoughtful and quietly stubborn",
    Taylor: "Taylor voice: kind low-key young adult female voice, respectful, calm, emotionally literate",
    Jordan: "Jordan voice: reflective young adult voice, self-aware, comparison-prone, quietly vulnerable",
    Reese: "Reese voice: grounded reassuring young adult voice, steady, practical, emotionally secure",
    Casey: "Casey voice: cautious sincere young adult female voice, careful with words, afraid of overpromising but deeply caring",
    Morgan: "Morgan voice: direct emotionally literate young adult voice, patient, future-facing, honest",
    Dana: "Dana voice: socially aware young adult voice, warm but guarded, careful around ambiguity",
    Nico: "Nico voice: affectionate easygoing young adult voice, soft-spoken, flexible, conflict-averse",
    Lea: "Lea voice: expressive emotionally intense young adult voice, tender, stressed, quick to feel silence personally",
    Micah: "Micah voice: caring but stretched-thin young adult voice, supportive, composed, imperfectly responsive",
};

const emotionStyles = {
    reflective: "measured, intimate, observant, narration-like calm",
    observational: "clear descriptive narration, grounded and cinematic",
    insecure: "quiet vulnerability, small hesitations, emotionally exposed without melodrama",
    concerned: "gentle concern, attentive and caring",
    warm: "gentle warmth, easy affection, soft smile in the voice",
    steady: "natural, grounded, emotionally even and conversational",
    sharp: "controlled irritation with a cutting edge, not shouted",
    firm: "clear boundaries, calm and steady, no yelling",
    hurt: "emotionally stung, soft but unmistakably hurt",
    honest: "sincere, vulnerable, steady eye contact energy",
    "open-hearted": "warmly open, relieved, gently hopeful",
    bittersweet: "soft sadness mixed with acceptance and tenderness",
    vulnerable: "openly exposed, careful, trying to stay brave while speaking",
    withdrawn: "quieter, more inward, hesitant to need too much",
    reassuring: "calm, grounding, emotionally safe, quietly supportive",
    apologetic: "remorseful, trying to repair, gentle self-awareness",
    angry: "tense, reactive, emotionally charged without losing clarity",
    confused: "caught off guard, trying to understand in real time",
    friendly: "easygoing, open, socially warm",
    defensive: "guarded, frustrated, trying not to escalate further",
    anxious: "tight breath, quick thoughts, emotional tension under the words",
    calm: "low-pressure, relaxed, emotionally readable",
    questioning: "curious or uncertain, naturally rising at the end",
    stressed: "emotionally overloaded, tender, trying to stay composed",
    composed: "supportive, calm under pressure, gently tired",
    playful: "light teasing, social energy, upbeat without being cartoonish",
    direct: "clear, pointed, socially bold but not cruel",
};

const speakerDefaults = {
    Narration: "reflective",
    Narra: "reflective",
    Friend1: "playful",
    Friend2: "direct",
    Alex: "reflective",
    Jamie: "warm",
    Riley: "anxious",
    Chris: "friendly",
    Sam: "reflective",
    Taylor: "calm",
    Jordan: "reflective",
    Reese: "reassuring",
    Casey: "reflective",
    Morgan: "direct",
    Dana: "questioning",
    Nico: "calm",
    Lea: "stressed",
    Micah: "composed",
};

const expressionToEmotion = {
    insecure: "insecure",
    concern: "concerned",
    warm: "warm",
    neutral: "steady",
    sharp: "sharp",
    boundary: "firm",
    hurt: "hurt",
    honest: "honest",
    open: "open-hearted",
    sad: "hurt",
    bittersweet: "bittersweet",
    vulnerable: "vulnerable",
    retreat: "withdrawn",
    reassuring: "reassuring",
    repair: "apologetic",
    angry: "angry",
    confused: "confused",
    friendly: "friendly",
    defensive: "defensive",
};

function csvEscape(value) {
    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

function slugifySpeaker(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function pad(num, size) {
    return String(num).padStart(size, "0");
}

function parseQuotedLine(trimmed) {
    const candidate = trimmed.replace(/,$/, "");
    if (!candidate.startsWith('"')) {
        return null;
    }

    try {
        return JSON.parse(candidate);
    } catch {
        return null;
    }
}

function emotionForSpeaker(speaker, currentEmotionMap) {
    return currentEmotionMap[speaker] || speakerDefaults[speaker] || "steady";
}

function buildPrompt(speaker, emotion, lineText) {
    const profile = voiceProfiles[speaker] || `${speaker} voice: grounded young adult voice, natural conversational pacing`;
    const delivery = emotionStyles[emotion] || emotionStyles.steady;
    const escapedLine = lineText.replace(/"/g, '""');
    return `${profile}. Emotion: ${emotion}. Delivery: ${delivery}. Clean studio recording, no background music, no sound effects. Speak exactly: "${escapedLine}"`;
}

function inferNarrationEmotion(text) {
    if (/^Unlocked:|^Locked:/.test(text)) {
        return "observational";
    }

    return "reflective";
}

function parseScenario(scenario) {
    const content = fs.readFileSync(scenario.file, "utf8");
    const lines = content.split(/\r?\n/);
    const rows = [];
    const currentEmotionMap = {};
    let pendingNarrationField = null;
    let insideFadeIn = false;
    let counter = 0;

    const pushRow = (speaker, emotion, lineText) => {
        counter += 1;
        rows.push({
            scene_order: scenario.order,
            scene_id: scenario.id,
            scene_title: scenario.title,
            mp3_name: `s${pad(scenario.order, 2)}_${scenario.slug}_${pad(counter, 3)}_${slugifySpeaker(speaker)}_${emotion}.mp3`,
            speaker,
            emotion,
            line_text: lineText,
            tts_prompt: buildPrompt(speaker, emotion, lineText),
        });
    };

    for (const rawLine of lines) {
        const trimmed = rawLine.trim();

        if (trimmed.includes("new FadeIn(")) {
            insideFadeIn = true;
        }

        if (insideFadeIn && trimmed === ");") {
            insideFadeIn = false;
            continue;
        }

        if (!trimmed) {
            continue;
        }

        const lookMatch = trimmed.match(/^([a-z][a-zA-Z0-9_]*)Look\("([^"]+)"\),?$/);
        if (lookMatch) {
            const speakerKey = lookMatch[1];
            const speakerName = speakerNames[speakerKey];
            if (speakerName) {
                currentEmotionMap[speakerName] = expressionToEmotion[lookMatch[2]] || speakerDefaults[speakerName] || "steady";
            }
            continue;
        }

        if (pendingNarrationField) {
            const pendingText = parseQuotedLine(trimmed);
            if (pendingText !== null) {
                pushRow("Narration", inferNarrationEmotion(pendingText), pendingText);
                pendingNarrationField = null;
                continue;
            }
        }

        const inlineNarrationMatch = trimmed.match(/^(endingMessage|endingLesson):\s*("(?:[^"\\]|\\.)+"),?$/);
        if (inlineNarrationMatch) {
            const text = JSON.parse(inlineNarrationMatch[2]);
            pushRow("Narration", inferNarrationEmotion(text), text);
            continue;
        }

        if (/^(endingMessage|endingLesson):\s*$/.test(trimmed)) {
            pendingNarrationField = true;
            continue;
        }

        if (/^endingQuote:/.test(trimmed) || /^endingTitle:/.test(trimmed) || /^endingId:/.test(trimmed)) {
            continue;
        }

        const dialogueMatch = trimmed.match(/^([a-z][a-zA-Z0-9_]*)(?:\.say)?`([^`]+)`,?$/);
        if (dialogueMatch) {
            const speakerKey = dialogueMatch[1];
            const text = dialogueMatch[2];

            if (text.includes("${")) {
                continue;
            }

            if (speakerKey === "narra") {
                if (text.startsWith("Friend 1: ")) {
                    pushRow("Friend1", "playful", text.slice("Friend 1: ".length));
                } else if (text.startsWith("Friend 2: ")) {
                    pushRow("Friend2", "direct", text.slice("Friend 2: ".length));
                } else {
                    pushRow("Narra", emotionForSpeaker("Narra", currentEmotionMap), text);
                }
                continue;
            }

            const speaker = speakerNames[speakerKey];
            if (!speaker) {
                continue;
            }

            pushRow(speaker, emotionForSpeaker(speaker, currentEmotionMap), text);
            continue;
        }

        if (insideFadeIn) {
            continue;
        }

        const narrationText = parseQuotedLine(trimmed);
        if (narrationText !== null) {
            pushRow("Narration", "observational", narrationText);
        }
    }

    return rows;
}

const allRows = scenarios.flatMap(parseScenario);
const csvHeader = [
    "scene_order",
    "scene_id",
    "scene_title",
    "mp3_name",
    "speaker",
    "emotion",
    "line_text",
    "tts_prompt",
];
const csvLines = [csvHeader.join(",")];
for (const row of allRows) {
    csvLines.push([
        row.scene_order,
        row.scene_id,
        row.scene_title,
        row.mp3_name,
        row.speaker,
        row.emotion,
        row.line_text,
        row.tts_prompt,
    ].map(csvEscape).join(","));
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, "voice-prompts.csv"), `${csvLines.join("\n")}\n`, "utf8");

const mdLines = [
    "# Beyond the Screen Voice Prompt Pack",
    "",
    "This pack covers all branching spoken route dialogue and narration across the seven playable story scenes.",
    "",
    "## Naming Pattern",
    "",
    "`s##_scene_slug_###_speaker_emotion.mp3`",
    "",
    "Example: `s01_social_media_008_alex_sharp.mp3`",
    "",
    "## Global Generation Rules",
    "",
    "- Keep audio dry and clean: no music, ambience, reverb, or sound effects.",
    "- Use natural conversational pacing suited for a visual novel.",
    "- Keep characters college-age / young adult unless the line is narration.",
    "- Do not paraphrase; speak the line exactly as written in the CSV.",
    "- Keep emotional delivery grounded and human, not theatrical.",
    "- Menu labels, HUD text, and other non-spoken system text are intentionally excluded.",
    "",
    "## Voice Profiles",
    "",
    "- Narration: " + voiceProfiles.Narration,
    "- Narra: " + voiceProfiles.Narra,
    "- Friend1: " + voiceProfiles.Friend1,
    "- Friend2: " + voiceProfiles.Friend2,
    "- Alex: " + voiceProfiles.Alex,
    "- Jamie: " + voiceProfiles.Jamie,
    "- Riley: " + voiceProfiles.Riley,
    "- Chris: " + voiceProfiles.Chris,
    "- Sam: " + voiceProfiles.Sam,
    "- Taylor: " + voiceProfiles.Taylor,
    "- Jordan: " + voiceProfiles.Jordan,
    "- Reese: " + voiceProfiles.Reese,
    "- Casey: " + voiceProfiles.Casey,
    "- Morgan: " + voiceProfiles.Morgan,
    "- Dana: " + voiceProfiles.Dana,
    "- Nico: " + voiceProfiles.Nico,
    "- Lea: " + voiceProfiles.Lea,
    "- Micah: " + voiceProfiles.Micah,
    "",
    "## Files",
    "",
    "- Full prompt sheet: [voice-prompts.csv](./voice-prompts.csv)",
    `- Total generated prompt rows: ${allRows.length}`,
];

fs.writeFileSync(path.join(docsDir, "voice-prompts.md"), `${mdLines.join("\n")}\n`, "utf8");

console.log(`Generated ${allRows.length} voice prompt rows.`);

