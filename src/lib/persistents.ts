import { Persistent } from "narraleaf-react";
import type { PlayableScenarioId } from "@/lib/game-data";
import {
    createDefaultScenarioGradeRecord,
    createDefaultScenarioScoreRecord,
    type RouteGrade,
} from "@/lib/route-grading";

export type ScenarioId =
    | "hub"
    | "reflection-mode"
    | "social-media-expectations"
    | "online-jealousy"
    | "peer-pressure"
    | "comparison-online"
    | "commitment-decisions"
    | "dating-norms"
    | "digital-support";

export type EndingId =
    | "none"
    | "healthy"
    | "toxic"
    | "breakup"
    | "trust"
    | "conflict"
    | "self-sabotage"
    | "self-respect"
    | "forced"
    | "honest-growth"
    | "contentment"
    | "insecurity"
    | "strain"
    | "pressure"
    | "clarity"
    | "drift"
    | "mismatch"
    | "support"
    | "misread"
    | "distance";

export type PersisData = {
    currentScenario: ScenarioId;
    currentScenarioTitle: string;
    currentScenarioTheme: string;
    currentContentWarning: string;
    currentEnding: EndingId;
    endingTitle: string;
    endingMessage: string;
    endingLesson: string;
    endingQuote: string;
    trust: number;
    contentment: number;
    anxiety: number;
    pressure: number;
    selfRespect: number;
    commitment: number;
    communication: number;
    completedScenarios: PlayableScenarioId[];
    completedCount: number;
    endingGallery: string[];
    endingsDiscoveredCount: number;
    reflectionUnlocked: boolean;
    latestScenarioScore: number;
    latestScenarioGrade: RouteGrade;
    bestScenarioScores: Record<PlayableScenarioId, number>;
    bestScenarioGrades: Record<PlayableScenarioId, RouteGrade>;
};

export const PERSIS_NAMESPACE = "persistent:persis";

export const defaultPersisData: PersisData = {
    currentScenario: "hub",
    currentScenarioTitle: "",
    currentScenarioTheme: "",
    currentContentWarning: "",
    currentEnding: "none",
    endingTitle: "",
    endingMessage: "",
    endingLesson: "",
    endingQuote: "",
    trust: 50,
    contentment: 50,
    anxiety: 50,
    pressure: 50,
    selfRespect: 50,
    commitment: 50,
    communication: 50,
    completedScenarios: [],
    completedCount: 0,
    endingGallery: [],
    endingsDiscoveredCount: 0,
    reflectionUnlocked: false,
    latestScenarioScore: 0,
    latestScenarioGrade: "none",
    bestScenarioScores: createDefaultScenarioScoreRecord(),
    bestScenarioGrades: createDefaultScenarioGradeRecord(),
};

export const persis = new Persistent<PersisData>("persis", defaultPersisData);
