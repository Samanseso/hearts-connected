import { PLAYABLE_SCENARIO_IDS, type PlayableScenarioId } from "@/lib/game-data";

export type RouteGrade = "none" | "A" | "B" | "C" | "D";

export const GRADE_LABELS: Record<RouteGrade, string> = {
    none: "Not Cleared",
    A: "Grounded",
    B: "Reflective",
    C: "Mixed",
    D: "Strained",
};

export function createDefaultScenarioScoreRecord(defaultValue = 0): Record<PlayableScenarioId, number> {
    return Object.fromEntries(
        PLAYABLE_SCENARIO_IDS.map((scenarioId) => [scenarioId, defaultValue]),
    ) as Record<PlayableScenarioId, number>;
}

export function createDefaultScenarioGradeRecord(
    defaultValue: RouteGrade = "none",
): Record<PlayableScenarioId, RouteGrade> {
    return Object.fromEntries(
        PLAYABLE_SCENARIO_IDS.map((scenarioId) => [scenarioId, defaultValue]),
    ) as Record<PlayableScenarioId, RouteGrade>;
}

export function scoreToGrade(score: number): RouteGrade {
    if (score >= 85) {
        return "A";
    }

    if (score >= 70) {
        return "B";
    }

    if (score >= 55) {
        return "C";
    }

    return "D";
}

export function formatGrade(grade: RouteGrade) {
    return grade === "none" ? GRADE_LABELS.none : `${grade} - ${GRADE_LABELS[grade]}`;
}

export function calculateRouteScore(stats: {
    trust: number;
    communication: number;
    contentment: number;
    anxiety: number;
    pressure: number;
    selfRespect: number;
    commitment: number;
}) {
    const weightedScore =
        stats.trust * 0.2 +
        stats.communication * 0.2 +
        stats.contentment * 0.2 +
        stats.selfRespect * 0.15 +
        stats.commitment * 0.1 +
        (100 - stats.anxiety) * 0.075 +
        (100 - stats.pressure) * 0.075;

    return Math.max(0, Math.min(100, Math.round(weightedScore)));
}
