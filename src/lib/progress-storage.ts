import type { PersisData } from "@/lib/persistents";
import { PERSIS_NAMESPACE } from "@/lib/persistents";

const PROGRESS_STORAGE_KEY = "hearts-connected-progress";

type StoredProgress = Pick<
    PersisData,
    "completedScenarios" | "endingGallery" | "reflectionUnlocked"
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
    return {
        completedScenarios: Array.isArray(value?.completedScenarios)
            ? value.completedScenarios
            : [],
        endingGallery: Array.isArray(value?.endingGallery)
            ? value.endingGallery
            : [],
        reflectionUnlocked: Boolean(value?.reflectionUnlocked),
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

export function restoreStoredProgress(liveGame: LiveGameLike) {
    const progress = readStoredProgress();

    if (!progress) {
        return false;
    }

    liveGame.getStorable().getNamespace(PERSIS_NAMESPACE).assign(progress);
    return true;
}

export function saveStoredProgress(liveGame: LiveGameLike) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const namespace = liveGame.getStorable().getNamespace(PERSIS_NAMESPACE);
        const progress = normalizeStoredProgress({
            completedScenarios: namespace.get("completedScenarios") as PersisData["completedScenarios"],
            endingGallery: namespace.get("endingGallery") as PersisData["endingGallery"],
            reflectionUnlocked: namespace.get("reflectionUnlocked") as PersisData["reflectionUnlocked"],
        });

        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
        // Ignore storage errors so gameplay can continue.
    }
}
