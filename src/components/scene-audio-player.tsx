"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "narraleaf-react";
import type { EndingId, ScenarioId } from "@/lib/persistents";

type LineAudioManifestEntry = {
    scene_id: ScenarioId;
    scene_title?: string;
    speaker: string;
    emotion?: string;
    voice?: string;
    text: string;
    src: string;
    format?: string;
};

type PromptPayload = {
    character?: {
        state?: {
            name?: string | null;
        };
    } | null;
    text?: string | null;
};

type SceneAudioPlayerProps = {
    currentScenario: ScenarioId;
    currentEnding: EndingId;
};

function normalizeText(value: string) {
    return value
        .replace(/\u2026/g, "...")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function normalizeSpeaker(value: string | null | undefined) {
    return (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function createSpeakerKey(sceneId: ScenarioId, speaker: string, text: string) {
    return `${sceneId}::${normalizeSpeaker(speaker)}::${normalizeText(text)}`;
}

function createTextKey(sceneId: ScenarioId, text: string) {
    return `${sceneId}::${normalizeText(text)}`;
}

export function SceneAudioPlayer({ currentScenario, currentEnding }: SceneAudioPlayerProps) {
    const game = useGame();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pendingEntryRef = useRef<LineAudioManifestEntry | null>(null);
    const lastPromptRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });
    const [manifest, setManifest] = useState<LineAudioManifestEntry[]>([]);
    const [manifestLoaded, setManifestLoaded] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);
    const [activeEntry, setActiveEntry] = useState<LineAudioManifestEntry | null>(null);

    const lookup = useMemo(() => {
        const bySpeaker = new Map<string, LineAudioManifestEntry>();
        const byText = new Map<string, LineAudioManifestEntry>();

        for (const entry of manifest) {
            bySpeaker.set(createSpeakerKey(entry.scene_id, entry.speaker, entry.text), entry);
            byText.set(createTextKey(entry.scene_id, entry.text), entry);
        }

        return { bySpeaker, byText };
    }, [manifest]);

    const sceneHasAudio = useMemo(
        () => manifest.some((entry) => entry.scene_id === currentScenario),
        [currentScenario, manifest],
    );

    useEffect(() => {
        let cancelled = false;

        async function loadManifest() {
            try {
                const response = await fetch("/asset/audio/lines/manifest.json", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error(`Manifest not found (${response.status})`);
                }

                const payload = (await response.json()) as LineAudioManifestEntry[];

                if (!cancelled) {
                    setManifest(Array.isArray(payload) ? payload : []);
                }
            } catch {
                if (!cancelled) {
                    setManifest([]);
                }
            } finally {
                if (!cancelled) {
                    setManifestLoaded(true);
                }
            }
        }

        void loadManifest();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        pendingEntryRef.current = null;
        lastPromptRef.current = { key: "", at: 0 };
        setAutoplayBlocked(false);
        setActiveEntry(null);
    }, [currentScenario, currentEnding]);

    useEffect(() => {
        if (!manifestLoaded) {
            return;
        }

        const liveGame = game.getLiveGame();
        const tokens = [
            liveGame.onCharacterPrompt((prompt: PromptPayload) => {
                if (currentEnding !== "none") {
                    return;
                }

                const text = prompt?.text?.trim();

                if (!text) {
                    return;
                }

                const speaker = prompt?.character?.state?.name ?? "";
                const dedupeKey = createSpeakerKey(currentScenario, speaker, text);
                const now = Date.now();

                if (lastPromptRef.current.key === dedupeKey && now - lastPromptRef.current.at < 250) {
                    return;
                }

                lastPromptRef.current = { key: dedupeKey, at: now };

                const matchedEntry =
                    lookup.bySpeaker.get(dedupeKey) ??
                    lookup.byText.get(createTextKey(currentScenario, text)) ??
                    null;

                if (!matchedEntry) {
                    return;
                }

                pendingEntryRef.current = matchedEntry;
                setActiveEntry(matchedEntry);
                void playEntry(matchedEntry);
            }),
            liveGame.onMenuChoose(() => {
                lastPromptRef.current = { key: "", at: 0 };
            }),
        ];

        return () => {
            tokens.forEach((token) => token.cancel());
        };
    }, [currentEnding, currentScenario, game, lookup, manifestLoaded]);

    async function playEntry(entry: LineAudioManifestEntry) {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();
        audio.src = entry.src;
        audio.currentTime = 0;
        audio.load();

        try {
            await audio.play();
            setAutoplayBlocked(false);
        } catch {
            setAutoplayBlocked(true);
        }
    }

    function resumePendingEntry() {
        if (!pendingEntryRef.current) {
            return;
        }

        void playEntry(pendingEntryRef.current);
    }

    return (
        <>
            <audio ref={audioRef} preload="auto" />
            {sceneHasAudio && autoplayBlocked && activeEntry ? (
                <div className="pointer-events-auto w-[min(280px,calc(100vw-2.5rem))] rounded-[24px] border border-white/14 bg-[linear-gradient(180deg,rgba(19,11,20,0.82),rgba(14,9,16,0.94))] px-4 py-3 text-white shadow-[0_18px_46px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/46">Voice Lines</div>
                    <div className="mt-1 text-[15px] font-semibold text-white">Tap to enable dialogue audio</div>
                    <div className="mt-1 text-[12px] text-white/62">
                        {activeEntry.speaker}
                        {activeEntry.emotion ? ` - ${activeEntry.emotion}` : ""}
                    </div>
                    <div className="mt-2 overflow-hidden text-[11px] leading-5 text-white/54">
                        {activeEntry.text}
                    </div>
                    <button
                        type="button"
                        onClick={resumePendingEntry}
                        className="mt-3 w-full rounded-full bg-white px-3 py-2 text-[12px] font-semibold text-[#311c28] transition-transform hover:scale-[1.01]"
                    >
                        Enable Voice
                    </button>
                </div>
            ) : null}
        </>
    );
}
