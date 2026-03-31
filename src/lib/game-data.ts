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
    endingCount: number;
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
    "dating-norms",
    "digital-support",
];

export const SCENARIO_META: Record<PlayableScenarioId, ScenarioMeta> = {
    "social-media-expectations": {
        id: "social-media-expectations",
        shortLabel: "Scenario 1",
        title: "Social Media Influence on Relationship Expectations",
        theme: "Authenticity over performance",
        contentWarning: "Relationship pressure, comparison, emotional tension",
        summary: "Alex and Jamie have a real relationship, but online couple culture keeps trying to rewrite what 'special' should look like.",
        statFocus: ["Communication", "Contentment", "Pressure"],
        endingCount: 3,
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
        summary: "Riley sees online clues, fills in the blanks, and has to decide whether fear becomes a question, a spiral, or a fight.",
        statFocus: ["Trust", "Anxiety", "Communication"],
        endingCount: 3,
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
        summary: "Sam has to separate real interest from the pressure of being the last person in the group without a relationship label.",
        statFocus: ["Self-Respect", "Pressure", "Communication"],
        endingCount: 3,
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
        summary: "Jordan wants to know whether the relationship is actually lacking, or whether the feed is teaching dissatisfaction.",
        statFocus: ["Contentment", "Anxiety", "Trust"],
        endingCount: 3,
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
        summary: "Casey and Morgan are not arguing about love, but about timing, clarity, and whether honesty can arrive before silence does.",
        statFocus: ["Commitment", "Communication", "Pressure"],
        endingCount: 3,
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
    "dating-norms": {
        id: "dating-norms",
        shortLabel: "Scenario 6",
        title: "Dating Norms and Mixed Signals",
        theme: "Clarity over assumption",
        contentWarning: "Ambiguity, social pressure, emotional discomfort",
        summary: "Dana and Nico are close, but soft-launch culture and other people's assumptions start defining the relationship before they do.",
        statFocus: ["Communication", "Trust", "Self-Respect"],
        endingCount: 3,
        startingStats: {
            trust: 49,
            contentment: 50,
            anxiety: 52,
            pressure: 55,
            selfRespect: 51,
            commitment: 44,
            communication: 47,
        },
    },
    "digital-support": {
        id: "digital-support",
        shortLabel: "Scenario 7",
        title: "Digital Availability and Emotional Support",
        theme: "Support is not the same as constant access",
        contentWarning: "Stress, emotional neglect, miscommunication",
        summary: "Lea needs comfort during a hard week, but a green online dot starts to feel more meaningful than it really is.",
        statFocus: ["Communication", "Anxiety", "Contentment"],
        endingCount: 3,
        startingStats: {
            trust: 51,
            contentment: 45,
            anxiety: 60,
            pressure: 47,
            selfRespect: 49,
            commitment: 53,
            communication: 46,
        },
    },
};

export const TOTAL_SCENARIOS = PLAYABLE_SCENARIO_IDS.length;

export const TOTAL_ENDINGS = PLAYABLE_SCENARIO_IDS.reduce(
    (total, scenarioId) => total + SCENARIO_META[scenarioId].endingCount,
    0,
);
