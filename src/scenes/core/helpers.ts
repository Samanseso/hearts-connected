import { Scene } from "narraleaf-react";
import { SCENARIO_META, type PlayableScenarioId } from "@/lib/game-data";
import {
    defaultPersisData,
    persis,
    type EndingId,
    type PersisData,
} from "@/lib/persistents";
import {
    calculateRouteScore,
    createDefaultScenarioGradeRecord,
    createDefaultScenarioScoreRecord,
    scoreToGrade,
} from "@/lib/route-grading";

export type StatKey = keyof Pick<
    PersisData,
    "trust" | "contentment" | "anxiety" | "pressure" | "selfRespect" | "commitment" | "communication"
>;

export type StatDelta = Partial<Record<StatKey, number>>;

export type StoryStats = Pick<
    PersisData,
    "trust" | "contentment" | "anxiety" | "pressure" | "selfRespect" | "commitment" | "communication"
>;

export type EndingContent = {
    endingId: EndingId;
    endingTitle: string;
    endingMessage: string;
    endingLesson: string;
    endingQuote: string;
};

const STAT_KEYS: StatKey[] = [
    "trust",
    "contentment",
    "anxiety",
    "pressure",
    "selfRespect",
    "commitment",
    "communication",
];

function clampStat(value: number) {
    return Math.max(0, Math.min(100, value));
}

function normalizeCompletedScenarios(value: Partial<PersisData>) {
    return Array.isArray(value.completedScenarios) ? value.completedScenarios : [];
}

function normalizeEndingGallery(value: Partial<PersisData>) {
    return Array.isArray(value.endingGallery) ? value.endingGallery : [];
}

function normalizeBestScenarioScores(value: Partial<PersisData>) {
    return {
        ...createDefaultScenarioScoreRecord(),
        ...(value.bestScenarioScores ?? {}),
    };
}

function normalizeBestScenarioGrades(value: Partial<PersisData>) {
    return {
        ...createDefaultScenarioGradeRecord(),
        ...(value.bestScenarioGrades ?? {}),
    };
}

function preserveProgressState(value: PersisData) {
    const completedScenarios = normalizeCompletedScenarios(value);
    const endingGallery = normalizeEndingGallery(value);

    return {
        completedScenarios,
        completedCount: typeof value.completedCount === "number" ? value.completedCount : completedScenarios.length,
        endingGallery,
        endingsDiscoveredCount:
            typeof value.endingsDiscoveredCount === "number"
                ? value.endingsDiscoveredCount
                : endingGallery.length,
        reflectionUnlocked: Boolean(value.reflectionUnlocked),
        latestScenarioScore:
            typeof value.latestScenarioScore === "number"
                ? value.latestScenarioScore
                : defaultPersisData.latestScenarioScore,
        latestScenarioGrade: value.latestScenarioGrade ?? defaultPersisData.latestScenarioGrade,
        bestScenarioScores: normalizeBestScenarioScores(value),
        bestScenarioGrades: normalizeBestScenarioGrades(value),
    };
}

export function setHubPage(pageTitle: string, pageTheme: string, pageWarning = "") {
    return persis.assign((value) => ({
        currentScenario: "hub",
        currentScenarioTitle: pageTitle,
        currentScenarioTheme: pageTheme,
        currentContentWarning: pageWarning,
        currentEnding: "none",
        endingTitle: "",
        endingMessage: "",
        endingLesson: "",
        endingQuote: "",
        trust: defaultPersisData.trust,
        contentment: defaultPersisData.contentment,
        anxiety: defaultPersisData.anxiety,
        pressure: defaultPersisData.pressure,
        selfRespect: defaultPersisData.selfRespect,
        commitment: defaultPersisData.commitment,
        communication: defaultPersisData.communication,
        ...preserveProgressState(value),
    }));
}

export function resetScenarioState(scenarioId: PlayableScenarioId) {
    const meta = SCENARIO_META[scenarioId];

    return persis.assign((value) => ({
        currentScenario: scenarioId,
        currentScenarioTitle: meta.title,
        currentScenarioTheme: meta.theme,
        currentContentWarning: meta.contentWarning,
        currentEnding: "none",
        endingTitle: "",
        endingMessage: "",
        endingLesson: "",
        endingQuote: "",
        ...preserveProgressState(value),
        ...meta.startingStats,
    }));
}

export function resetHubState() {
    return setHubPage("Story Hub", "Choose a case study in modern relationships");
}

export function adjustStats(changes: StatDelta) {
    return persis.assign((value) => {
        const next: Partial<PersisData> = {};

        for (const key of STAT_KEYS) {
            const delta = changes[key];

            if (typeof delta === "number") {
                next[key] = clampStat(value[key] + delta);
            }
        }

        return next;
    });
}

function buildNextStats(value: PersisData, changes: StatDelta): StoryStats {
    return {
        trust: clampStat(value.trust + (changes.trust ?? 0)),
        contentment: clampStat(value.contentment + (changes.contentment ?? 0)),
        anxiety: clampStat(value.anxiety + (changes.anxiety ?? 0)),
        pressure: clampStat(value.pressure + (changes.pressure ?? 0)),
        selfRespect: clampStat(value.selfRespect + (changes.selfRespect ?? 0)),
        commitment: clampStat(value.commitment + (changes.commitment ?? 0)),
        communication: clampStat(value.communication + (changes.communication ?? 0)),
    };
}

export function finishScenario(
    scene: Scene,
    resultScene: Scene,
    scenarioId: PlayableScenarioId,
    ending: EndingContent,
    finalStatChanges: StatDelta = {},
) {
    const meta = SCENARIO_META[scenarioId];

    return [
        persis.assign((value) => {
            const nextStats = buildNextStats(value, finalStatChanges);
            const existingCompletedScenarios = normalizeCompletedScenarios(value);
            const existingEndingGallery = normalizeEndingGallery(value);
            const completedScenarios = existingCompletedScenarios.includes(scenarioId)
                ? existingCompletedScenarios
                : [...existingCompletedScenarios, scenarioId];
            const galleryKey = `${scenarioId}:${ending.endingId}`;
            const endingGallery = existingEndingGallery.includes(galleryKey)
                ? existingEndingGallery
                : [...existingEndingGallery, galleryKey];
            const latestScenarioScore = calculateRouteScore(nextStats);
            const latestScenarioGrade = scoreToGrade(latestScenarioScore);
            const bestScenarioScores = normalizeBestScenarioScores(value);
            const bestScenarioGrades = normalizeBestScenarioGrades(value);

            if (latestScenarioScore >= (bestScenarioScores[scenarioId] ?? 0)) {
                bestScenarioScores[scenarioId] = latestScenarioScore;
                bestScenarioGrades[scenarioId] = latestScenarioGrade;
            }

            return {
                currentScenario: scenarioId,
                currentScenarioTitle: meta.title,
                currentScenarioTheme: meta.theme,
                currentContentWarning: meta.contentWarning,
                currentEnding: ending.endingId,
                endingTitle: ending.endingTitle,
                endingMessage: ending.endingMessage,
                endingLesson: ending.endingLesson,
                endingQuote: ending.endingQuote,
                ...nextStats,
                completedScenarios,
                completedCount: completedScenarios.length,
                endingGallery,
                endingsDiscoveredCount: endingGallery.length,
                reflectionUnlocked: Boolean(value.reflectionUnlocked),
                latestScenarioScore,
                latestScenarioGrade,
                bestScenarioScores,
                bestScenarioGrades,
            };
        }),
        scene.jumpTo(resultScene),
    ];
}

export function scenarioIntro(scenarioId: PlayableScenarioId) {
    const meta = SCENARIO_META[scenarioId];

    return [
        resetScenarioState(scenarioId),
        `${meta.shortLabel}: ${meta.title}`,
        `Theme: ${meta.theme}`,
        `Content Note: ${meta.contentWarning}`,
        `${meta.summary}`,
    ];
}


