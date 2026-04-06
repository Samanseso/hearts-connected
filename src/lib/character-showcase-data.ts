import { CHARACTER_GROUPS, type CharacterGroup } from "@/lib/character-data";
import type { PlayableScenarioId } from "@/lib/game-data";

type CharacterProfile = CharacterGroup["profiles"][number];

export type CharacterExpression = {
    id: string;
    label: string;
    src: string;
};

export type CharacterShowcaseCharacter = CharacterProfile & {
    expressions: CharacterExpression[];
};

export type CharacterShowcaseGroup = CharacterGroup & {
    scenarioId: PlayableScenarioId;
    characters: CharacterShowcaseCharacter[];
};

function buildExpressions(sceneNumber: number, characterId: string, labels: string[]) {
    return labels.map((label, index) => ({
        id: characterId + "-" + (index + 1),
        label,
        src: "/asset/characters/scene" + sceneNumber + "/" + characterId + "_" + (index + 1) + ".png",
    }));
}

const groupMap = new Map(CHARACTER_GROUPS.map((group) => [group.id, group]));

function getGroup(groupId: string) {
    const group = groupMap.get(groupId);

    if (!group) {
        throw new Error("Unknown character group: " + groupId);
    }

    return group;
}

function createShowcaseGroup(
    groupId: string,
    scenarioId: PlayableScenarioId,
    expressionsByName: Record<string, CharacterExpression[]>,
): CharacterShowcaseGroup {
    const group = getGroup(groupId);

    return {
        ...group,
        scenarioId,
        characters: group.profiles.map((profile) => ({
            ...profile,
            expressions: expressionsByName[profile.name] ?? [],
        })),
    };
}

export const CHARACTER_SHOWCASES: CharacterShowcaseGroup[] = [
    createShowcaseGroup("alex-jamie", "social-media-expectations", {
        Alex: buildExpressions(1, "alex", ["Neutral", "Insecure", "Sharp", "Honest", "Open", "Bittersweet"]),
        Jamie: buildExpressions(1, "jamie", ["Warm", "Concerned", "Hurt", "Boundary", "Open-hearted", "Sad"]),
    }),
    createShowcaseGroup("riley-chris", "online-jealousy", {
        Riley: buildExpressions(2, "riley", ["Neutral", "Anxious", "Vulnerable", "Retreating", "Angry", "Repair"]),
        Chris: buildExpressions(2, "chris", ["Friendly", "Confused", "Reassuring", "Defensive", "Hurt", "Open"]),
    }),
    createShowcaseGroup("sam-taylor", "peer-pressure", {
        Sam: buildExpressions(3, "sam", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
        Taylor: buildExpressions(3, "taylor", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
    }),
    createShowcaseGroup("jordan-reese", "comparison-online", {
        Jordan: buildExpressions(4, "jordan", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
        Reese: buildExpressions(4, "reese", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
    }),
    createShowcaseGroup("casey-morgan", "commitment-decisions", {
        Casey: buildExpressions(5, "casey", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
        Morgan: buildExpressions(5, "morgan", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
    }),
    createShowcaseGroup("dana-nico", "dating-norms", {
        Dana: buildExpressions(6, "dana", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
        Nico: buildExpressions(6, "nico", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
    }),
    createShowcaseGroup("lea-micah", "digital-support", {
        Lea: buildExpressions(7, "lea", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
        Micah: buildExpressions(7, "micah", ["Neutral", "Concerned", "Upset", "Serious", "Open", "Soft"]),
    }),
];
