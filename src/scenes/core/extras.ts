import { Condition, Menu } from "narraleaf-react";
import { CHARACTER_GROUPS } from "@/lib/character-data";
import { PLAYABLE_SCENARIO_IDS, SCENARIO_META, TOTAL_ENDINGS, TOTAL_SCENARIOS } from "@/lib/game-data";
import { persis } from "@/lib/persistents";
import { RESEARCH_NOTES } from "@/lib/research-data";
import { createSingleSprite, narra } from "@/scenes/core/cast";
import { resetHubState, setHubPage } from "@/scenes/core/helpers";
import {
    characterScenes,
    scenarioSceneMap,
    sceneAchievementBoard,
    sceneCharacterDirectory,
    sceneCredits,
    sceneHub,
    sceneJealousy,
    scenePeerPressure,
    sceneComparison,
    sceneCommitment,
    sceneDatingNorms,
    sceneDigitalSupport,
    sceneResearch,
    sceneResult,
    sceneSocialMedia,
} from "@/scenes/core/scenes";

function replayCurrentScenario(scene: typeof sceneResult) {
    return Condition.If(
        persis.equals("currentScenario", "social-media-expectations"),
        [scene.jumpTo(sceneSocialMedia)],
    )
        .ElseIf(persis.equals("currentScenario", "online-jealousy"), [scene.jumpTo(sceneJealousy)])
        .ElseIf(persis.equals("currentScenario", "peer-pressure"), [scene.jumpTo(scenePeerPressure)])
        .ElseIf(persis.equals("currentScenario", "comparison-online"), [scene.jumpTo(sceneComparison)])
        .ElseIf(persis.equals("currentScenario", "commitment-decisions"), [scene.jumpTo(sceneCommitment)])
        .ElseIf(persis.equals("currentScenario", "dating-norms"), [scene.jumpTo(sceneDatingNorms)])
        .ElseIf(persis.equals("currentScenario", "digital-support"), [scene.jumpTo(sceneDigitalSupport)])
        .Else([scene.jumpTo(sceneHub)]);
}

export function registerHubAndExtras() {
    const hubSprite = createSingleSprite();
    sceneHub.action((scene) => {
        let menu = Menu.prompt("Choose a story to enter.");

        for (const scenarioId of PLAYABLE_SCENARIO_IDS) {
            const meta = SCENARIO_META[scenarioId];
            menu = menu.choose(meta.title, [scene.jumpTo(scenarioSceneMap[scenarioId])]);
        }


        return [
            resetHubState(),
            hubSprite.show({ duration: 500 }),
            "Story Hub",
            narra`Choose a case study in modern relationships and see how communication, timing, pressure, and self-awareness shift the outcome.`,

            narra.say`Open the dashboard panel for research notes, character files, the achievement board, and credits.`,
            menu,
        ];
    });

    sceneResearch.action((scene) => [
        setHubPage("Research Notes", "Study context and learning goals"),
        "Research Notes",
        narra`These notes translate the thesis concept into a playable anthology focused on social media, trust, and commitment among college-age students.`,
        ...RESEARCH_NOTES.flatMap((note) => [
            note.title,
            ...note.lines.map((line) => narra`${line}`),
        ]),
        Menu.prompt("Where next?")
            .choose("Go to the story hub", [scene.jumpTo(sceneHub)])
            .choose("Meet the characters", [scene.jumpTo(sceneCharacterDirectory)]),
    ]);

    sceneCharacterDirectory.action((scene) => {
        let menu = Menu.prompt("Choose a character page.");

        for (const group of CHARACTER_GROUPS) {
            menu = menu.choose(group.label, [scene.jumpTo(characterScenes[group.id])]);
        }

        menu = menu.choose("Go to the story hub", [scene.jumpTo(sceneHub)]);

        return [
            setHubPage("Character Directory", "Meet the people behind each route"),
            "Character Directory",
            narra`Each profile is short on purpose: enough context to ground the route, while still leaving room for interpretation inside the scene.`,
            menu,
        ];
    });

    for (const group of CHARACTER_GROUPS) {
        characterScenes[group.id].action((scene) => [
            setHubPage(group.label, group.scenarioTitle),
            `${group.label}`,
            narra`${group.hook}`,
            ...group.profiles.flatMap((profile) => [
                `${profile.name} - ${profile.role}`,
                narra`Traits: ${profile.traits}.`,
                narra`${profile.intro}`,
            ]),
            Menu.prompt("What do you want to do next?")
                .choose("Back to the character directory", [scene.jumpTo(sceneCharacterDirectory)])
                .choose("Go to the story hub", [scene.jumpTo(sceneHub)]),
        ]);
    }

    sceneAchievementBoard.action((scene) => [
        setHubPage("Achievement Board", "Progress, grades, and milestones"),
        "Achievement Board",
        narra.say`Stories completed: ${persis.get("completedCount")} of ${TOTAL_SCENARIOS}.`,
        narra.say`Endings discovered: ${persis.get("endingsDiscoveredCount")} of ${TOTAL_ENDINGS}.`,
        narra.say`Latest route score: ${persis.get("latestScenarioScore")} / 100.`,
        narra.say`Latest route grade: ${persis.get("latestScenarioGrade")}.`,
        Condition.If(persis.evaluate("completedCount", (value) => value >= 1), [
            narra`Unlocked: First Reflection - clear any story once.`,
        ]).Else([
            narra`Locked: First Reflection - clear any story once.`,
        ]),
        Condition.If(persis.evaluate("completedCount", (value) => value >= 4), [
            narra`Unlocked: Midway Through the Feed - complete four different stories.`,
        ]).Else([
            narra`Locked: Midway Through the Feed - complete four different stories.`,
        ]),
        Condition.If(persis.evaluate("completedCount", (value) => value >= TOTAL_SCENARIOS), [
            narra`Unlocked: Full Study Set - complete every story in the anthology.`,
        ]).Else([
            narra`Locked: Full Study Set - complete every story in the anthology.`,
        ]),
        Condition.If(
            persis.evaluate(
                "bestScenarioScores",
                (scores) => Object.values(scores).filter((score) => score >= 70).length >= 3,
            ),
            [narra`Unlocked: Open Channel - earn a reflective score in three different stories.`],
        ).Else([
            narra`Locked: Open Channel - earn a reflective score in three different stories.`,
        ]),
        Condition.If(
            persis.evaluate("bestScenarioGrades", (grades) => Object.values(grades).some((grade) => grade === "A")),
            [narra`Unlocked: Grounded Reader - earn at least one A route.`],
        ).Else([
            narra`Locked: Grounded Reader - earn at least one A route.`],
        ),
        Condition.If(persis.evaluate("endingsDiscoveredCount", (value) => value >= 10), [
            narra`Unlocked: Pattern Spotter - discover ten different endings.`,
        ]).Else([
            narra`Locked: Pattern Spotter - discover ten different endings.`,
        ]),
        Menu.prompt("Where next?")
            .choose("Go to the story hub", [scene.jumpTo(sceneHub)])
            .choose("Meet the characters", [scene.jumpTo(sceneCharacterDirectory)]),
    ]);

    sceneCredits.action((scene) => [
        setHubPage("Credits", "Source inspiration and adaptation notes"),
        "Credits",
        narra`Research inspiration: "A Correlational Study: Social Media Exposure and Students' Attitude Towards Romantic Commitment at Our Lady of Guadalupe Colleges."`,
        narra`Student researchers listed in the proposal: Margotte Audrey Avery G. Barsaga, Aizen R. Corpuz, Zohra Haider L. Janjua, and Cherrymer S. Onato.`,
        narra`Adviser listed in the proposal: Mr. Bob Jimenez.`,
        narra`This build adapts the proposal's themes into a short, thesis-friendly anthology with route grading, story tracking, and character/context pages.`,
        Menu.prompt("Where next?")
            .choose("Go to the story hub", [scene.jumpTo(sceneHub)])
            .choose("Read the research notes", [scene.jumpTo(sceneResearch)]),
    ]);

    const resultSprite = createSingleSprite();
    sceneResult.action((scene) => [
        resultSprite.show({ duration: 500 }),
        narra`Scenario complete.`,
        narra.say`Story: ${persis.get("currentScenarioTitle")}`,
        narra.say`Ending: ${persis.get("endingTitle")}`,
        narra.say`${persis.get("endingMessage")}`,
        narra.say`Takeaway: ${persis.get("endingLesson")}`,
        narra.say`Final thought: "${persis.get("endingQuote")}"`,
        narra.say`Route score: ${persis.get("latestScenarioScore")} / 100`,
        narra.say`Route grade: ${persis.get("latestScenarioGrade")}`,
        narra.say`Trust ${persis.get("trust")}, Communication ${persis.get("communication")}, Contentment ${persis.get("contentment")}.`,
        narra.say`Anxiety ${persis.get("anxiety")}, Pressure ${persis.get("pressure")}, Self-Respect ${persis.get("selfRespect")}, Commitment ${persis.get("commitment")}.`,
        Menu.prompt("What would you like to do next?")
            .choose("Replay this scenario", [replayCurrentScenario(scene)])
            .choose("Return to the story hub", [scene.jumpTo(sceneHub)]),
    ]);
}



