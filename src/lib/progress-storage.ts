import type { PersisData } from "@/lib/persistents";
import { PERSIS_NAMESPACE } from "@/lib/persistents";
import {
    createDefaultScenarioGradeRecord,
    createDefaultScenarioScoreRecord,
} from "@/lib/route-grading";

const PROGRESS_STORAGE_KEY = "hearts-connected-progress";

type StoredProgress = Pick<
    PersisData,
    | "completedScenarios"
    | "completedCount"
    | "endingGallery"
    | "endingsDiscoveredCount"
    | "reflectionUnlocked"
    | "latestScenarioScore"
    | "latestScenarioGrade"
    | "bestScenarioScores"
    | "bestScenarioGrades"
>;

type LiveGameLike = {
    getStorable: () => {
        getNamespace: (...args: any[]) => {
            assign: (...args: any[]) => unknown;
            get: (...args: any[]) => unknown;
        };
    };
};

function normalizeStoredProgress(
    value: Partial<StoredProgress> | null | undefined,
): StoredProgress {
    const bestScenarioScores = {
        ...createDefaultScenarioScoreRecord(),
        ...(value?.bestScenarioScores ?? {}),
    };

    const bestScenarioGrades = {
        ...createDefaultScenarioGradeRecord(),
        ...(value?.bestScenarioGrades ?? {}),
    };

    const completedScenarios = Array.isArray(value?.completedScenarios)
        ? value.completedScenarios
        : [];
    const endingGallery = Array.isArray(value?.endingGallery) ? value.endingGallery : [];

    return {
        completedScenarios,
        completedCount: typeof value?.completedCount === "number"
            ? value.completedCount
            : completedScenarios.length,
        endingGallery,
        endingsDiscoveredCount: typeof value?.endingsDiscoveredCount === "number"
            ? value.endingsDiscoveredCount
            : endingGallery.length,
        reflectionUnlocked: Boolean(value?.reflectionUnlocked),
        latestScenarioScore: typeof value?.latestScenarioScore === "number" ? value.latestScenarioScore : 0,
        latestScenarioGrade: value?.latestScenarioGrade ?? "none",
        bestScenarioScores,
        bestScenarioGrades,
    };
}

export function readStoredProgress(): StoredProgress | null {
    if (typeof window === "undefined") {
        return null;
    }

    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return normalizeStoredProgress(JSON.parse(raw) as Partial<StoredProgress>);
    } catch {
        return null;
    }
}

export function clearStoredProgress() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

export function restoreStoredProgress(liveGame: LiveGameLike) {
    const progress = readStoredProgress();

    if (!progress) {
        return false;
    }

    try {
        liveGame.getStorable().getNamespace(PERSIS_NAMESPACE).assign(progress);
        return true;
    } catch {
        return false;
    }
}

export function saveStoredProgress(liveGame: LiveGameLike) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const namespace = liveGame.getStorable().getNamespace(PERSIS_NAMESPACE);
        const progress = normalizeStoredProgress({
            completedScenarios: namespace.get("completedScenarios") as PersisData["completedScenarios"],
            completedCount: namespace.get("completedCount") as PersisData["completedCount"],
            endingGallery: namespace.get("endingGallery") as PersisData["endingGallery"],
            endingsDiscoveredCount: namespace.get("endingsDiscoveredCount") as PersisData["endingsDiscoveredCount"],
            reflectionUnlocked: namespace.get("reflectionUnlocked") as PersisData["reflectionUnlocked"],
            latestScenarioScore: namespace.get("latestScenarioScore") as PersisData["latestScenarioScore"],
            latestScenarioGrade: namespace.get("latestScenarioGrade") as PersisData["latestScenarioGrade"],
            bestScenarioScores: namespace.get("bestScenarioScores") as PersisData["bestScenarioScores"],
            bestScenarioGrades: namespace.get("bestScenarioGrades") as PersisData["bestScenarioGrades"],
        });

        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
        // Ignore storage errors so gameplay can continue.
    }
}
