"use client";

import { useEffect, useState } from "react";
import { useGame } from "narraleaf-react";
import { defaultPersisData, PERSIS_NAMESPACE, type PersisData } from "@/lib/persistents";
import { SAVE_KEY } from "@/components/game-hud/constants";
import type { HudSnapshot } from "@/components/game-hud/types";

function readPersistentState(): PersisData {
    return { ...defaultPersisData };
}

function normalizeSaveAvailability() {
    if (typeof window === "undefined") {
        return false;
    }

    return Boolean(window.localStorage.getItem(SAVE_KEY));
}

function safeGet<K extends keyof PersisData>(
    namespace: ReturnType<ReturnType<typeof useGame>["getLiveGame"]>["getStorable"] extends () => infer TStorable
        ? TStorable extends { getNamespace: (name: string) => infer TNamespace }
            ? TNamespace
            : never
        : never,
    key: K,
    fallback: PersisData[K],
): PersisData[K] {
    try {
        return namespace.get(key as string) as PersisData[K];
    } catch {
        return fallback;
    }
}

export function readHudSnapshot(game: ReturnType<typeof useGame>): HudSnapshot {
    const liveGame = game.getLiveGame();

    try {
        const namespace = liveGame.getStorable().getNamespace<PersisData>(PERSIS_NAMESPACE);
        const snapshot: PersisData = {
            currentScenario: safeGet(namespace, "currentScenario", defaultPersisData.currentScenario),
            currentScenarioTitle: safeGet(namespace, "currentScenarioTitle", defaultPersisData.currentScenarioTitle),
            currentScenarioTheme: safeGet(namespace, "currentScenarioTheme", defaultPersisData.currentScenarioTheme),
            currentContentWarning: safeGet(namespace, "currentContentWarning", defaultPersisData.currentContentWarning),
            playerGender: safeGet(namespace, "playerGender", defaultPersisData.playerGender),
            currentEnding: safeGet(namespace, "currentEnding", defaultPersisData.currentEnding),
            endingTitle: safeGet(namespace, "endingTitle", defaultPersisData.endingTitle),
            endingMessage: safeGet(namespace, "endingMessage", defaultPersisData.endingMessage),
            endingLesson: safeGet(namespace, "endingLesson", defaultPersisData.endingLesson),
            endingQuote: safeGet(namespace, "endingQuote", defaultPersisData.endingQuote),
            trust: safeGet(namespace, "trust", defaultPersisData.trust),
            contentment: safeGet(namespace, "contentment", defaultPersisData.contentment),
            anxiety: safeGet(namespace, "anxiety", defaultPersisData.anxiety),
            pressure: safeGet(namespace, "pressure", defaultPersisData.pressure),
            selfRespect: safeGet(namespace, "selfRespect", defaultPersisData.selfRespect),
            commitment: safeGet(namespace, "commitment", defaultPersisData.commitment),
            communication: safeGet(namespace, "communication", defaultPersisData.communication),
            completedScenarios: safeGet(namespace, "completedScenarios", defaultPersisData.completedScenarios),
            completedCount: safeGet(namespace, "completedCount", defaultPersisData.completedCount),
            endingGallery: safeGet(namespace, "endingGallery", defaultPersisData.endingGallery),
            endingsDiscoveredCount: safeGet(
                namespace,
                "endingsDiscoveredCount",
                defaultPersisData.endingsDiscoveredCount,
            ),
            reflectionUnlocked: safeGet(namespace, "reflectionUnlocked", defaultPersisData.reflectionUnlocked),
            latestScenarioScore: safeGet(namespace, "latestScenarioScore", defaultPersisData.latestScenarioScore),
            latestScenarioGrade: safeGet(namespace, "latestScenarioGrade", defaultPersisData.latestScenarioGrade),
            bestScenarioScores: safeGet(namespace, "bestScenarioScores", defaultPersisData.bestScenarioScores),
            bestScenarioGrades: safeGet(namespace, "bestScenarioGrades", defaultPersisData.bestScenarioGrades),
        };

        return {
            persis: snapshot,
            autoForward: game.preference.getPreference("autoForward"),
            cps: Number(game.preference.getPreference("cps") ?? 30),
            hasSave: normalizeSaveAvailability(),
        };
    } catch {
        return {
            persis: readPersistentState(),
            autoForward: game.preference.getPreference("autoForward"),
            cps: Number(game.preference.getPreference("cps") ?? 30),
            hasSave: normalizeSaveAvailability(),
        };
    }
}

export function useHudSnapshot(game: ReturnType<typeof useGame>) {
    const [snapshot, setSnapshot] = useState<HudSnapshot>(() => readHudSnapshot(game));

    useEffect(() => {
        const liveGame = game.getLiveGame();
        let detach: VoidFunction | undefined;

        const sync = () => {
            setSnapshot(readHudSnapshot(game));
        };

        const attach = () => {
            const gameState = liveGame.getGameState();

            if (!gameState) {
                return;
            }

            const tokens = [
                liveGame.onCharacterPrompt(sync),
                liveGame.onMenuChoose(sync),
                gameState.events.on("event:state.onRender", sync),
                gameState.events.on("event:state.player.requestFlush", sync),
                game.preference.onPreferenceChange(sync),
            ];

            detach = () => {
                tokens.forEach((token) => token.cancel());
            };
        };

        attach();
        sync();

        const fallbackInterval = window.setInterval(() => {
            if (!detach && liveGame.getGameState()) {
                attach();
            }

            sync();
        }, 700);

        return () => {
            detach?.();
            window.clearInterval(fallbackInterval);
        };
    }, [game]);

    return {
        snapshot,
        refreshSnapshot: () => setSnapshot(readHudSnapshot(game)),
    };
}


