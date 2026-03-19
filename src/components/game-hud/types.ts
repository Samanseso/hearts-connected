import type { PersisData } from "@/lib/persistents";

export type HudSnapshot = {
    persis: PersisData;
    autoForward: boolean;
    cps: number;
    hasSave: boolean;
};

export type SpeedMode = "slow" | "normal" | "fast";
