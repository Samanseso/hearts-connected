import type { PersisData } from "@/lib/persistents";

export const SAVE_KEY = "hearts-connected-quick-save";

export type HudStatKey = keyof Pick<
    PersisData,
    "trust" | "communication" | "contentment" | "anxiety" | "pressure" | "selfRespect" | "commitment"
>;

export const STAT_LABELS: Record<HudStatKey, string> = {
    trust: "Trust",
    communication: "Communication",
    contentment: "Contentment",
    anxiety: "Anxiety",
    pressure: "Pressure",
    selfRespect: "Self-Respect",
    commitment: "Commitment",
};

export const STAT_ORDER: HudStatKey[] = [
    "trust",
    "communication",
    "contentment",
    "anxiety",
    "pressure",
    "selfRespect",
    "commitment",
];
