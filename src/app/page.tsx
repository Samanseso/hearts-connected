"use client";

import { useEffect, useRef, useState } from "react";
import { GameProviders, Player, PlayerEventContext, useGame } from "narraleaf-react";
import { LandingScreen } from "@/components/landing-screen";
import { LoadingScreen } from "@/components/loading-screen";
import { SAVE_KEY } from "@/components/game-hud/constants";
import { GameHud } from "@/lib/game-hud";
import { GameDialog } from "@/lib/dialog";
import { GameMenu } from "@/lib/menu";
import {
    clearStoredProgress,
    restoreStoredProgress,
    saveStoredProgress,
    readStoredProgress,
} from "@/lib/progress-storage";
import { story } from "../lib/story";

type LaunchMode = "new" | "continue" | null;

const MIN_LOADING_SCREEN_MS = 900;

function hasSavedRun(progress: ReturnType<typeof readStoredProgress>) {
    return Boolean(
        progress &&
            ((progress.completedCount ?? 0) > 0 || (progress.endingsDiscoveredCount ?? 0) > 0),
    );
}

function App() {
    const game = useGame();
    const progressReadyRef = useRef(false);
    const pendingStartRef = useRef(false);
    const launchStartedAtRef = useRef<number | null>(null);
    const loadingTimerRef = useRef<number | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [playerMounted, setPlayerMounted] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [started, setStarted] = useState(false);
    const [launchMode, setLaunchMode] = useState<LaunchMode>(null);
    const [progressPreview, setProgressPreview] = useState<ReturnType<typeof readStoredProgress>>(null);

    useEffect(() => {
        game.configure({
            width: 1280,
            height: 720,
            aspectRatio: 16 / 9,
            ratioUpdateInterval: 0,
            dialog: GameDialog,
            menu: GameMenu,
            defaultTextColor: "#513746",
            defaultMenuChoiceColor: "white",
            defaultNametagColor: "#2987a1",
        });
        game.preference.setPreference("cps", 50);
    }, [game]);

    useEffect(() => {
        setProgressPreview(readStoredProgress());
        setHydrated(true);
    }, []);

    useEffect(() => {
        return () => {
            if (loadingTimerRef.current !== null) {
                window.clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const liveGame = game.getLiveGame();
        let detach: VoidFunction | undefined;

        const syncProgress = () => {
            if (!progressReadyRef.current) {
                return;
            }

            saveStoredProgress(liveGame);
        };

        const attach = () => {
            const gameState = liveGame.getGameState();

            if (!gameState) {
                return;
            }

            const tokens = [
                liveGame.onCharacterPrompt(syncProgress),
                liveGame.onMenuChoose(syncProgress),
                gameState.events.on("event:state.onRender", syncProgress),
                gameState.events.on("event:state.player.requestFlush", syncProgress),
            ];

            detach = () => {
                tokens.forEach((token) => token.cancel());
            };
        };

        attach();

        const fallbackInterval = window.setInterval(() => {
            if (!detach && liveGame.getGameState()) {
                attach();
            }
        }, 700);

        return () => {
            detach?.();
            window.clearInterval(fallbackInterval);
        };
    }, [game]);

    function clearLoadingTimer() {
        if (loadingTimerRef.current !== null) {
            window.clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
        }
    }

    function initializeSession(liveGame = game.getLiveGame()) {
        clearLoadingTimer();
        liveGame.newGame();
        restoreStoredProgress(liveGame);
        progressReadyRef.current = true;
        saveStoredProgress(liveGame);
        setProgressPreview(readStoredProgress());

        const startedAt = launchStartedAtRef.current ?? Date.now();
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_LOADING_SCREEN_MS - elapsed);

        const finalizeLaunch = () => {
            pendingStartRef.current = false;
            launchStartedAtRef.current = null;
            loadingTimerRef.current = null;
            setStarted(true);
            setLaunchMode(null);
        };

        if (remaining === 0) {
            finalizeLaunch();
            return;
        }

        loadingTimerRef.current = window.setTimeout(finalizeLaunch, remaining);
    }

    function startStory() {
        if (launchMode) {
            return;
        }

        launchStartedAtRef.current = Date.now();
        pendingStartRef.current = true;
        setLaunchMode(hasSavedRun(progressPreview) ? "continue" : "new");

        if (!playerMounted) {
            setPlayerMounted(true);
            return;
        }

        if (playerReady) {
            initializeSession();
        }
    }

    function returnToStartScreen() {
        const liveGame = game.getLiveGame();

        clearLoadingTimer();
        progressReadyRef.current = false;
        pendingStartRef.current = false;
        launchStartedAtRef.current = null;
        setLaunchMode(null);
        liveGame.newGame();
        restoreStoredProgress(liveGame);
        saveStoredProgress(liveGame);
        setProgressPreview(readStoredProgress());
        setStarted(false);
    }

    function clearGameData() {
        const liveGame = game.getLiveGame();

        clearLoadingTimer();
        progressReadyRef.current = false;
        pendingStartRef.current = false;
        launchStartedAtRef.current = null;
        setLaunchMode(null);
        clearStoredProgress();

        if (typeof window !== "undefined") {
            window.localStorage.removeItem(SAVE_KEY);
        }

        liveGame.newGame();
        setProgressPreview(null);
        setStarted(false);
    }

    function handleOnReady({ liveGame }: PlayerEventContext) {
        setPlayerReady(true);

        if (pendingStartRef.current) {
            initializeSession(liveGame);
        }
    }

    const loadingTitle = launchMode === "continue" ? "Opening your dashboard" : "Preparing the story";
    const loadingDetail =
        launchMode === "continue"
            ? "Restoring progress, scenes, and route memory."
            : "Building your session and first load.";

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-[#08060b]">
            {playerMounted ? (
                <Player
                    story={story}
                    width="100vw"
                    height="100vh"
                    onReady={handleOnReady}
                />
            ) : null}
            {started ? <GameHud onReturnToStart={returnToStartScreen} onClearData={clearGameData} /> : null}
            {!started && !launchMode ? (
                <LandingScreen
                    ready={hydrated && (!playerMounted || playerReady)}
                    completedCount={progressPreview?.completedCount ?? 0}
                    endingsFound={progressPreview?.endingsDiscoveredCount ?? 0}
                    onStart={startStory}
                />
            ) : null}
            {!started && launchMode ? (
                <LoadingScreen title={loadingTitle} detail={loadingDetail} />
            ) : null}
        </div>
    );
}

export default function Page() {
    return (
        <GameProviders>
            <App />
        </GameProviders>
    );
}
