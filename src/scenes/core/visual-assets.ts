import { SCENE_BACKGROUNDS } from "@/lib/scene-backgrounds";

function buildSceneAssets(sceneNumber: number, characterIds: string[]) {
    return characterIds.flatMap((characterId) =>
        Array.from({ length: 6 }, (_, index) =>
            "/asset/characters/scene" + sceneNumber + "/" + characterId + "_" + (index + 1) + ".png",
        ),
    );
}

export const preloadVisualAssets = Array.from(
    new Set([
        "/asset/background.png",
        "/char/narra.png",
        ...Object.values(SCENE_BACKGROUNDS),
        ...buildSceneAssets(1, ["alex", "jamie"]),
        ...buildSceneAssets(2, ["riley", "chris"]),
        ...buildSceneAssets(3, ["sam", "taylor"]),
        ...buildSceneAssets(4, ["jordan", "reese"]),
        ...buildSceneAssets(5, ["casey", "morgan"]),
        ...buildSceneAssets(6, ["dana", "nico"]),
        ...buildSceneAssets(7, ["lea", "micah"]),
    ]),
);
