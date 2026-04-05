"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

export type VoicePromptRow = {
    sceneOrder: string;
    sceneId: string;
    sceneTitle: string;
    fileName: string;
    speaker: string;
    emotion: string;
    lineText: string;
    ttsPrompt: string;
};

type PuterAudioOptions = {
    provider: "openai";
    model: string;
    voice: string;
    response_format: "mp3" | "wav" | "opus" | "aac" | "flac" | "pcm";
    instructions: string;
};

type PuterApi = {
    ai: {
        txt2speech: (text: string, options: PuterAudioOptions) => Promise<HTMLAudioElement>;
    };
};

type FileWriterLike = {
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
};

type FileHandleLike = {
    createWritable: () => Promise<FileWriterLike>;
};

type PermissionMode = "read" | "readwrite";
type PermissionStateLike = "granted" | "denied" | "prompt";

type DirectoryHandleLike = {
    getDirectoryHandle: (name: string, options?: { create?: boolean }) => Promise<DirectoryHandleLike>;
    getFileHandle: (name: string, options?: { create?: boolean }) => Promise<FileHandleLike>;
    queryPermission?: (options?: { mode?: PermissionMode }) => Promise<PermissionStateLike>;
    requestPermission?: (options?: { mode?: PermissionMode }) => Promise<PermissionStateLike>;
};

declare global {
    interface Window {
        puter?: PuterApi;
        showDirectoryPicker?: () => Promise<DirectoryHandleLike>;
    }
}

const DEFAULT_BATCH_SIZE = 3;
const DEFAULT_WAIT_SECONDS = 60;
const DEFAULT_MODEL = "gpt-4o-mini-tts";

const voiceBySpeaker: Record<string, PuterAudioOptions["voice"]> = {
    Narration: "onyx",
    Narra: "sage",
    Friend1: "fable",
    Friend2: "echo",
    Alex: "ash",
    Jamie: "nova",
    Riley: "coral",
    Chris: "echo",
    Sam: "alloy",
    Taylor: "nova",
    Jordan: "shimmer",
    Reese: "sage",
    Casey: "nova",
    Morgan: "onyx",
    Dana: "coral",
    Nico: "alloy",
    Lea: "nova",
    Micah: "onyx",
};

function sanitizeFolderName(value: string) {
    return value.replace(/[^a-z0-9-]+/gi, "_");
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

async function ensureWritableDirectory(
    handle: DirectoryHandleLike,
    sceneIds: string[],
) {
    if (typeof handle.queryPermission === "function") {
        const currentState = await handle.queryPermission({ mode: "readwrite" });

        if (currentState !== "granted") {
            const nextState = typeof handle.requestPermission === "function"
                ? await handle.requestPermission({ mode: "readwrite" })
                : currentState;

            if (nextState !== "granted") {
                throw new Error("Write access was not granted for the selected folder.");
            }
        }
    }

    for (const sceneId of sceneIds) {
        await handle.getDirectoryHandle(sanitizeFolderName(sceneId), { create: true });
    }
}

function extractInstructions(ttsPrompt: string) {
    const marker = "Speak exactly:";
    const markerIndex = ttsPrompt.indexOf(marker);

    if (markerIndex === -1) {
        return ttsPrompt.trim();
    }

    return ttsPrompt.slice(0, markerIndex).trim().replace(/\s+$/g, "");
}

async function saveBlobToDirectory(
    rootDirectory: DirectoryHandleLike,
    sceneId: string,
    fileName: string,
    blob: Blob,
) {
    const sceneDirectory = await rootDirectory.getDirectoryHandle(sanitizeFolderName(sceneId), {
        create: true,
    });
    const fileHandle = await sceneDirectory.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
}

async function downloadBlob(fileName: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

export function PuterLineAudioGenerator({ rows }: { rows: VoicePromptRow[] }) {
    const [selectedScene, setSelectedScene] = useState("social-media-expectations");
    const [batchSize, setBatchSize] = useState(DEFAULT_BATCH_SIZE);
    const [startAt, setStartAt] = useState(1);
    const [waitSeconds, setWaitSeconds] = useState(DEFAULT_WAIT_SECONDS);
    const [format, setFormat] = useState<PuterAudioOptions["response_format"]>("mp3");
    const [directoryStatus, setDirectoryStatus] = useState("No output folder selected yet.");
    const [scriptReady, setScriptReady] = useState(false);
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState("Idle");
    const [logs, setLogs] = useState<string[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const directoryRef = useRef<DirectoryHandleLike | null>(null);
    const cancelRef = useRef(false);

    const scenes = useMemo(() => {
        const unique = new Map<string, string>();

        for (const row of rows) {
            if (!unique.has(row.sceneId)) {
                unique.set(row.sceneId, row.sceneTitle);
            }
        }

        return [...unique.entries()].map(([sceneId, sceneTitle]) => ({ sceneId, sceneTitle }));
    }, [rows]);

    const filteredRows = useMemo(() => {
        if (selectedScene === "all") {
            return rows;
        }

        return rows.filter((row) => row.sceneId === selectedScene);
    }, [rows, selectedScene]);

    const queuedRows = useMemo(() => {
        const safeStartAt = Math.max(1, startAt);
        return filteredRows.slice(safeStartAt - 1);
    }, [filteredRows, startAt]);

    const selectedSceneIds = useMemo(() => {
        if (selectedScene === "all") {
            return [...new Set(rows.map((row) => row.sceneId))];
        }

        return [selectedScene];
    }, [rows, selectedScene]);

    useEffect(() => {
        setStartAt(1);
    }, [selectedScene]);

    useEffect(() => {
        return () => {
            cancelRef.current = true;
        };
    }, []);

    function pushLog(message: string) {
        setLogs((current) => [`${new Date().toLocaleTimeString()}  ${message}`, ...current].slice(0, 16));
    }

    async function chooseDirectory() {
        if (!window.showDirectoryPicker) {
            setDirectoryStatus("This browser does not support folder picking. The tool will fall back to downloads.");
            return;
        }

        try {
            const handle = await window.showDirectoryPicker();
            await ensureWritableDirectory(handle, selectedSceneIds);
            directoryRef.current = handle;
            setDirectoryStatus("Output folder selected and write access granted. Files will be written into scene subfolders.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Folder selection was cancelled.";
            setDirectoryStatus(message);
        }
    }

    async function generateSingleRow(row: VoicePromptRow, index: number, total: number) {
        const puter = window.puter;

        if (!puter?.ai?.txt2speech) {
            throw new Error("Puter script is not ready yet.");
        }

        const instructions = extractInstructions(row.ttsPrompt);
        const voice = voiceBySpeaker[row.speaker] ?? "alloy";

        setProgress(`Generating ${index}/${total}: ${row.fileName}`);
        pushLog(`Generating ${row.fileName} with ${row.speaker} / ${voice}`);

        const audio = await puter.ai.txt2speech(row.lineText, {
            provider: "openai",
            model: DEFAULT_MODEL,
            voice,
            response_format: format,
            instructions,
        });

        const response = await fetch(audio.src);
        const blob = await response.blob();
        const fileName = row.fileName.replace(/\.mp3$/i, `.${format}`);

        if (directoryRef.current) {
            await saveBlobToDirectory(directoryRef.current, row.sceneId, fileName, blob);
        } else {
            await downloadBlob(fileName, blob);
        }

        setCompletedCount((current) => current + 1);
        pushLog(`Saved ${fileName}`);
    }

    async function startGeneration() {
        if (running) {
            return;
        }

        if (!scriptReady) {
            pushLog("Puter script has not loaded yet.");
            return;
        }

        if (!queuedRows.length) {
            pushLog("No lines found for the selected scene and start position.");
            return;
        }

        cancelRef.current = false;
        setRunning(true);
        setCompletedCount(0);
        setLogs([]);
        pushLog(`Starting from line ${startAt} with ${queuedRows.length} queued lines.`);

        try {
            if (directoryRef.current) {
                await ensureWritableDirectory(directoryRef.current, selectedSceneIds);
                setDirectoryStatus("Output folder is writable. Batch generation is running.");
            }
            for (let start = 0; start < queuedRows.length; start += batchSize) {
                if (cancelRef.current) {
                    break;
                }

                const batch = queuedRows.slice(start, start + batchSize);

                for (let batchIndex = 0; batchIndex < batch.length; batchIndex += 1) {
                    if (cancelRef.current) {
                        break;
                    }

                    await generateSingleRow(batch[batchIndex], start + batchIndex + 1, queuedRows.length);
                }

                const remaining = queuedRows.length - (start + batch.length);

                if (cancelRef.current || remaining <= 0) {
                    break;
                }

                for (let seconds = waitSeconds; seconds > 0; seconds -= 1) {
                    if (cancelRef.current) {
                        break;
                    }

                    setProgress(`Waiting ${seconds}s before the next batch of ${Math.min(batchSize, remaining)} lines...`);
                    await sleep(1000);
                }
            }

            setProgress(cancelRef.current ? "Stopped." : "Done.");
            pushLog(cancelRef.current ? "Generation stopped." : "Generation finished.");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setProgress(`Error: ${message}`);
            pushLog(`Error: ${message}`);
        } finally {
            setRunning(false);
        }
    }

    function stopGeneration() {
        cancelRef.current = true;
    }

    return (
        <>
            <Script
                src="https://js.puter.com/v2/"
                strategy="afterInteractive"
                onLoad={() => {
                    setScriptReady(true);
                    pushLog("Puter script loaded.");
                }}
            />

            <main className="min-h-screen bg-[linear-gradient(180deg,#09070c,#140d17)] px-6 py-10 text-white">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                    <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Puter Voice Tool</p>
                        <h1 className="text-3xl font-semibold">Generate line audio in paced batches</h1>
                        <p className="max-w-3xl text-sm leading-6 text-white/68">
                            This tool uses Puter.js in the browser, so you do not need a Gemini API token. It
                            generates dialogue one line at a time, defaults to batches of 3, then waits 60 seconds
                            before continuing.
                        </p>
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 md:grid-cols-2 xl:grid-cols-5">
                        <label className="flex flex-col gap-2 text-sm text-white/72">
                            Scene
                            <select
                                value={selectedScene}
                                onChange={(event) => setSelectedScene(event.target.value)}
                                className="rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                            >
                                <option value="all">All scenes</option>
                                {scenes.map((scene) => (
                                    <option key={scene.sceneId} value={scene.sceneId}>
                                        {scene.sceneTitle}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/72">
                            Start At Line
                            <input
                                type="number"
                                min={1}
                                max={Math.max(1, filteredRows.length)}
                                value={startAt}
                                onChange={(event) => setStartAt(Math.max(1, Number(event.target.value) || 1))}
                                className="rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/72">
                            Batch Size
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={batchSize}
                                onChange={(event) => setBatchSize(Math.max(1, Number(event.target.value) || 1))}
                                className="rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/72">
                            Wait Between Batches
                            <input
                                type="number"
                                min={0}
                                value={waitSeconds}
                                onChange={(event) => setWaitSeconds(Math.max(0, Number(event.target.value) || 0))}
                                className="rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-white/72">
                            Format
                            <select
                                value={format}
                                onChange={(event) => setFormat(event.target.value as PuterAudioOptions["response_format"])}
                                className="rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white outline-none"
                            >
                                <option value="mp3">mp3</option>
                                <option value="wav">wav</option>
                                <option value="opus">opus</option>
                                <option value="aac">aac</option>
                                <option value="flac">flac</option>
                                <option value="pcm">pcm</option>
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 lg:grid-cols-[1.4fr_0.9fr]">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={chooseDirectory}
                                    className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/8"
                                >
                                    Choose Output Folder
                                </button>
                                <button
                                    type="button"
                                    onClick={startGeneration}
                                    disabled={running || !scriptReady}
                                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#241724] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {running ? "Generating..." : "Start Batch Generation"}
                                </button>
                                <button
                                    type="button"
                                    onClick={stopGeneration}
                                    disabled={!running}
                                    className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Stop
                                </button>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/70">
                                <div>{directoryStatus}</div>
                                <div>Puter loaded: {scriptReady ? "yes" : "waiting..."}</div>
                                <div>Selected lines in scene: {filteredRows.length}</div>
                                <div>Starting from line: {startAt}</div>
                                <div>Queued this run: {queuedRows.length}</div>
                                <div>Completed this run: {completedCount}</div>
                                <div>Status: {progress}</div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/70">
                                Pick your project folder at `public/asset/audio/lines` if you want the files written
                                directly into the game. `Start At Line` is relative to the currently selected scene,
                                so for Scene 4 line 34 you can choose `Comparing Relationships Online` and set the
                                field to `34`. The tool asks for write access before the batch starts, so later timed
                                saves do not trigger the browser activation error. If folder access is unavailable, it
                                falls back to normal browser downloads.
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                            <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/45">Recent Log</div>
                            <div className="max-h-[340px] space-y-2 overflow-auto text-sm leading-6 text-white/70">
                                {logs.length ? (
                                    logs.map((entry) => <div key={entry}>{entry}</div>)
                                ) : (
                                    <div>No activity yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
