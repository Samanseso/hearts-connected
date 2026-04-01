import { Character, Image } from "narraleaf-react";

export const narra = new Character("Narra");

export const alex = new Character("Alex");
export const jamie = new Character("Jamie");

export const riley = new Character("Riley");
export const chris = new Character("Chris");

export const sam = new Character("Sam");
export const taylor = new Character("Taylor");

export const jordan = new Character("Jordan");
export const reese = new Character("Reese");

export const casey = new Character("Casey");
export const morgan = new Character("Morgan");

export const dana = new Character("Dana");
export const nico = new Character("Nico");

export const lea = new Character("Lea");
export const micah = new Character("Micah");

type SpriteLayout = {
    xalign: number;
    yalign: number;
    zoom: number;
};

type GenericExpressionSet = {
    neutral: string;
    concern: string;
    upset: string;
    serious: string;
    open: string;
    soft: string;
};

export type SpriteSwapMotion = {
    duration: number;
    xOffset: number;
};

function buildGenericExpressionSet(sceneNumber: number, characterId: string): GenericExpressionSet {
    return {
        neutral: `/asset/characters/scene${sceneNumber}/${characterId}_1.png`,
        concern: `/asset/characters/scene${sceneNumber}/${characterId}_2.png`,
        upset: `/asset/characters/scene${sceneNumber}/${characterId}_3.png`,
        serious: `/asset/characters/scene${sceneNumber}/${characterId}_4.png`,
        open: `/asset/characters/scene${sceneNumber}/${characterId}_5.png`,
        soft: `/asset/characters/scene${sceneNumber}/${characterId}_6.png`,
    };
}

function buildSpriteAssetList(...sets: Array<Record<string, string>>) {
    return sets.flatMap((set) => Object.values(set));
}

function createSprite(name: string, src: string, layout: SpriteLayout) {
    return new Image({
        name,
        src,
        autoFit: false,
        position: {
            xalign: layout.xalign,
            yalign: layout.yalign,
        },
        zoom: layout.zoom,
    });
}

function createSpritePair(
    leftName: string,
    leftSrc: string,
    leftLayout: SpriteLayout,
    rightName: string,
    rightSrc: string,
    rightLayout: SpriteLayout,
) {
    return [
        createSprite(leftName, leftSrc, leftLayout),
        createSprite(rightName, rightSrc, rightLayout),
    ] as const;
}

export const scene1AlexExpressions = {
    neutral: "/asset/characters/scene1/alex_1.png",
    insecure: "/asset/characters/scene1/alex_2.png",
    sharp: "/asset/characters/scene1/alex_3.png",
    honest: "/asset/characters/scene1/alex_4.png",
    open: "/asset/characters/scene1/alex_5.png",
    bittersweet: "/asset/characters/scene1/alex_6.png",
} as const;

export const scene1JamieExpressions = {
    warm: "/asset/characters/scene1/jamie_1.png",
    concern: "/asset/characters/scene1/jamie_2.png",
    hurt: "/asset/characters/scene1/jamie_3.png",
    boundary: "/asset/characters/scene1/jamie_4.png",
    open: "/asset/characters/scene1/jamie_5.png",
    sad: "/asset/characters/scene1/jamie_6.png",
} as const;

export const scene2RileyExpressions = {
    neutral: "/asset/characters/scene2/riley_1.png",
    anxious: "/asset/characters/scene2/riley_2.png",
    vulnerable: "/asset/characters/scene2/riley_3.png",
    retreat: "/asset/characters/scene2/riley_4.png",
    angry: "/asset/characters/scene2/riley_5.png",
    repair: "/asset/characters/scene2/riley_6.png",
} as const;

export const scene2ChrisExpressions = {
    friendly: "/asset/characters/scene2/chris_1.png",
    confused: "/asset/characters/scene2/chris_2.png",
    reassuring: "/asset/characters/scene2/chris_3.png",
    defensive: "/asset/characters/scene2/chris_4.png",
    hurt: "/asset/characters/scene2/chris_5.png",
    open: "/asset/characters/scene2/chris_6.png",
} as const;

export const scene3SamExpressions = buildGenericExpressionSet(3, "sam");
export const scene3TaylorExpressions = buildGenericExpressionSet(3, "taylor");

export const scene4JordanExpressions = buildGenericExpressionSet(4, "jordan");
export const scene4ReeseExpressions = buildGenericExpressionSet(4, "reese");

export const scene5CaseyExpressions = buildGenericExpressionSet(5, "casey");
export const scene5MorganExpressions = buildGenericExpressionSet(5, "morgan");

export const scene6DanaExpressions = buildGenericExpressionSet(6, "dana");
export const scene6NicoExpressions = buildGenericExpressionSet(6, "nico");

export const scene7LeaExpressions = buildGenericExpressionSet(7, "lea");
export const scene7MicahExpressions = buildGenericExpressionSet(7, "micah");

export const scene1SpriteAssets = buildSpriteAssetList(scene1AlexExpressions, scene1JamieExpressions);
export const scene2SpriteAssets = buildSpriteAssetList(scene2RileyExpressions, scene2ChrisExpressions);
export const scene3SpriteAssets = buildSpriteAssetList(scene3SamExpressions, scene3TaylorExpressions);
export const scene4SpriteAssets = buildSpriteAssetList(scene4JordanExpressions, scene4ReeseExpressions);
export const scene5SpriteAssets = buildSpriteAssetList(scene5CaseyExpressions, scene5MorganExpressions);
export const scene6SpriteAssets = buildSpriteAssetList(scene6DanaExpressions, scene6NicoExpressions);
export const scene7SpriteAssets = buildSpriteAssetList(scene7LeaExpressions, scene7MicahExpressions);

export const scene1SpriteLayout: Record<"alex" | "jamie", SpriteLayout> = {
    alex: {
        xalign: 0.25,
        yalign: 0.4,
        zoom: 0.5,
    },
    jamie: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.5,
    },
};

export const scene2SpriteLayout: Record<"riley" | "chris", SpriteLayout> = {
    riley: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.5,
    },
    chris: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.5,
    },
};

export const scene3SpriteLayout: Record<"sam" | "taylor", SpriteLayout> = {
    sam: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.5,
    },
    taylor: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.5,
    },
};

export const scene4SpriteLayout: Record<"jordan" | "reese", SpriteLayout> = {
    jordan: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.5,
    },
    reese: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.5,
    },
};

export const scene5SpriteLayout: Record<"casey" | "morgan", SpriteLayout> = {
    casey: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.52,
    },
    morgan: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.52,
    },
};

export const scene6SpriteLayout: Record<"dana" | "nico", SpriteLayout> = {
    dana: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.52,
    },
    nico: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.52,
    },
};

export const scene7SpriteLayout: Record<"lea" | "micah", SpriteLayout> = {
    lea: {
        xalign: 0.27,
        yalign: 0.4,
        zoom: 0.52,
    },
    micah: {
        xalign: 0.73,
        yalign: 0.4,
        zoom: 0.52,
    },
};

export const scene1SpriteSwapMotion: Record<"alex" | "jamie", SpriteSwapMotion> = {
    alex: {
        duration: 160,
        xOffset: -36,
    },
    jamie: {
        duration: 180,
        xOffset: 36,
    },
};

export const scene2SpriteSwapMotion: Record<"riley" | "chris", SpriteSwapMotion> = {
    riley: {
        duration: 170,
        xOffset: -34,
    },
    chris: {
        duration: 170,
        xOffset: 34,
    },
};

export function createSingleSprite() {
    return new Image({
        src: "/char/narra.png",
        autoFit: false,
        position: {
            xalign: 0.5,
            yalign: 0.42,
        },
        zoom: 0.6,
    });
}

export function createScene1SpritePair() {
    return createSpritePair(
        "Alex Scene 1 Sprite",
        scene1AlexExpressions.insecure,
        scene1SpriteLayout.alex,
        "Jamie Scene 1 Sprite",
        scene1JamieExpressions.warm,
        scene1SpriteLayout.jamie,
    );
}

export function createScene2SpritePair() {
    return createSpritePair(
        "Riley Scene 2 Sprite",
        scene2RileyExpressions.neutral,
        scene2SpriteLayout.riley,
        "Chris Scene 2 Sprite",
        scene2ChrisExpressions.friendly,
        scene2SpriteLayout.chris,
    );
}

export function createScene3SpritePair() {
    return createSpritePair(
        "Sam Scene 3 Sprite",
        scene3SamExpressions.neutral,
        scene3SpriteLayout.sam,
        "Taylor Scene 3 Sprite",
        scene3TaylorExpressions.neutral,
        scene3SpriteLayout.taylor,
    );
}

export function createScene4SpritePair() {
    return createSpritePair(
        "Jordan Scene 4 Sprite",
        scene4JordanExpressions.neutral,
        scene4SpriteLayout.jordan,
        "Reese Scene 4 Sprite",
        scene4ReeseExpressions.neutral,
        scene4SpriteLayout.reese,
    );
}

export function createScene5SpritePair() {
    return createSpritePair(
        "Casey Scene 5 Sprite",
        scene5CaseyExpressions.neutral,
        scene5SpriteLayout.casey,
        "Morgan Scene 5 Sprite",
        scene5MorganExpressions.neutral,
        scene5SpriteLayout.morgan,
    );
}

export function createScene6SpritePair() {
    return createSpritePair(
        "Dana Scene 6 Sprite",
        scene6DanaExpressions.neutral,
        scene6SpriteLayout.dana,
        "Nico Scene 6 Sprite",
        scene6NicoExpressions.neutral,
        scene6SpriteLayout.nico,
    );
}

export function createScene7SpritePair() {
    return createSpritePair(
        "Lea Scene 7 Sprite",
        scene7LeaExpressions.neutral,
        scene7SpriteLayout.lea,
        "Micah Scene 7 Sprite",
        scene7MicahExpressions.neutral,
        scene7SpriteLayout.micah,
    );
}
