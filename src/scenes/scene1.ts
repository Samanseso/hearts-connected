import { Character, Condition, Image, Menu, Scene } from "narraleaf-react";
import { PLAYABLE_SCENARIO_IDS, SCENARIO_META, type PlayableScenarioId } from "@/lib/game-data";
import { defaultPersisData, persis, type EndingId, type PersisData } from "@/lib/persistents";

type StatKey = keyof Pick<
    PersisData,
    "trust" | "contentment" | "anxiety" | "pressure" | "selfRespect" | "commitment" | "communication"
>;

type StatDelta = Partial<Record<StatKey, number>>;

type EndingContent = {
    endingId: EndingId;
    endingTitle: string;
    endingMessage: string;
    endingLesson: string;
    endingQuote: string;
};

const STAT_KEYS: StatKey[] = [
    "trust",
    "contentment",
    "anxiety",
    "pressure",
    "selfRespect",
    "commitment",
    "communication",
];

const narra = new Character("Narra");

const alex = new Character("Alex");
const jamie = new Character("Jamie");

const riley = new Character("Riley");
const chris = new Character("Chris");

const sam = new Character("Sam");
const taylor = new Character("Taylor");

const jordan = new Character("Jordan");
const partner = new Character("Partner");

const casey = new Character("Casey");
const morgan = new Character("Morgan");

function createSingleSprite() {
    return new Image({
        src: "/char/narra.png",
        position: {
            xalign: 0.5,
            yalign: 0.42,
        },
        zoom: 0.6,
    });
}

function createPairSprites() {
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

function clampStat(value: number) {
    return Math.max(0, Math.min(100, value));
}

function resetScenarioState(scenarioId: PlayableScenarioId) {
    const meta = SCENARIO_META[scenarioId];

    return persis.assign((value) => ({
        currentScenario: scenarioId,
        currentScenarioTitle: meta.title,
        currentScenarioTheme: meta.theme,
        currentContentWarning: meta.contentWarning,
        currentEnding: "none",
        endingTitle: "",
        endingMessage: "",
        endingLesson: "",
        endingQuote: "",
        completedScenarios: Array.isArray(value.completedScenarios)
            ? value.completedScenarios
            : [],
        endingGallery: Array.isArray(value.endingGallery)
            ? value.endingGallery
            : [],
        reflectionUnlocked: Boolean(value.reflectionUnlocked),
        ...meta.startingStats,
    }));
}

function resetHubState() {
    return persis.assign((value) => ({
        currentScenario: "hub",
        currentScenarioTitle: "",
        currentScenarioTheme: "",
        currentContentWarning: "",
        currentEnding: "none",
        endingTitle: "",
        endingMessage: "",
        endingLesson: "",
        endingQuote: "",
        completedScenarios: Array.isArray(value.completedScenarios)
            ? value.completedScenarios
            : [],
        endingGallery: Array.isArray(value.endingGallery)
            ? value.endingGallery
            : [],
        reflectionUnlocked: Boolean(value.reflectionUnlocked),
        trust: defaultPersisData.trust,
        contentment: defaultPersisData.contentment,
        anxiety: defaultPersisData.anxiety,
        pressure: defaultPersisData.pressure,
        selfRespect: defaultPersisData.selfRespect,
        commitment: defaultPersisData.commitment,
        communication: defaultPersisData.communication,
    }));
}

function adjustStats(changes: StatDelta) {
    return persis.assign((value) => {
        const next: Partial<PersisData> = {};

        for (const key of STAT_KEYS) {
            const delta = changes[key];

            if (typeof delta === "number") {
                next[key] = clampStat(value[key] + delta);
            }
        }

        return next;
    });
}

function finishScenario(
    scene: Scene,
    scenarioId: PlayableScenarioId,
    ending: EndingContent,
    finalStatChanges: StatDelta = {},
) {
    const meta = SCENARIO_META[scenarioId];
    return [
        adjustStats(finalStatChanges),
        // Keep the ending metadata and route completion in one persistent write.
        
        persis.assign((value) => {
            const existingCompletedScenarios = Array.isArray(value.completedScenarios)
                ? value.completedScenarios
                : [];
            const existingEndingGallery = Array.isArray(value.endingGallery)
                ? value.endingGallery
                : [];
            const completedScenarios = existingCompletedScenarios.includes(scenarioId)
                ? existingCompletedScenarios
                : [...existingCompletedScenarios, scenarioId];
            const galleryKey = `${scenarioId}:${ending.endingId}`;
            const endingGallery = existingEndingGallery.includes(galleryKey)
                ? existingEndingGallery
                : [...existingEndingGallery, galleryKey];

            return {
                currentScenario: scenarioId,
                currentScenarioTitle: meta.title,
                currentScenarioTheme: meta.theme,
                currentContentWarning: meta.contentWarning,
                currentEnding: ending.endingId,
                endingTitle: ending.endingTitle,
                endingMessage: ending.endingMessage,
                endingLesson: ending.endingLesson,
                endingQuote: ending.endingQuote,
                completedScenarios,
                endingGallery,
                reflectionUnlocked: PLAYABLE_SCENARIO_IDS.every((id) => completedScenarios.includes(id)),
            };
        }),
        scene.jumpTo(sceneResult),
    ];
}

function scenarioIntro(scenarioId: PlayableScenarioId) {
    const meta = SCENARIO_META[scenarioId];

    return [
        resetScenarioState(scenarioId),
        `${meta.shortLabel}: ${meta.title}`,
        narra`Theme: ${meta.theme}.`,
        narra`Content Note: ${meta.contentWarning}.`,
        narra`${meta.summary}`,
        narra`Focus stats: ${meta.statFocus.join(", ")}.`,
    ];
}

const sceneHub = new Scene("hub: relationship scenarios", {
    background: "/asset/HomeScreen/HomeScreenBackground.jpg",
});

const sceneResult = new Scene("result: scenario ending", {
    background: "/asset/Background.jpg",
});

const sceneReflection = new Scene("bonus: reflection mode", {
    background: "/asset/HomeScreen/HomeScreenBackground.jpg",
});

const sceneSocialMedia = new Scene("scenario 1: social media expectations", {
    background: "/asset/Background.jpg",
});

const sceneJealousy = new Scene("scenario 2: online jealousy and trust", {
    background: "/asset/Background.jpg",
});

const scenePeerPressure = new Scene("scenario 3: peer pressure in dating", {
    background: "/asset/Background.jpg",
});

const sceneComparison = new Scene("scenario 4: comparing relationships online", {
    background: "/asset/Background.jpg",
});

const sceneCommitment = new Scene("scenario 5: commitment decisions", {
    background: "/asset/Background.jpg",
});

function replayCurrentScenario(scene: Scene) {
    return Condition.If(
        persis.equals("currentScenario", "social-media-expectations"),
        [scene.jumpTo(sceneSocialMedia)],
    )
        .ElseIf(
            persis.equals("currentScenario", "online-jealousy"),
            [scene.jumpTo(sceneJealousy)],
        )
        .ElseIf(
            persis.equals("currentScenario", "peer-pressure"),
            [scene.jumpTo(scenePeerPressure)],
        )
        .ElseIf(
            persis.equals("currentScenario", "comparison-online"),
            [scene.jumpTo(sceneComparison)],
        )
        .ElseIf(
            persis.equals("currentScenario", "commitment-decisions"),
            [scene.jumpTo(sceneCommitment)],
        )
        .ElseIf(
            persis.equals("currentScenario", "reflection-mode"),
            [scene.jumpTo(sceneReflection)],
        )
        .Else([scene.jumpTo(sceneHub)]);
}

const hubSprite = createSingleSprite();
sceneHub.action((scene) => [
    resetHubState(),
    hubSprite.show({ duration: 500 }),
    "Hearts Connected is an anthology of modern relationship stories shaped by social media, trust, peer pressure, comparison, and commitment.",
    narra`Choose a scenario and see how communication, pressure, and self-awareness shape the outcome.`,
    Condition.If(persis.isTrue("reflectionUnlocked"), [
        narra`Reflection Mode is unlocked. You've completed every main scenario at least once.`,
    ]).Else([
        narra`Finish all five core scenarios to unlock the bonus reflection epilogue.`,
    ]),
    Menu.prompt("Which story do you want to explore?")
        .choose("1. Social Media Influence", [
            scene.jumpTo(sceneSocialMedia),
        ])
        .choose("2. Online Jealousy and Trust", [
            scene.jumpTo(sceneJealousy),
        ])
        .choose("3. Peer Pressure in Dating", [
            scene.jumpTo(scenePeerPressure),
        ])
        .choose("4. Comparing Relationships Online", [
            scene.jumpTo(sceneComparison),
        ])
        .choose("5. Commitment Decisions", [
            scene.jumpTo(sceneCommitment),
        ])
        .showWhen(persis.isTrue("reflectionUnlocked"), "Bonus Epilogue: Reflection Mode", [
            scene.jumpTo(sceneReflection),
        ]),
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
    narra.say`Trust ${persis.get("trust")}, Communication ${persis.get("communication")}, Contentment ${persis.get("contentment")}.`,
    narra.say`Anxiety ${persis.get("anxiety")}, Pressure ${persis.get("pressure")}, Self-Respect ${persis.get("selfRespect")}, Commitment ${persis.get("commitment")}.`,
    Condition.If(persis.isTrue("reflectionUnlocked"), [
        narra`Reflection Mode is available from the hub whenever you want a wider character epilogue.`,
    ]),
    Menu.prompt("What would you like to do next?")
        .choose("Replay this scenario", [
            replayCurrentScenario(scene),
        ])
        .choose("Choose another scenario", [
            scene.jumpTo(sceneHub),
        ])
        .showWhen(persis.isTrue("reflectionUnlocked"), "Open Reflection Mode", [
            scene.jumpTo(sceneReflection),
        ]),
]);

const reflectionSprite = createSingleSprite();
sceneReflection.action((scene) => [
    reflectionSprite.show({ duration: 500 }),
    persis.assign({
        currentScenario: "reflection-mode",
        currentScenarioTitle: "Reflection Mode",
        currentScenarioTheme: "Growth through honest choices",
        currentContentWarning: "Reflective discussion of jealousy, pressure, conflict, and breakups",
        currentEnding: "none",
        endingTitle: "",
        endingMessage: "",
        endingLesson: "",
        endingQuote: "",
        trust: defaultPersisData.trust,
        contentment: defaultPersisData.contentment,
        anxiety: defaultPersisData.anxiety,
        pressure: defaultPersisData.pressure,
        selfRespect: defaultPersisData.selfRespect,
        commitment: defaultPersisData.commitment,
        communication: defaultPersisData.communication,
    }),
    "Bonus Epilogue: Reflection Mode",
    narra`Every story in Hearts Connected asks the same question in a different form: what happens when we stop performing love and start practicing it honestly?`,
    alex`I learned that comparison can make love feel smaller than it really is.`,
    riley`I learned that silence can turn uncertainty into a story that hurts more than the truth.`,
    sam`I learned that being ready matters more than fitting someone else's timeline.`,
    jordan`I learned that contentment gets drowned out when every relationship becomes a competition.`,
    casey`I learned that commitment means less when it is spoken from fear instead of honesty.`,
    morgan`The healthiest endings were not the easiest ones. They were the ones where people said what was true before resentment made the choice for them.`,
    narra`That's the heart of this anthology: modern relationships are not ruined by imperfection, but they are tested by avoidance, comparison, and unspoken pressure.`,
    Menu.prompt("Where to next?")
        .choose("Return to the story hub", [
            scene.jumpTo(sceneHub),
        ])
        .choose("Replay the last route", [
            replayCurrentScenario(scene),
        ]),
]);

const [alexSprite, jamieSprite] = createPairSprites();
sceneSocialMedia.action((scene) => [
    ...scenarioIntro("social-media-expectations"),
    alexSprite.show({ duration: 500 }),
    jamieSprite.show({ duration: 500 }),
    alex`Why aren't we like those couples online... surprise dates, gifts, perfect pictures...`,
    jamie`Hey, want to grab snacks after school?`,
    Menu.prompt("How does Alex respond?")
        .choose("A. That's it? You never do anything special.", [
            adjustStats({ communication: -8, pressure: 15, contentment: -10, trust: -8 }),
            alex`That's it? You never do anything special.`,
            jamie`I try my best... isn't that enough?`,
            "Tension builds immediately between them.",
            Menu.prompt("What does Alex do next?")
                .choose("Keep pressuring Jamie to be more like online couples.", [
                    adjustStats({ trust: -12, contentment: -15, pressure: 12 }),
                    alex`I just want something bigger. Why can't you be more like them?`,
                    jamie`I feel like I'm never enough for you.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "toxic",
                        endingTitle: "Toxic Ending",
                        endingMessage:
                            "Alex keeps measuring Jamie against polished online couples, and Jamie starts feeling judged instead of loved.",
                        endingLesson:
                            "When comparison becomes constant pressure, affection starts to feel like a test nobody can pass.",
                        endingQuote: "I feel like I'm never enough for you.",
                    }),
                ])
                .choose("Admit the comparison is getting to Alex.", [
                    adjustStats({ communication: 14, trust: 10, pressure: -10, anxiety: -6 }),
                    alex`I'm sorry. I've been comparing us to what I see online, and it's messing with me.`,
                    jamie`We don't need to be perfect, just real.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "The conflict becomes a real conversation, and Alex finally says out loud what social media had been doing to the relationship.",
                        endingLesson:
                            "Naming the pressure honestly gives both people room to reconnect without pretending to be perfect.",
                        endingQuote: "We don't need to be perfect, just real.",
                    }, { contentment: 8 }),
                ]),
        ])
        .choose("B. Sure, I'd love that.", [
            adjustStats({ contentment: 12, trust: 8, pressure: -10, anxiety: -4 }),
            alex`Sure, I'd love that.`,
            jamie`Simple is still special to me.`,
            Menu.prompt("What does Alex focus on?")
                .choose("Appreciate the small moment for what it is.", [
                    adjustStats({ contentment: 12, communication: 6, trust: 6 }),
                    alex`Simple is nice. I think I forgot that.`,
                    jamie`We don't need to be perfect, just real.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "Alex lets go of the performance mindset and starts noticing the care already present in the relationship.",
                        endingLesson:
                            "Appreciation grows when real connection matters more than curated appearances.",
                        endingQuote: "We don't need to be perfect, just real.",
                    }),
                ])
                .choose("Stay polite, but keep silently comparing everything.", [
                    adjustStats({ pressure: 12, contentment: -8, trust: -6, anxiety: 6 }),
                    alex`Maybe... but it still doesn't feel like enough sometimes.`,
                    jamie`I feel like I'm never enough for you.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "toxic",
                        endingTitle: "Toxic Ending",
                        endingMessage:
                            "Nothing explodes right away, but the relationship starts bending under an invisible standard Alex never truly questions.",
                        endingLesson:
                            "Unspoken comparison can be just as damaging as open criticism when it keeps a partner feeling inadequate.",
                        endingQuote: "I feel like I'm never enough for you.",
                    }),
                ]),
        ])
        .choose("C. Can we try doing something more... special?", [
            adjustStats({ communication: 10, pressure: -4, trust: 4 }),
            alex`Can we try doing something more... special?`,
            jamie`Oh, you want something different? Let's talk about it.`,
            Menu.prompt("How honest is Alex willing to be?")
                .choose("Explain the pressure without blaming Jamie.", [
                    adjustStats({ communication: 10, trust: 12, anxiety: -6, contentment: 8 }),
                    alex`I've been comparing us to people online, and I don't want that to ruin what we have.`,
                    jamie`We don't need to be perfect, just real.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "Alex opens up before resentment hardens, and the relationship becomes more grounded through honest communication.",
                        endingLesson:
                            "Talking about expectations early helps couples shape something real instead of chasing an image.",
                        endingQuote: "We don't need to be perfect, just real.",
                    }),
                ])
                .choose("Decide the relationship no longer feels right.", [
                    adjustStats({ selfRespect: 4, commitment: -20, contentment: -12, pressure: -6 }),
                    alex`Maybe this isn't what I want anymore...`,
                    jamie`I wish we had figured that out together.`,
                    ...finishScenario(scene, "social-media-expectations", {
                        endingId: "breakup",
                        endingTitle: "Breakup Ending",
                        endingMessage:
                            "Alex chooses to leave, but the decision is shaped more by comparison than by a full understanding of what Jamie was offering.",
                        endingLesson:
                            "Sometimes ending a relationship is honest, but it helps to separate real needs from online pressure first.",
                        endingQuote: "Maybe this isn't what I want anymore...",
                    }),
                ]),
        ]),
]);

const [rileySprite, chrisSprite] = createPairSprites();
sceneJealousy.action((scene) => [
    ...scenarioIntro("online-jealousy"),
    rileySprite.show({ duration: 500 }),
    chrisSprite.show({ duration: 500 }),
    riley`Why does Chris keep liking her posts...?`,
    Menu.prompt("What does Riley do?")
        .choose("A. Ask calmly.", [
            adjustStats({ trust: 10, anxiety: -8, communication: 12 }),
            riley`Hey, I noticed something and I just want to understand.`,
            chris`It's nothing serious, but I get why you'd feel that way.`,
            Menu.prompt("How does Riley follow through?")
                .choose("Listen, explain the insecurity, and set boundaries together.", [
                    adjustStats({ trust: 12, anxiety: -10, communication: 8, contentment: 6 }),
                    riley`Thanks for hearing me out. I don't want to assume the worst.`,
                    chris`Thanks for asking me instead of assuming.`,
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "trust",
                        endingTitle: "Trust Ending",
                        endingMessage:
                            "Riley brings up the jealousy directly, and both of them leave the conversation with clearer boundaries and more trust.",
                        endingLesson:
                            "Trust grows when uncomfortable feelings are shared before they become accusations.",
                        endingQuote: "Thanks for asking me instead of assuming.",
                    }),
                ])
                .choose("Say it is fine, then keep checking in secret anyway.", [
                    adjustStats({ anxiety: 12, trust: -8, communication: -4, pressure: 6 }),
                    riley`I hear you... I just don't know if I can stop thinking about it.`,
                    chris`We can't keep doing this every time you feel insecure.`,
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "conflict",
                        endingTitle: "Conflict Ending",
                        endingMessage:
                            "The first talk starts well, but Riley never fully leaves suspicion behind, so the same issue keeps returning as an argument.",
                        endingLesson:
                            "Communication works best when it leads to changed behavior, not just a temporary pause in the tension.",
                        endingQuote: "We can't keep doing this every time you feel insecure.",
                    }),
                ]),
        ])
        .choose("B. Stay silent and stalk.", [
            adjustStats({ anxiety: 15, trust: -10, communication: -10, pressure: 8 }),
            "Riley keeps scrolling, counting every like and inventing a story around each one.",
            riley`Who is she... why so many likes?`,
            Menu.prompt("What happens after the overthinking sets in?")
                .choose("Withdraw and stop talking about the real issue.", [
                    adjustStats({ trust: -12, anxiety: 10, communication: -10, contentment: -6 }),
                    riley`It's easier to go quiet than say how bad this feels.`,
                    "Chris notices the distance, but Riley keeps retreating.",
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "self-sabotage",
                        endingTitle: "Self-Sabotage Ending",
                        endingMessage:
                            "Riley protects themself by pulling away, but the silence creates the exact distance they were afraid of.",
                        endingLesson:
                            "Unchecked jealousy often hurts most when it turns into withdrawal instead of conversation.",
                        endingQuote: "I shut down before we even had the chance to fix it.",
                    }),
                ])
                .choose("Finally bring it up, but only after the anxiety takes over.", [
                    adjustStats({ communication: -4, anxiety: 6, trust: -6, pressure: 6 }),
                    riley`I've been watching everything and it still doesn't sit right with me.`,
                    chris`Why didn't you just talk to me before it got this big?`,
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "conflict",
                        endingTitle: "Conflict Ending",
                        endingMessage:
                            "By the time Riley speaks, the fear has already turned into resentment, and the discussion lands as another fight.",
                        endingLesson:
                            "Silence gives insecurity time to grow into conflict, especially when digital clues are filling in the blanks.",
                        endingQuote: "Why didn't you just talk to me before it got this big?",
                    }),
                ]),
        ])
        .choose("C. Confront aggressively.", [
            adjustStats({ anxiety: 10, communication: -12, trust: -12, pressure: 10 }),
            riley`Why are you flirting with her?!`,
            chris`What? You don't trust me?`,
            Menu.prompt("Where does the argument go from here?")
                .choose("Pause, apologize, and restart the conversation honestly.", [
                    adjustStats({ communication: 14, trust: 10, anxiety: -8, contentment: 6 }),
                    riley`I came in too hard. I'm hurt, not trying to attack you.`,
                    chris`I can work with honesty. I just need you to talk to me, not at me.`,
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "trust",
                        endingTitle: "Trust Ending",
                        endingMessage:
                            "The argument is messy, but Riley takes responsibility quickly enough for the conversation to shift back toward understanding.",
                        endingLesson:
                            "Repair is possible when someone owns the hurt behind their anger and makes room for a better conversation.",
                        endingQuote: "I can work with honesty. I just need you to talk to me, not at me.",
                    }),
                ])
                .choose("Keep accusing Chris and demand proof.", [
                    adjustStats({ trust: -14, anxiety: 8, pressure: 8, communication: -6 }),
                    riley`Then prove it, because this looks bad and I'm done pretending it doesn't.`,
                    chris`We can't keep doing this every time you feel insecure.`,
                    ...finishScenario(scene, "online-jealousy", {
                        endingId: "conflict",
                        endingTitle: "Conflict Ending",
                        endingMessage:
                            "Every explanation turns into fresh evidence for Riley, and the relationship gets trapped in repeat arguments.",
                        endingLesson:
                            "When confrontation is driven by accusation, it becomes harder for either person to feel safe or believed.",
                        endingQuote: "We can't keep doing this every time you feel insecure.",
                    }),
                ]),
        ]),
]);

const [samSprite, taylorSprite] = createPairSprites();
scenePeerPressure.action((scene) => [
    ...scenarioIntro("peer-pressure"),
    samSprite.show({ duration: 500 }),
    taylorSprite.show({ duration: 500 }),
    "Friend: You're the only single one left!",
    "Friend 2: Just date Taylor already!",
    Menu.prompt("What does Sam decide?")
        .choose("A. Agree to date Taylor.", [
            adjustStats({ selfRespect: -10, pressure: 15, commitment: 4, anxiety: 4 }),
            sam`Yeah... sure.`,
            taylor`Oh, okay...?`,
            Menu.prompt("How does Sam handle the pressure now?")
                .choose("Keep going with a relationship Sam never really wanted.", [
                    adjustStats({ selfRespect: -12, contentment: -10, pressure: 10, communication: -6 }),
                    sam`Maybe it'll feel real if I just go along with it.`,
                    taylor`This feels like something we were pushed into.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "forced",
                        endingTitle: "Forced Ending",
                        endingMessage:
                            "Sam says yes for the group instead of for themself, and the relationship quickly becomes awkward for both people.",
                        endingLesson:
                            "Dating to satisfy other people's timeline usually leaves everyone carrying a connection that was never chosen freely.",
                        endingQuote: "This feels like something we were pushed into.",
                    }),
                ])
                .choose("Be honest with Taylor before things go further.", [
                    adjustStats({ communication: 10, selfRespect: 8, pressure: -6, trust: 6 }),
                    sam`I said yes because of everyone else. That wasn't fair to you.`,
                    taylor`Thank you for telling me. We can just be honest and stay friends.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "honest-growth",
                        endingTitle: "Honest Growth Ending",
                        endingMessage:
                            "Sam steps back from the forced label and gives the connection a more honest shape, even if it stays platonic.",
                        endingLesson:
                            "Honesty can still lead to closeness when both people are allowed to define the relationship for themselves.",
                        endingQuote: "We don't have to force a label to care about each other.",
                    }),
                ]),
        ])
        .choose("B. Say you're not ready.", [
            adjustStats({ selfRespect: 15, pressure: -12, communication: 6, anxiety: -4 }),
            sam`I'm okay being single for now.`,
            "The friends pause, then realize Sam is serious.",
            Menu.prompt("What does Sam do with that boundary?")
                .choose("Stand by it with confidence.", [
                    adjustStats({ selfRespect: 12, contentment: 8, pressure: -6 }),
                    "Friend: Oh... respect.",
                    sam`I don't have to rush just because everyone else is rushing.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "self-respect",
                        endingTitle: "Self-Respect Ending",
                        endingMessage:
                            "Sam chooses their own pace and discovers that saying no can feel more freeing than trying to fit in.",
                        endingLesson:
                            "Readiness matters more than social pressure when a relationship is supposed to involve real choice.",
                        endingQuote: "I'm okay being single for now.",
                    }),
                ])
                .choose("Back down and agree just to stop the comments.", [
                    adjustStats({ selfRespect: -12, pressure: 10, communication: -6, anxiety: 6 }),
                    sam`Maybe I should just do it so everyone stops making it a thing.`,
                    taylor`I don't want this if it starts with pressure.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "forced",
                        endingTitle: "Forced Ending",
                        endingMessage:
                            "Sam abandons the boundary they meant to keep, and the relationship begins with discomfort instead of mutual enthusiasm.",
                        endingLesson:
                            "A choice made to quiet the crowd can still feel wrong even after everyone else moves on.",
                        endingQuote: "I don't want this if it starts with pressure.",
                    }),
                ]),
        ])
        .choose("C. Get to know Taylor first.", [
            adjustStats({ communication: 8, selfRespect: 6, pressure: -6, trust: 4 }),
            sam`Let's just hang out first.`,
            taylor`I'd actually like that.`,
            Menu.prompt("What tone does Sam set?")
                .choose("Be clear that there is no rush and no label yet.", [
                    adjustStats({ communication: 10, trust: 8, contentment: 6, pressure: -4 }),
                    sam`I want to know you without everyone deciding what this is for us.`,
                    taylor`That sounds better than forcing it.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "honest-growth",
                        endingTitle: "Honest Growth Ending",
                        endingMessage:
                            "Sam and Taylor slow things down, and the connection has room to become a friendship without pressure or false expectations.",
                        endingLesson:
                            "Exploration works best when both people can be curious without being pushed into romance.",
                        endingQuote: "Let's figure out what this is at our own pace.",
                    }),
                ])
                .choose("Let the friends keep defining it for both of you.", [
                    adjustStats({ pressure: 10, selfRespect: -6, communication: -4, anxiety: 4 }),
                    "Friend: See? We knew you'd end up together.",
                    sam`This already feels more about them than us.`,
                    ...finishScenario(scene, "peer-pressure", {
                        endingId: "forced",
                        endingTitle: "Forced Ending",
                        endingMessage:
                            "Even with a softer start, outside pressure keeps steering the relationship until it stops feeling like Sam and Taylor's choice.",
                        endingLesson:
                            "Getting to know someone only helps when the people involved stay in charge of the pace and meaning.",
                        endingQuote: "This already feels more about them than us.",
                    }),
                ]),
        ]),
]);

const [jordanSprite, partnerSprite] = createPairSprites();
sceneComparison.action((scene) => [
    ...scenarioIntro("comparison-online"),
    jordanSprite.show({ duration: 500 }),
    partnerSprite.show({ duration: 500 }),
    jordan`They go on dates every week... why not us?`,
    Menu.prompt("What does Jordan do?")
        .choose("A. Keep scrolling and comparing.", [
            adjustStats({ anxiety: 12, contentment: -12, pressure: 8, selfRespect: -6 }),
            "The feed keeps serving highlight reels, and Jordan keeps using them as proof of what is missing.",
            jordan`We're so boring compared to others...`,
            Menu.prompt("How does that comparison land?")
                .choose("Turn the insecurity into criticism toward the relationship.", [
                    adjustStats({ trust: -10, communication: -6, pressure: 10, contentment: -8 }),
                    jordan`Why don't we ever do enough? Everyone else seems to have something better.`,
                    partner`I want us to talk to each other, not compete with strangers online.`,
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "strain",
                        endingTitle: "Strain Ending",
                        endingMessage:
                            "Jordan keeps grading the relationship against other people's best moments, and the connection begins to feel defensive and tense.",
                        endingLesson:
                            "Comparison puts pressure on a relationship when it replaces curiosity with constant dissatisfaction.",
                        endingQuote: "I want us to talk to each other, not compete with strangers online.",
                    }),
                ])
                .choose("Internalize it and spiral alone.", [
                    adjustStats({ anxiety: 12, selfRespect: -10, communication: -8, contentment: -6 }),
                    jordan`The more I compare, the less I can see what's actually here.`,
                    "Jordan says less and less, but feels worse and worse.",
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "insecurity",
                        endingTitle: "Insecurity Ending",
                        endingMessage:
                            "Jordan never brings the feeling into the open, so the comparison turns inward and slowly damages self-worth.",
                        endingLesson:
                            "Feeds are especially harmful when they become private evidence that your life is always behind.",
                        endingQuote: "The more I compare, the less I can see what's actually here.",
                    }),
                ]),
        ])
        .choose("B. Talk to your partner.", [
            adjustStats({ communication: 12, trust: 8, anxiety: -6, pressure: -4 }),
            jordan`I've been comparing us to what I see online, and it's getting to me.`,
            partner`We may not be like them, but we're us.`,
            Menu.prompt("What does Jordan do with that reassurance?")
                .choose("Listen and reconnect with what the relationship actually is.", [
                    adjustStats({ contentment: 14, trust: 10, selfRespect: 6, anxiety: -6 }),
                    jordan`You're right. I want to build something that fits us, not our feed.`,
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "contentment",
                        endingTitle: "Contentment Ending",
                        endingMessage:
                            "The conversation helps Jordan step out of comparison mode and back into the reality of a relationship that already has its own value.",
                        endingLesson:
                            "Contentment grows when couples define meaning together instead of borrowing standards from social media.",
                        endingQuote: "We may not be like them, but we're us.",
                    }),
                ])
                .choose("Keep arguing from the comparison anyway.", [
                    adjustStats({ pressure: 10, communication: -6, trust: -8, anxiety: 6 }),
                    jordan`Maybe, but that still doesn't change how far behind we feel.`,
                    partner`If every conversation starts with someone else's timeline, we're going to keep hurting each other.`,
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "strain",
                        endingTitle: "Strain Ending",
                        endingMessage:
                            "Jordan talks, but only to prove the relationship is lacking, and the discussion creates more distance than clarity.",
                        endingLesson:
                            "Communication only helps when it invites understanding instead of turning comparison into a weapon.",
                        endingQuote: "If every conversation starts with someone else's timeline, we're going to keep hurting each other.",
                    }),
                ]),
        ])
        .choose("C. Take a break from social media.", [
            adjustStats({ anxiety: -10, contentment: 8, pressure: -8, selfRespect: 6 }),
            jordan`Maybe social media is messing with me.`,
            "The silence after logging off feels awkward at first, then calmer.",
            Menu.prompt("What does Jordan do with the space?")
                .choose("Use it to focus on the real relationship.", [
                    adjustStats({ contentment: 12, selfRespect: 6, trust: 6, anxiety: -4 }),
                    jordan`I want to pay attention to what actually makes us happy.`,
                    partner`That sounds like us already getting back to ourselves.`,
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "contentment",
                        endingTitle: "Contentment Ending",
                        endingMessage:
                            "Without the constant comparison loop, Jordan notices the relationship feels steadier and more satisfying than the feed suggested.",
                        endingLesson:
                            "Sometimes the healthiest move is not more content, but less noise.",
                        endingQuote: "We may not be like them, but we're us.",
                    }),
                ])
                .choose("Detach from the feed, but also hide the feelings from your partner.", [
                    adjustStats({ anxiety: 6, communication: -8, selfRespect: -4, trust: -4 }),
                    jordan`Maybe if I just keep it to myself, it'll go away.`,
                    "The scrolling stops, but the doubt lingers underneath.",
                    ...finishScenario(scene, "comparison-online", {
                        endingId: "insecurity",
                        endingTitle: "Insecurity Ending",
                        endingMessage:
                            "Jordan removes one trigger, but the unspoken insecurity stays active because it never gets processed out loud.",
                        endingLesson:
                            "A detox helps, but lasting relief usually needs reflection or conversation, not just distance from the app.",
                        endingQuote: "Maybe social media is messing with me.",
                    }),
                ]),
        ]),
]);

const [caseySprite, morganSprite] = createPairSprites();
sceneCommitment.action((scene) => [
    ...scenarioIntro("commitment-decisions"),
    caseySprite.show({ duration: 500 }),
    morganSprite.show({ duration: 500 }),
    morgan`Where do you see us in the future?`,
    Menu.prompt("How does Casey answer?")
        .choose("A. I'm ready to commit.", [
            adjustStats({ commitment: 10, pressure: 12, anxiety: 6, communication: -2 }),
            casey`I'm ready to commit.`,
            "Casey feels the words land before they feel fully true.",
            casey`Am I really ready...?`,
            Menu.prompt("What does Casey do next?")
                .choose("Admit the uncertainty and talk about pacing.", [
                    adjustStats({ communication: 12, trust: 10, pressure: -10, commitment: 4 }),
                    casey`I want this, but I also need to be honest that I'm still figuring out my pace.`,
                    morgan`Thank you for being honest.`,
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "The first answer comes from pressure, but Casey corrects course quickly enough for the conversation to become real again.",
                        endingLesson:
                            "Commitment is stronger when it is paced by honesty instead of rushed by fear.",
                        endingQuote: "Thank you for being honest.",
                    }),
                ])
                .choose("Keep promising more than feels true.", [
                    adjustStats({ pressure: 14, trust: -6, communication: -6, anxiety: 8 }),
                    casey`I said yes before I knew if I meant it.`,
                    "Morgan feels the weight of a promise Casey cannot actually hold.",
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "pressure",
                        endingTitle: "Pressure Ending",
                        endingMessage:
                            "Casey stays inside an answer that sounded safe in the moment, but the pressure of it creates emotional burnout.",
                        endingLesson:
                            "False certainty can be more exhausting than an honest maybe when the future is on the line.",
                        endingQuote: "I said yes before I knew if I meant it.",
                    }),
                ]),
        ])
        .choose("B. I need more time.", [
            adjustStats({ communication: 12, trust: 10, pressure: -6, selfRespect: 4 }),
            casey`I need more time.`,
            morgan`Thank you for being honest.`,
            Menu.prompt("What makes that honesty meaningful?")
                .choose("Set a clearer pace for future conversations.", [
                    adjustStats({ commitment: 8, trust: 8, selfRespect: 6, communication: 6 }),
                    casey`I don't want to avoid this. I just want to answer it responsibly.`,
                    morgan`Then let's keep checking in instead of forcing a deadline.`,
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "Casey gives an honest answer, and both of them turn that honesty into a plan instead of a dead end.",
                        endingLesson:
                            "Taking more time can still move a relationship forward when the need for time is paired with clarity and care.",
                        endingQuote: "Thank you for being honest.",
                    }),
                ])
                .choose("Ask for time, but offer no direction at all.", [
                    adjustStats({ communication: -10, commitment: -8, trust: -8, pressure: 6 }),
                    casey`I just... don't know. Can we not do this right now?`,
                    morgan`I can't build a future around silence.`,
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "breakup",
                        endingTitle: "Breakup Ending",
                        endingMessage:
                            "Morgan can handle uncertainty, but not indefinite avoidance, and the lack of direction becomes its own answer.",
                        endingLesson:
                            "Honesty needs follow-through; without it, even a fair request for time can feel like emotional distance.",
                        endingQuote: "I can't build a future around silence.",
                    }),
                ]),
        ])
        .choose("C. Avoid the question.", [
            adjustStats({ communication: -12, anxiety: 8, trust: -8, pressure: 6 }),
            "Casey looks away instead of answering.",
            morgan`Why won't you answer me?`,
            Menu.prompt("What does Casey do now?")
                .choose("Finally say what the silence was hiding.", [
                    adjustStats({ communication: 14, trust: 10, anxiety: -6, selfRespect: 4 }),
                    casey`Because I was scared of disappointing you, not because I wanted to ignore you.`,
                    morgan`Thank you for being honest.`,
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "healthy",
                        endingTitle: "Healthy Ending",
                        endingMessage:
                            "The silence almost derails the moment, but Casey chooses vulnerability before avoidance becomes the new pattern.",
                        endingLesson:
                            "Even late honesty can rebuild trust when it arrives before resentment fully settles in.",
                        endingQuote: "Thank you for being honest.",
                    }),
                ])
                .choose("Keep avoiding and hope the topic disappears.", [
                    adjustStats({ communication: -10, commitment: -12, trust: -8, pressure: 8 }),
                    casey`I don't know what to say.`,
                    morgan`I can't build a future around silence.`,
                    ...finishScenario(scene, "commitment-decisions", {
                        endingId: "breakup",
                        endingTitle: "Breakup Ending",
                        endingMessage:
                            "Avoidance becomes the deciding factor, and Morgan leaves because the relationship has no shared direction to stand on.",
                        endingLesson:
                            "A difficult answer can still protect a relationship more than repeated avoidance ever will.",
                        endingQuote: "I can't build a future around silence.",
                    }),
                ]),
        ]),
]);

const scene1 = sceneHub;

export { scene1 };
