import type { ScenarioId } from "@/lib/persistents";

export type PlayableScenarioId = Exclude<ScenarioId, "hub" | "reflection-mode">;

export type ScenarioMeta = {
    id: PlayableScenarioId;
    shortLabel: string;
    title: string;
    theme: string;
    contentWarning: string;
    summary: string;
    statFocus: string[];
    startingStats: {
        trust: number;
        contentment: number;
        anxiety: number;
        pressure: number;
        selfRespect: number;
        commitment: number;
        communication: number;
    };
};

export const PLAYABLE_SCENARIO_IDS: PlayableScenarioId[] = [
    "social-media-expectations",
    "online-jealousy",
    "peer-pressure",
    "comparison-online",
    "commitment-decisions",
];

export const SCENARIO_META: Record<PlayableScenarioId, ScenarioMeta> = {
    "social-media-expectations": {
        id: "social-media-expectations",
        shortLabel: "Scenario 1",
        title: "Social Media Influence on Relationship Expectations",
        theme: "Authenticity over performance",
        contentWarning: "Relationship pressure, comparison, emotional tension",
        summary: "Alex struggles to separate real affection from online couple culture.",
        statFocus: ["Communication", "Contentment", "Pressure"],
        startingStats: {
            trust: 50,
            contentment: 46,
            anxiety: 54,
            pressure: 60,
            selfRespect: 50,
            commitment: 48,
            communication: 50,
        },
    },
    "online-jealousy": {
        id: "online-jealousy",
        shortLabel: "Scenario 2",
        title: "Online Jealousy and Trust Issues",
        theme: "Trust in the age of endless visibility",
        contentWarning: "Jealousy, insecurity, arguments, emotional withdrawal",
        summary: "Riley has to decide whether insecurity becomes a conversation, a spiral, or a fight.",
        statFocus: ["Trust", "Anxiety", "Communication"],
        startingStats: {
            trust: 45,
            contentment: 48,
            anxiety: 62,
            pressure: 42,
            selfRespect: 47,
            commitment: 50,
            communication: 44,
        },
    },
    "peer-pressure": {
        id: "peer-pressure",
        shortLabel: "Scenario 3",
        title: "Peer Pressure in Dating",
        theme: "Choosing your own pace",
        contentWarning: "Peer pressure, awkward social dynamics, emotional discomfort",
        summary: "Sam weighs social expectations against readiness, honesty, and self-respect.",
        statFocus: ["Self-Respect", "Pressure", "Communication"],
        startingStats: {
            trust: 48,
            contentment: 50,
            anxiety: 40,
            pressure: 64,
            selfRespect: 52,
            commitment: 38,
            communication: 48,
        },
    },
    "comparison-online": {
        id: "comparison-online",
        shortLabel: "Scenario 4",
        title: "Comparing Relationships Online",
        theme: "Contentment versus comparison",
        contentWarning: "Self-doubt, comparison, relationship strain",
        summary: "Jordan tries to understand whether the problem is the relationship or the feed framing it.",
        statFocus: ["Contentment", "Anxiety", "Trust"],
        startingStats: {
            trust: 50,
            contentment: 42,
            anxiety: 58,
            pressure: 45,
            selfRespect: 46,
            commitment: 52,
            communication: 49,
        },
    },
    "commitment-decisions": {
        id: "commitment-decisions",
        shortLabel: "Scenario 5",
        title: "Commitment Decisions",
        theme: "Honesty before certainty",
        contentWarning: "Commitment anxiety, emotional pressure, breakup themes",
        summary: "Casey has to choose between false certainty, honest pacing, and avoidance.",
        statFocus: ["Commitment", "Communication", "Pressure"],
        startingStats: {
            trust: 52,
            contentment: 49,
            anxiety: 48,
            pressure: 54,
            selfRespect: 50,
            commitment: 45,
            communication: 51,
        },
    },
};
