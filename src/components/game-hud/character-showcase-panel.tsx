"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CHARACTER_SHOWCASES } from "@/lib/character-showcase-data";
import { SCENARIO_META } from "@/lib/game-data";
import type { PersisData, ScenarioId } from "@/lib/persistents";

type LineAudioManifestEntry = {
    scene_id: ScenarioId;
    speaker: string;
    emotion?: string;
    text: string;
    src: string;
};

type CharacterShowcasePanelProps = {
    persis: PersisData;
};

function normalizeSpeaker(value: string) {
    return value.trim().toLowerCase();
}

function buildVoiceLabel(text: string) {
    if (text.length <= 58) {
        return text;
    }

    return text.slice(0, 55).trimEnd() + "...";
}

export function CharacterShowcasePanel({ persis }: CharacterShowcasePanelProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [manifest, setManifest] = useState<LineAudioManifestEntry[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState(CHARACTER_SHOWCASES[0]?.id ?? "");
    const [selectedCharacterName, setSelectedCharacterName] = useState("");
    const [selectedExpressionId, setSelectedExpressionId] = useState("");
    const [playingSrc, setPlayingSrc] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadManifest() {
            try {
                const response = await fetch("/asset/audio/lines/manifest.json", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error("Missing manifest");
                }

                const payload = (await response.json()) as LineAudioManifestEntry[];

                if (!cancelled) {
                    setManifest(Array.isArray(payload) ? payload : []);
                }
            } catch {
                if (!cancelled) {
                    setManifest([]);
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

        const handleEnded = () => setPlayingSrc(null);
        const handlePause = () => {
            setPlayingSrc(null);
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("pause", handlePause);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("pause", handlePause);
        };
    }, []);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    const selectedGroup = useMemo(
        () => CHARACTER_SHOWCASES.find((group) => group.id === selectedGroupId) ?? CHARACTER_SHOWCASES[0],
        [selectedGroupId],
    );

    useEffect(() => {
        if (!selectedGroup) {
            return;
        }

        const nextCharacter = selectedGroup.characters.find((character) => character.name === selectedCharacterName)
            ? selectedCharacterName
            : selectedGroup.characters[0]?.name ?? "";

        setSelectedCharacterName(nextCharacter);
    }, [selectedCharacterName, selectedGroup]);

    const selectedCharacter = useMemo(
        () => selectedGroup?.characters.find((character) => character.name === selectedCharacterName) ?? selectedGroup?.characters[0],
        [selectedCharacterName, selectedGroup],
    );

    useEffect(() => {
        if (!selectedCharacter) {
            return;
        }

        const nextExpression = selectedCharacter.expressions.find((expression) => expression.id === selectedExpressionId)
            ? selectedExpressionId
            : selectedCharacter.expressions[0]?.id ?? "";

        setSelectedExpressionId(nextExpression);
    }, [selectedCharacter, selectedExpressionId]);

    const selectedExpression = useMemo(
        () => selectedCharacter?.expressions.find((expression) => expression.id === selectedExpressionId) ?? selectedCharacter?.expressions[0],
        [selectedCharacter, selectedExpressionId],
    );

    const unlockedScenarioIds = new Set(persis.completedScenarios);
    const routeUnlocked = selectedGroup ? unlockedScenarioIds.has(selectedGroup.scenarioId) : false;

    const voiceLines = useMemo(() => {
        if (!selectedGroup || !selectedCharacter || !routeUnlocked) {
            return [];
        }

        return manifest.filter(
            (entry) =>
                entry.scene_id === selectedGroup.scenarioId &&
                normalizeSpeaker(entry.speaker) === normalizeSpeaker(selectedCharacter.name),
        );
    }, [manifest, routeUnlocked, selectedCharacter, selectedGroup]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        setPlayingSrc(null);
    }, [selectedGroup?.id, selectedCharacter?.name]);

    async function playVoiceLine(src: string) {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (playingSrc === src) {
            audio.pause();
            audio.currentTime = 0;
            setPlayingSrc(null);
            return;
        }

        audio.pause();
        audio.src = src;
        audio.currentTime = 0;

        try {
            await audio.play();
            setPlayingSrc(src);
        } catch {
            setPlayingSrc(null);
        }
    }

    return (
        <div className="space-y-4">
            <audio ref={audioRef} preload="auto" />

            <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="space-y-2">
                    {CHARACTER_SHOWCASES.map((group) => {
                        const unlocked = unlockedScenarioIds.has(group.scenarioId);
                        const active = group.id === selectedGroup?.id;
                        const meta = SCENARIO_META[group.scenarioId];

                        return (
                            <button
                                key={group.id}
                                type="button"
                                onClick={() => setSelectedGroupId(group.id)}
                                className={[
                                    "w-full rounded-[22px] border px-4 py-4 text-left transition-all duration-200",
                                    active
                                        ? "border-[#efbdd4] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,235,243,0.94))] shadow-[0_16px_36px_rgba(92,54,75,0.14)]"
                                        : "border-white/50 bg-white/62 hover:bg-white/76",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            {meta.shortLabel}
                                        </div>
                                        <div className="mt-1 text-[17px] font-semibold text-[#513746]">{group.label}</div>
                                    </div>
                                    <div
                                        className={[
                                            "shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                                            unlocked ? "bg-[#f7d8ea] text-[#6a4254]" : "bg-[#e7f4fb] text-[#446274]",
                                        ].join(" ")}
                                    >
                                        {unlocked ? "Unlocked" : "Locked"}
                                    </div>
                                </div>
                                <div className="mt-2 text-[12px] leading-5 text-[#6d4a5b]">{meta.title}</div>
                            </button>
                        );
                    })}
                </div>

                {selectedGroup ? (
                    <div className="rounded-[28px] bg-white/66 p-4 shadow-[0_20px_54px_rgba(61,34,48,0.16)] backdrop-blur-sm sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="text-[11px] uppercase tracking-[0.2em] text-[#8a6072]">
                                    Character Showcase
                                </div>
                                <h3 className="mt-1 text-[25px] font-semibold text-[#513746]">
                                    {selectedGroup.label}
                                </h3>
                                <p className="mt-2 max-w-[640px] text-[13px] leading-6 text-[#6d4a5b]">
                                    {routeUnlocked
                                        ? selectedGroup.hook
                                        : "Finish this route once to unlock profile details, reaction faces, and voice lines."}
                                </p>
                            </div>
                            <div
                                className={[
                                    "rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]",
                                    routeUnlocked ? "bg-[#f7d8ea] text-[#6a4254]" : "bg-[#e7f4fb] text-[#446274]",
                                ].join(" ")}
                            >
                                {routeUnlocked ? "Route Cleared" : "Locked"}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedGroup.characters.map((character) => (
                                <button
                                    key={character.name}
                                    type="button"
                                    onClick={() => setSelectedCharacterName(character.name)}
                                    disabled={!routeUnlocked}
                                    className={[
                                        "rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-200",
                                        selectedCharacter?.name === character.name
                                            ? "border-[#efbdd4] bg-[linear-gradient(135deg,#fff8fb,#ffe7f1)] text-[#5a394a]"
                                            : "border-white/50 bg-white/72 text-[#7a5567]",
                                        !routeUnlocked ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5",
                                    ].join(" ")}
                                >
                                    {character.name}
                                </button>
                            ))}
                        </div>

                        {routeUnlocked && selectedCharacter && selectedExpression ? (
                            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(240px,300px)_minmax(0,1fr)_minmax(260px,320px)]">
                                <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(38,21,33,0.14),rgba(255,255,255,0.68))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#8a6072]">Voice Lines</div>
                                    <div className="mt-2 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                                        {voiceLines.length > 0 ? (
                                            voiceLines.map((line, index) => (
                                                <button
                                                    key={line.src}
                                                    type="button"
                                                    onClick={() => void playVoiceLine(line.src)}
                                                    className={[
                                                        "w-full rounded-[18px] border px-3 py-3 text-left transition-all duration-200",
                                                        playingSrc === line.src
                                                            ? "border-[#efbdd4] bg-[linear-gradient(135deg,#fff8fb,#ffe7f1)] shadow-[0_12px_24px_rgba(92,54,75,0.12)]"
                                                            : "border-white/40 bg-white/70 hover:bg-white/82",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7b5668]">
                                                            Line {index + 1}
                                                        </div>
                                                        <div className="rounded-full bg-[#f7d8ea] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6a4254]">
                                                            {playingSrc === line.src ? "Stop" : "Play"}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-[13px] font-semibold text-[#513746]">
                                                        {buildVoiceLabel(line.text)}
                                                    </div>
                                                    <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#8b6274]">
                                                        {line.emotion ?? "Voice"}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="rounded-[18px] bg-white/72 px-4 py-4 text-[13px] leading-6 text-[#6d4a5b]">
                                                No generated voice lines were found yet for {selectedCharacter.name}.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-[26px] bg-[radial-gradient(circle_at_top,rgba(255,219,236,0.84),rgba(255,255,255,0.56)_38%,rgba(233,247,251,0.7)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]">
                                    <div className="text-center text-[11px] uppercase tracking-[0.18em] text-[#8a6072]">
                                        Reaction Viewer
                                    </div>
                                    <div className="mt-2 text-center text-[22px] font-semibold text-[#513746]">
                                        {selectedCharacter.name}
                                    </div>
                                    <div className="mt-1 text-center text-[12px] uppercase tracking-[0.16em] text-[#8b6274]">
                                        {selectedExpression.label}
                                    </div>

                                    <div className="mt-4 flex min-h-[420px] items-end justify-center overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(238,245,249,0.88))] px-4 pt-4">
                                        <img
                                            src={selectedExpression.src}
                                            alt={selectedCharacter.name + " " + selectedExpression.label}
                                            className="max-h-[400px] w-auto object-contain drop-shadow-[0_24px_28px_rgba(78,45,60,0.2)]"
                                            loading="eager"
                                            decoding="async"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                                        {selectedCharacter.expressions.map((expression) => (
                                            <button
                                                key={expression.id}
                                                type="button"
                                                onClick={() => setSelectedExpressionId(expression.id)}
                                                className={[
                                                    "rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200",
                                                    expression.id === selectedExpression.id
                                                        ? "border-[#efbdd4] bg-[linear-gradient(135deg,#fff8fb,#ffe7f1)] text-[#5a394a]"
                                                        : "border-white/50 bg-white/72 text-[#7a5567] hover:bg-white/84",
                                                ].join(" ")}
                                            >
                                                {expression.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-[24px] bg-white/76 px-4 py-4 shadow-[0_10px_24px_rgba(92,54,75,0.1)]">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-[18px] font-semibold text-[#513746]">{selectedCharacter.name}</div>
                                            <div className="rounded-full bg-[#f7d8ea] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6a4254]">
                                                {selectedCharacter.role}
                                            </div>
                                        </div>
                                        <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#8b6274]">
                                            Traits
                                        </div>
                                        <div className="mt-1 text-[13px] leading-6 text-[#6d4a5b]">{selectedCharacter.traits}</div>
                                        <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-[#8b6274]">
                                            Profile
                                        </div>
                                        <p className="mt-1 text-[13px] leading-6 text-[#6d4a5b]">{selectedCharacter.intro}</p>
                                    </div>

                                    <div className="rounded-[24px] bg-white/76 px-4 py-4 shadow-[0_10px_24px_rgba(92,54,75,0.1)]">
                                        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8b6274]">Unlocked Archive</div>
                                        <div className="mt-2 text-[13px] leading-6 text-[#6d4a5b]">
                                            {voiceLines.length} voice lines available for {selectedCharacter.name}. Reaction faces can be switched freely once the route is cleared.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 flex min-h-[430px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,rgba(18,10,20,0.12),rgba(255,255,255,0.66))] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]">
                                <div className="max-w-[460px]">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(239,189,212,0.9),rgba(214,237,245,0.94))] text-[28px] font-semibold text-[#5a394a] shadow-[0_18px_40px_rgba(92,54,75,0.14)]">
                                        Locked
                                    </div>
                                    <div className="mt-4 text-[24px] font-semibold text-[#513746]">Character Archive Locked</div>
                                    <p className="mt-3 text-[14px] leading-7 text-[#6d4a5b]">
                                        Finish {SCENARIO_META[selectedGroup.scenarioId].shortLabel} to unlock {selectedGroup.label}, their sprite reactions, and their voice archive.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
