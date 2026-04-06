"use client";

import { useEffect, useMemo, useState } from "react";
import { useGame } from "narraleaf-react";
import { SAVE_KEY } from "@/components/game-hud/constants";
import { SettingsPanel } from "@/components/game-hud/settings-panel";
import { SceneAudioPlayer } from "@/components/scene-audio-player";
import { StoryInfoPanel } from "@/components/game-hud/story-info-panel";
import { CharacterShowcaseScreen } from "@/components/game-hud/character-showcase-screen";
import { StoryInfoToggle } from "@/components/game-hud/story-info-toggle";
import type { SpeedMode } from "@/components/game-hud/types";
import { useHudSnapshot } from "@/components/game-hud/use-hud-snapshot";
import { SCENARIO_META } from "@/lib/game-data";
import { clearStoredProgress } from "@/lib/progress-storage";

type GameHudProps = {
    onReturnToStart?: () => void;
    onClearData?: () => void;
};

export function GameHud({ onReturnToStart, onClearData }: GameHudProps) {
    const game = useGame();
    const { snapshot, refreshSnapshot } = useHudSnapshot(game);
    const [infoOpen, setInfoOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [characterShowcaseOpen, setCharacterShowcaseOpen] = useState(false);

    const { persis } = snapshot;
    const currentMeta = useMemo(() => {
        if (
            persis.currentScenario === "hub" ||
            persis.currentScenario === "reflection-mode"
        ) {
            return null;
        }

        return SCENARIO_META[persis.currentScenario];
    }, [persis.currentScenario]);

    const completedCount = persis.completedCount;
    const endingsFound = persis.endingsDiscoveredCount;
    const infoTitle = currentMeta
        ? currentMeta.shortLabel
        : persis.currentScenarioTitle || "Story Hub";
    const infoIcon = currentMeta ? "/asset/Icons/PinkHeart.png" : "/asset/Icons/BlueHeart.png";

    useEffect(() => {
        const isDashboardScene =
            persis.currentScenario === "hub" || persis.currentScenario === "reflection-mode";
        

        // Automatically open infor panel after loading
        // setInfoOpen(isDashboardScene);
    }, [persis.currentScenario]);

    function openCharacterShowcase() {
        setCharacterShowcaseOpen(true);
        setInfoOpen(false);
        setSettingsOpen(false);
    }

    function closeCharacterShowcase() {
        setCharacterShowcaseOpen(false);
    }

    function quickSave() {
        try {
            const liveGame = game.getLiveGame();
            window.localStorage.setItem(SAVE_KEY, JSON.stringify(liveGame.serialize()));
            liveGame.notify("Quick1 save updated.");
            refreshSnapshot();
        } catch {
            game.getLiveGame().notify("Quick save failed.");
        }
    }

    function quickLoad() {
        const raw = window.localStorage.getItem(SAVE_KEY);

        if (!raw) {
            game.getLiveGame().notify("No quick save found.");
            return;
        }

        try {
            game.getLiveGame().deserialize(JSON.parse(raw));
            game.getLiveGame().notify("Quick save loaded.");
            setSettingsOpen(false);
            refreshSnapshot();
        } catch {
            game.getLiveGame().notify("Quick load failed.");
        }
    }

    function restartStory() {
        if (onReturnToStart) {
            onReturnToStart();
            setSettingsOpen(false);
            refreshSnapshot();
            return;
        }

        game.getLiveGame().newGame();
        game.getLiveGame().notify("Story restarted.");
        setSettingsOpen(false);
        refreshSnapshot();
    }

    function clearGameData() {
        setSettingsOpen(false);

        if (onClearData) {
            onClearData();
            return;
        }

        try {
            window.localStorage.removeItem(SAVE_KEY);
            clearStoredProgress();
            game.getLiveGame().newGame();
            game.getLiveGame().notify("Saved game data cleared.");
            refreshSnapshot();
        } catch {
            game.getLiveGame().notify("Could not clear saved data.");
        }
    }

    function toggleAutoForward() {
        game.preference.togglePreference("autoForward");
        refreshSnapshot();
    }

    function setSpeed(mode: SpeedMode) {
        const cps = mode === "slow" ? 18 : mode === "normal" ? 30 : 46;
        game.preference.setPreference("cps", cps);
        refreshSnapshot();
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-20 p-5">
            <div className="absolute left-0 top-0 flex w-full items-start justify-between gap-3 p-5">
                <div className="pointer-events-auto flex shrink-0 flex-col items-start gap-3 sm:w-auto">
                    <StoryInfoToggle
                        title={infoTitle}
                        icon={infoIcon}
                        open={infoOpen}
                        onClick={() => setInfoOpen((value) => !value)}
                    />

                    {infoOpen && (
                        <StoryInfoPanel
                            currentMeta={currentMeta}
                            persis={persis}
                            completedCount={completedCount}
                            endingsFound={endingsFound}
                            title={infoTitle}
                            icon={infoIcon}
                            onOpenCharacters={openCharacterShowcase}
                        />
                    )}
                </div>

                <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-3">
                    <button
                        type="button"
                        onClick={() => setSettingsOpen((value) => !value)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-[0_16px_36px_rgba(47,31,40,0.2)] transition-transform hover:scale-[1.03]"
                    >
                        <span
                            className="h-7 w-7 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/asset/Icons/Settings.png')" }}
                        />
                    </button>

                    <SceneAudioPlayer
                        currentScenario={persis.currentScenario}
                        currentEnding={persis.currentEnding}
                    />

                    {settingsOpen ? (
                        <SettingsPanel
                            snapshot={snapshot}
                            onSave={quickSave}
                            onLoad={quickLoad}
                            onRestart={restartStory}
                            onClearData={clearGameData}
                            onToggleAutoForward={toggleAutoForward}
                            onSetSpeed={setSpeed}
                        />
                    ) : null}
                </div>
            </div>

            {characterShowcaseOpen ? (
                <CharacterShowcaseScreen
                    persis={persis}
                    onClose={closeCharacterShowcase}
                />
            ) : null}
        </div>
    );
}
