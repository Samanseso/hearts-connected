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

type SpriteLayout = {
    xalign: number;
    yalign: number;
    zoom: number;
};

export type SpriteSwapMotion = {
    duration: number;
    xOffset: number;
};

// Scene 1 uses custom portrait art, so keep the layout values separate and easy to tweak.
// If Alex feels too large, lower `zoom`. If he is too far left/right or too high/low,
// adjust `xalign` and `yalign`.
export const scene1SpriteLayout: Record<"alex" | "jamie", SpriteLayout> = {
    alex: {
        xalign: 0.25,
        yalign: 0.40,
        zoom: 0.5,
    },
    jamie: {
        xalign: 0.73,
        yalign: 0.40,
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

// Expression swaps feel better with a slight inward drift instead of a hard pop.
// Negative offset means the next sprite starts farther left; positive starts farther right.
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
        position: {
            xalign: 0.5,
            yalign: 0.42,
        },
        zoom: 0.6,
    });
}

export function createPairSprites() {
    return [
        new Image({
            src: "/char/narra.png",
            position: {
                xalign: 0.28,
                yalign: 0.44,
            },
            zoom: 0.52,
        }),
        new Image({
            src: "/char/narra.png",
            position: {
                xalign: 0.72,
                yalign: 0.44,
            },
            zoom: 0.52,
        }),
    ] as const;
}

export function createScene1SpritePair() {
    return [
        new Image({
            name: "Alex Scene 1 Sprite",
            src: scene1AlexExpressions.insecure,
            position: {
                xalign: scene1SpriteLayout.alex.xalign,
                yalign: scene1SpriteLayout.alex.yalign,
            },
            zoom: scene1SpriteLayout.alex.zoom,
        }),
        new Image({
            name: "Jamie Scene 1 Sprite",
            src: scene1JamieExpressions.warm,
            position: {
                xalign: scene1SpriteLayout.jamie.xalign,
                yalign: scene1SpriteLayout.jamie.yalign,
            },
            zoom: scene1SpriteLayout.jamie.zoom,
        }),
    ] as const;
}

export function createScene2SpritePair() {
    return [
        new Image({
            name: "Riley Scene 2 Sprite",
            src: scene2RileyExpressions.neutral,
            position: {
                xalign: scene2SpriteLayout.riley.xalign,
                yalign: scene2SpriteLayout.riley.yalign,
            },
            zoom: scene2SpriteLayout.riley.zoom,
        }),
        new Image({
            name: "Chris Scene 2 Sprite",
            src: scene2ChrisExpressions.friendly,
            position: {
                xalign: scene2SpriteLayout.chris.xalign,
                yalign: scene2SpriteLayout.chris.yalign,
            },
            zoom: scene2SpriteLayout.chris.zoom,
        }),
    ] as const;
}
