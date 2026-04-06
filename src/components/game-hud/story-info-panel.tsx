"use client";

import { useEffect, useState } from "react";
import { STAT_LABELS, STAT_ORDER } from "@/components/game-hud/constants";
import { ScenarioChecklist } from "@/components/game-hud/scenario-checklist";
import { StatBar } from "@/components/game-hud/stat-bar";
import { TOTAL_ENDINGS, TOTAL_SCENARIOS, type ScenarioMeta } from "@/lib/game-data";
import type { PersisData } from "@/lib/persistents";
import { RESEARCH_NOTES } from "@/lib/research-data";
import { formatGrade } from "@/lib/route-grading";

type StoryInfoPanelProps = {
    currentMeta: ScenarioMeta | null;
    persis: PersisData;
    completedCount: number;
    endingsFound: number;
    title: string;
    icon: string;
    onOpenCharacters: () => void;
};

type HubSection = "overview" | "research" | "achievements" | "credits";

const HUB_SECTIONS: Array<{ id: HubSection; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "research", label: "Research Notes" },
    { id: "achievements", label: "Achievements" },
    { id: "credits", label: "Credits" },
];

function averageBestScore(persis: PersisData) {
    const values = Object.values(persis.bestScenarioScores).filter((value) => value > 0);

    if (values.length === 0) {
        return 0;
    }

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function formatStoryMode() {
    return "Reflective anthology";
}

function buildAchievementBoard(persis: PersisData) {
    return [
        {
            title: "First Reflection",
            description: "Clear any story once.",
            unlocked: persis.completedCount >= 1,
        },
        {
            title: "Midway Through the Feed",
            description: "Complete four different stories.",
            unlocked: persis.completedCount >= 4,
        },
        {
            title: "Full Study Set",
            description: "Complete every story in the anthology.",
            unlocked: persis.completedCount >= TOTAL_SCENARIOS,
        },
        {
            title: "Open Channel",
            description: "Earn a reflective score in three different stories.",
            unlocked: Object.values(persis.bestScenarioScores).filter((score) => score >= 70).length >= 3,
        },
        {
            title: "Grounded Reader",
            description: "Earn at least one A route.",
            unlocked: Object.values(persis.bestScenarioGrades).some((grade) => grade === "A"),
        },
        {
            title: "Pattern Spotter",
            description: "Discover ten different endings.",
            unlocked: persis.endingsDiscoveredCount >= 10,
        },
    ];
}

function HubSectionButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-full border p-2 !text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200",
                active
                    ? "border-[#efbdd4] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,231,242,0.94))] text-[#5a394a] shadow-[0_10px_24px_rgba(92,54,75,0.12)]"
                    : "border-white/65 bg-white/55 text-[#7a5567] hover:bg-white/72",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

export function StoryInfoPanel({
    currentMeta,
    persis,
    completedCount,
    endingsFound,
    title,
    icon,
    onOpenCharacters,
}: StoryInfoPanelProps) {
    const [hubSection, setHubSection] = useState<HubSection>("overview");
    const meanScore = averageBestScore(persis);
    const achievements = buildAchievementBoard(persis);
    const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked).length;

    useEffect(() => {
        if (currentMeta) {
            setHubSection("overview");
        }
    }, [currentMeta]);

    return (
        <div
            className={[
                "backdrop-blur-[2px]",
                currentMeta
                    ? "w-[min(360px,calc(100vw-2rem))] sm:w-[min(420px,calc(100vw-6.5rem))]"
                    : "w-[min(560px,calc(100vw-2rem))] sm:w-[min(620px,calc(100vw-6.5rem))]",
            ].join(" ")}
        >
                <div
                    className={[
                        "rounded-[30px] bg-white/60 p-5 text-[#513746] shadow-[0_22px_60px_rgba(61,34,48,0.18)]",
                        currentMeta ? "" : "max-h-[calc(100vh-9.5rem)] overflow-y-auto [&::-webkit-scrollbar]:w-0",
                    ].join(" ")}
                >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.26em] text-[#956779]">
                            Beyond the Screen
                        </div>
                        <div className="flex items-center gap-3 my-3">
                            <h2 className="text-[24px] font-semibold leading-tight">
                                {title}
                            </h2>
                            <div className="inline-flex rounded-full bg-white/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a5567] shadow-[0_6px_14px_rgba(92,54,75,0.1)]">
                                {formatStoryMode()}
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-1 h-10 w-10 shrink-0 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('${icon}')` }}
                    />
                </div>

                {currentMeta ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[15px] font-semibold leading-tight">
                                {persis.currentScenarioTitle}
                            </div>
                            <div className="text-[12px] uppercase tracking-[0.16em] text-[#8c6476]">
                                {persis.currentScenarioTheme}
                            </div>
                            <div className="rounded-[18px] bg-white/70 px-3 py-2 text-[12px] text-[#6f4b5c] shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                Content Note: {persis.currentContentWarning}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-[18px] bg-white/70 px-3 py-2 text-[12px] shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="uppercase tracking-[0.14em] text-[#8c6476]">Latest Score</div>
                                    <div className="mt-1 text-[18px] font-semibold text-[#513746]">
                                        {persis.latestScenarioScore}/100
                                    </div>
                                </div>
                                <div className="rounded-[18px] bg-white/70 px-3 py-2 text-[12px] shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="uppercase tracking-[0.14em] text-[#8c6476]">Latest Grade</div>
                                    <div className="mt-1 text-[18px] font-semibold text-[#513746]">
                                        {formatGrade(persis.latestScenarioGrade)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {STAT_ORDER.map((key, index) => (
                                <StatBar
                                    key={key}
                                    label={STAT_LABELS[key]}
                                    value={persis[key]}
                                    tone={index % 2 === 0 ? "pink" : "blue"}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-wrap justify-between">
                            {HUB_SECTIONS.map((section) => (
                                <HubSectionButton
                                    key={section.id}
                                    active={hubSection === section.id}
                                    label={section.label}
                                    onClick={() => setHubSection(section.id)}
                                />
                            ))}
                            <HubSectionButton
                                active={false}
                                label="Characters"
                                onClick={onOpenCharacters}
                            />
                        </div>

                        {hubSection === "overview" ? (
                            <>
                                <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Progress
                                    </div>
                                    <div className="mt-2 flex items-end justify-between gap-4">
                                        <div>
                                            <div className="text-[28px] font-semibold leading-none">
                                                {completedCount}/{TOTAL_SCENARIOS}
                                            </div>
                                            <div className="text-[13px] text-[#6d4a5b]">
                                                Story routes completed
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[22px] font-semibold leading-none">
                                                {endingsFound}/{TOTAL_ENDINGS}
                                            </div>
                                            <div className="text-[13px] text-[#6d4a5b]">
                                                Endings discovered
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Latest Route
                                        </div>
                                        <div className="mt-1 text-[20px] font-semibold">
                                            {formatGrade(persis.latestScenarioGrade)}
                                        </div>
                                        <div className="text-[13px] text-[#6d4a5b]">
                                            {persis.latestScenarioScore}/100
                                        </div>
                                    </div>
                                    <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Best Mean Score
                                        </div>
                                        <div className="mt-1 text-[20px] font-semibold">
                                            {meanScore}/100
                                        </div>
                                        <div className="text-[13px] text-[#6d4a5b]">
                                            Across cleared stories
                                        </div>
                                    </div>
                                </div>

                                <ScenarioChecklist
                                    completedScenarios={persis.completedScenarios}
                                    bestScenarioScores={persis.bestScenarioScores}
                                    bestScenarioGrades={persis.bestScenarioGrades}
                                />
                            </>
                        ) : null}

                        {hubSection === "research" ? (
                            <div className="space-y-3">
                                {RESEARCH_NOTES.map((note) => (
                                    <div
                                        key={note.title}
                                        className="rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]"
                                    >
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Research Note
                                        </div>
                                        <h3 className="mt-2 text-[19px] font-semibold text-[#513746]">
                                            {note.title}
                                        </h3>
                                        <div className="mt-3 space-y-2 text-[13px] leading-6 text-[#6d4a5b]">
                                            {note.lines.map((line) => (
                                                <p key={line}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                                                {hubSection === "achievements" ? (
                            <div className="space-y-3">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Unlocked
                                        </div>
                                        <div className="mt-1 text-[24px] font-semibold">
                                            {unlockedAchievements}/{achievements.length}
                                        </div>
                                    </div>
                                    <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Routes Cleared
                                        </div>
                                        <div className="mt-1 text-[24px] font-semibold">
                                            {completedCount}
                                        </div>
                                    </div>
                                    <div className="rounded-[20px] bg-white/72 px-4 py-3 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                        <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                            Endings Found
                                        </div>
                                        <div className="mt-1 text-[24px] font-semibold">
                                            {endingsFound}
                                        </div>
                                    </div>
                                </div>

                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.title}
                                        className="flex items-start justify-between gap-4 rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]"
                                    >
                                        <div>
                                            <h3 className="text-[18px] font-semibold text-[#513746]">
                                                {achievement.title}
                                            </h3>
                                            <p className="mt-1 text-[13px] leading-6 text-[#6d4a5b]">
                                                {achievement.description}
                                            </p>
                                        </div>
                                        <div
                                            className={[
                                                "shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                                                achievement.unlocked
                                                    ? "bg-[#f7d8ea] text-[#6a4254]"
                                                    : "bg-[#e7f4fb] text-[#446274]",
                                            ].join(" ")}
                                        >
                                            {achievement.unlocked ? "Unlocked" : "Locked"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {hubSection === "credits" ? (
                            <div className="space-y-3">
                                <div className="rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Research Inspiration
                                    </div>
                                    <h3 className="mt-2 text-[19px] font-semibold text-[#513746]">
                                        A Correlational Study: Social Media Exposure and Students&apos; Attitude
                                        Towards Romantic Commitment at Our Lady of Guadalupe Colleges
                                    </h3>
                                </div>

                                <div className="rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Student Researchers
                                    </div>
                                    <p className="mt-2 text-[13px] leading-6 text-[#6d4a5b]">
                                        Margotte Audrey Avery G. Barsaga, Aizen R. Corpuz, Zohra Haider L. Janjua,
                                        and Cherrymer S. Onato.
                                    </p>
                                </div>

                                <div className="rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Adviser
                                    </div>
                                    <p className="mt-2 text-[13px] leading-6 text-[#6d4a5b]">
                                        Mr. Bob Jimenez.
                                    </p>
                                </div>

                                <div className="rounded-[20px] bg-white/72 px-4 py-4 shadow-[0_8px_20px_rgba(92,54,75,0.12)]">
                                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#8a6072]">
                                        Adaptation Note
                                    </div>
                                    <p className="mt-2 text-[13px] leading-6 text-[#6d4a5b]">
                                        This build reframes the proposal&apos;s ideas as a thesis-friendly visual novel
                                        with route grading, story tracking, character files, and reflective endings.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}



