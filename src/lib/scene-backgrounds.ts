import type { PlayableScenarioId } from "@/lib/game-data";
import type { ScenarioId } from "@/lib/persistents";

export const DEFAULT_SHELL_BACKGROUND = "/asset/background.png";

export const SCENE_BACKGROUNDS: Record<PlayableScenarioId, string> = {
    "social-media-expectations": "/asset/scene_backgrounds/s1.webp",
    "online-jealousy": "/asset/scene_backgrounds/s2.webp",
    "peer-pressure": "/asset/scene_backgrounds/s3.png",
    "comparison-online": "/asset/scene_backgrounds/s4.png",
    "commitment-decisions": "/asset/scene_backgrounds/s5.png",
    "dating-norms": "/asset/scene_backgrounds/s6.webp",
    "digital-support": "/asset/scene_backgrounds/s7.webp",
};

export function getSceneShellBackground(scenarioId: ScenarioId) {
    if (scenarioId in SCENE_BACKGROUNDS) {
        return SCENE_BACKGROUNDS[scenarioId as PlayableScenarioId];
    }

    return DEFAULT_SHELL_BACKGROUND;
}
