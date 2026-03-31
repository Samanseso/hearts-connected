"use client";

import { useEffect, useRef, useState } from "react";
import { GameProviders, Player, PlayerEventContext, useGame } from "narraleaf-react";
import { LandingScreen } from "@/components/landing-screen";
import { LoadingScreen } from "@/components/loading-screen";
import { SAVE_KEY } from "@/components/game-hud/constants";
import { GameHud } from "@/lib/game-hud";
import { GameDialog } from "@/lib/dialog";
import { GameMenu } from "@/lib/menu";
import { PERSIS_NAMESPACE, type PlayerGender } from "@/lib/persistents";
import {
    clearStoredProgress,
    restoreStoredProgress,
    saveStoredProgress,
    readStoredProgress,
} from "@/lib/progress-storage";
import { story } from "../lib/story";

type LaunchMode = "new" | "continue" | null;

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
    const [hydrated, setHydrated] = useState(false);
    const [playerMounted, setPlayerMounted] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [started, setStarted] = useState(false);
    const [launchMode, setLaunchMode] = useState<LaunchMode>(null);
    const [selectedGender, setSelectedGender] = useState<PlayerGender>("girl");
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
        game.preference.setPreference("cps", 30);
    }, [game]);

    useEffect(() => {
        const storedProgress = readStoredProgress();
        setSelectedGender(storedProgress?.playerGender ?? "girl");
        setProgressPreview(storedProgress);
        setHydrated(true);
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

    function applySelectedGender(liveGame = game.getLiveGame()) {
        liveGame
            .getStorable()
            .getNamespace(PERSIS_NAMESPACE)
            .assign({ playerGender: selectedGender });
    }

    function initializeSession(liveGame = game.getLiveGame()) {
        pendingStartRef.current = false;
        liveGame.newGame();
        restoreStoredProgress(liveGame);
        applySelectedGender(liveGame);
        progressReadyRef.current = true;
        saveStoredProgress(liveGame);
        setProgressPreview(readStoredProgress());
        setStarted(true);
        setLaunchMode(null);
    }

    function startStory() {
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

        progressReadyRef.current = false;
        pendingStartRef.current = false;
        setLaunchMode(null);
        liveGame.newGame();
        restoreStoredProgress(liveGame);
        applySelectedGender(liveGame);
        saveStoredProgress(liveGame);
        setProgressPreview(readStoredProgress());
        setStarted(false);
    }

    function clearGameData() {
        const liveGame = game.getLiveGame();

        progressReadyRef.current = false;
        pendingStartRef.current = false;
        setLaunchMode(null);
        clearStoredProgress();

        if (typeof window !== "undefined") {
            window.localStorage.removeItem(SAVE_KEY);
        }

        liveGame.newGame();
        setSelectedGender("girl");
        setProgressPreview(null);
        setStarted(false);
    }

    function handleOnReady({ liveGame }: PlayerEventContext) {
        setPlayerReady(true);

        if (pendingStartRef.current) {
            initializeSession(liveGame);
        }
    }

    const loadingTitle = launchMode === "continue" ? "Loading your dashboard" : "Preparing your first session";
    const loadingDetail =
        launchMode === "continue"
            ? "Restoring your progress, syncing discovered endings, and reopening the story hub."
            : "Building your save state, setting your perspective, and preparing the story hub.";

    return (
        <div className="relative h-screen w-screen overflow-hidden">
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
                    selectedGender={selectedGender}
                    completedCount={progressPreview?.completedCount ?? 0}
                    endingsFound={progressPreview?.endingsDiscoveredCount ?? 0}
                    onGenderChange={setSelectedGender}
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
