import fs from "fs";
import path from "path";
import { PuterLineAudioGenerator, type VoicePromptRow } from "@/components/tools/puter-line-audio-generator";

function parseCsv(text: string) {
    const rows: string[][] = [];
    let row: string[] = [];
    let value = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        const next = text[index + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                value += '"';
                index += 1;
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
                index += 1;
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

function loadVoicePromptRows(): VoicePromptRow[] {
    const csvPath = path.join(process.cwd(), "docs", "voice-prompts.csv");
    const csvText = fs.readFileSync(csvPath, "utf8");
    const csvRows = parseCsv(csvText);
    const [header, ...dataRows] = csvRows;
    const index = Object.fromEntries(header.map((name, position) => [name, position]));

    return dataRows.map((row) => ({
        sceneOrder: row[index.scene_order] ?? "",
        sceneId: row[index.scene_id] ?? "",
        sceneTitle: row[index.scene_title] ?? "",
        fileName: row[index.mp3_name] ?? "",
        speaker: row[index.speaker] ?? "",
        emotion: row[index.emotion] ?? "",
        lineText: row[index.line_text] ?? "",
        ttsPrompt: row[index.tts_prompt] ?? "",
    }));
}

export default function PuterLineAudioPage() {
    const rows = loadVoicePromptRows();

    return <PuterLineAudioGenerator rows={rows} />;
}
