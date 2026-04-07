import { Scene } from "narraleaf-react";
import { CHARACTER_GROUPS } from "@/lib/character-data";
import type { PlayableScenarioId } from "@/lib/game-data";

const STORY_BACKGROUND = "transparent";

export const sceneHub = new Scene("hub: relationship scenarios", {
    background: STORY_BACKGROUND,
});

export const sceneResearch = new Scene("extras: research notes", {
    background: STORY_BACKGROUND,
});

export const sceneCharacterDirectory = new Scene("extras: character directory", {
    background: STORY_BACKGROUND,
});

export const sceneAchievementBoard = new Scene("extras: achievement board", {
    background: STORY_BACKGROUND,
});

export const sceneCredits = new Scene("extras: credits", {
    background: STORY_BACKGROUND,
});

export const sceneResult = new Scene("result: scenario ending", {
    background: STORY_BACKGROUND,
});

export const sceneSocialMedia = new Scene("scenario 1: social media expectations", {
    background: STORY_BACKGROUND,
});

export const sceneJealousy = new Scene("scenario 2: online jealousy and trust", {
    background: STORY_BACKGROUND,
});

export const scenePeerPressure = new Scene("scenario 3: peer pressure in dating", {
    background: STORY_BACKGROUND,
});

export const sceneComparison = new Scene("scenario 4: comparing relationships online", {
    background: STORY_BACKGROUND,
});

export const sceneCommitment = new Scene("scenario 5: commitment decisions", {
    background: STORY_BACKGROUND,
});

export const sceneDatingNorms = new Scene("scenario 6: dating norms and mixed signals", {
    background: STORY_BACKGROUND,
});

export const sceneDigitalSupport = new Scene("scenario 7: digital support and availability", {
    background: STORY_BACKGROUND,
});

export const characterScenes = Object.fromEntries(
    CHARACTER_GROUPS.map((group) => [
        group.id,
        new Scene(`character page: ${group.label}`, {
            background: STORY_BACKGROUND,
        }),
    ]),
) as Record<string, Scene>;

export const scenarioSceneMap: Record<PlayableScenarioId, Scene> = {
    "social-media-expectations": sceneSocialMedia,
    "online-jealousy": sceneJealousy,
    "peer-pressure": scenePeerPressure,
    "comparison-online": sceneComparison,
    "commitment-decisions": sceneCommitment,
    "dating-norms": sceneDatingNorms,
    "digital-support": sceneDigitalSupport,
};
