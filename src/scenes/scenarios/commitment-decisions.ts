import { Menu } from "narraleaf-react";
import { casey, createScene5SpritePair, morgan, scene5SpriteAssets } from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    genderWord,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneCommitment, sceneResult } from "@/scenes/core/scenes";

export function registerCommitmentScenario() {
    const [caseySprite, morganSprite] = createScene5SpritePair();

    scene5SpriteAssets.forEach((asset) => sceneCommitment.preloadImage(asset));

    sceneCommitment.action((scene) => [
        ...scenarioIntro("commitment-decisions"),
        caseySprite.show({ duration: 500 }),
        morganSprite.show({ duration: 500 }),
        morgan`Can I ask the future question without making it sound like an ultimatum?`,
        casey`You asking it that carefully already tells me it matters.`,
        morgan`It does. Graduation is close. Schedules are changing. I just want to know how you see us.`,
        casey`I care about you. That's the easy part. The hard part is that everyone talks about commitment like a confident person should answer immediately.`,
        casey`Meanwhile I'm over here wondering whether being a good ${genderWord("boyfriend", "girlfriend")} means certainty or just honesty.`,
        Menu.prompt("How does Casey answer Morgan's question?")
            .choose("Promise more than you are fully sure about because you hate disappointing people.", [
                adjustStats({ commitment: 10, pressure: 10, anxiety: 6, communication: -4 }),
                casey`I'm ready. Or at least I should be. We can do the long-term version.`,
                morgan`Should be and are are not the same sentence.`,
                casey`I know. I just don't want my uncertainty to sound like lack of love.`,
                morgan`Then don't replace uncertainty with a promise you can't breathe inside.`,
                Menu.prompt("What does Casey do after hearing that warning?")
                    .choose("Keep the promise anyway and hope certainty catches up later.", [
                        adjustStats({ pressure: 12, commitment: 6, anxiety: 8, selfRespect: -4 }),
                        casey`Maybe committing harder is how I grow into it.`,
                        morgan`Or maybe it's how you burn out trying to be the version of you that answered too quickly.`,
                        casey`I don't know how to tell the difference yet.`,
                        morgan`That's exactly why this feels fragile.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "pressure",
                            endingTitle: "Burnout Promise",
                            endingMessage:
                                "Casey offers commitment in language that sounds decisive but feels borrowed, and the relationship starts carrying the weight of a promise made under emotional pressure.",
                            endingLesson:
                                "Premature certainty can feel generous in the moment while quietly creating resentment and exhaustion underneath it.",
                            endingQuote: "Don't replace uncertainty with a promise you can't breathe inside.",
                        }),
                    ])
                    .choose("Pull back and re-answer with more honesty before the moment hardens.", [
                        adjustStats({ communication: 14, trust: 12, pressure: -10, anxiety: -6 }),
                        casey`No, let me try again. I'm not unsure about you. I'm unsure about saying yes to a whole future when I'm still figuring out where I'll even be standing in six months.`,
                        morgan`That answer I can work with, because it's real.`,
                        casey`I can offer commitment to the process, even if I can't offer a flawless five-year script tonight.`,
                        morgan`That kind of honesty makes me feel closer to you, not farther.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "healthy",
                            endingTitle: "Honest Pace",
                            endingMessage:
                                "Casey corrects the reflex to over-promise and gives Morgan something sturdier: honesty about capacity, fear, and intention.",
                            endingLesson:
                                "Commitment does not have to sound absolute to be sincere. Often it becomes healthier when it is spoken with realism.",
                            endingQuote: "I'm not unsure about you. I'm unsure about pretending certainty I don't have.",
                        }),
                    ]),
            ])
            .choose("Say you need more time, but explain what that actually means.", [
                adjustStats({ communication: 12, trust: 8, pressure: -6, selfRespect: 6 }),
                casey`I need more time, but I don't want that answer to sound like a vague parking lot for your feelings.`,
                morgan`Okay. Then tell me what "more time" actually holds.`,
                casey`It means I want us to keep building this while I figure out what post-grad life is going to ask of me. I don't want to promise from fear or stall from cowardice.`,
                morgan`That's a much kinder answer than silence.`,
                Menu.prompt("How concrete is Casey willing to be?")
                    .choose("Offer a real timeline for checking back in together.", [
                        adjustStats({ commitment: 8, communication: 10, trust: 10, contentment: 6 }),
                        casey`Can we revisit this at the end of the semester? Not because I'm counting down to freedom, but because I want to answer with the version of me who has real information, not panic.`,
                        morgan`That feels fair. I can hold uncertainty better when it has shape.`,
                        casey`Then let's build shape instead of pretending certainty.`,
                        morgan`Deal.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "healthy",
                            endingTitle: "Mutual Timing",
                            endingMessage:
                                "Casey stays honest without going vague, and Morgan feels respected because the uncertainty is held together rather than handed over alone.",
                            endingLesson:
                                "Boundaries are easier to trust when they come with clarity, care, and a shared plan for returning to the conversation.",
                            endingQuote: "I can hold uncertainty better when it has shape.",
                        }),
                    ])
                    .choose("Keep the answer true but so open-ended that Morgan still feels stranded.", [
                        adjustStats({ communication: -6, trust: -6, pressure: 6, contentment: -4 }),
                        casey`I just know I can't answer tonight. I don't know when I can.`,
                        morgan`I appreciate the honesty more than a fake yes. I just also need to know I'm not waiting inside a hallway with no doors.`,
                        casey`That's fair. I just don't have a better sentence yet.`,
                        morgan`Then I think we may want different amounts of direction right now.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "breakup",
                            endingTitle: "Separate Directions",
                            endingMessage:
                                "Casey's answer is truthful, but not specific enough to meet Morgan's need for direction, and the mismatch in timing becomes too significant to ignore.",
                            endingLesson:
                                "Honesty still needs follow-through. A truthful answer can end a relationship if the people involved need very different structures around uncertainty.",
                            endingQuote: "I don't want to wait inside a hallway with no doors.",
                        }),
                    ]),
            ])
            .choose("Avoid the question because saying the wrong thing feels worse than saying nothing.", [
                adjustStats({ communication: -10, anxiety: 8, trust: -8, pressure: 6 }),
                casey`Can we not do the future tonight? I barely survived this week in the present.`,
                morgan`I could accept "not tonight" more easily if it didn't feel like a pattern.`,
                casey`I know. I just feel cornered by questions that don't have clean answers.`,
                morgan`And I feel pushed away by silence that keeps standing in for answers.`,
                Menu.prompt("What happens after the dodge?")
                    .choose("Come back and explain the fear instead of hiding behind it.", [
                        adjustStats({ communication: 12, trust: 10, anxiety: -6, selfRespect: 6 }),
                        casey`You're right. I keep avoiding because I think one wrong sentence will damage us, and then I damage us more by disappearing from the conversation entirely.`,
                        morgan`That makes sense. It's painful, but it makes sense.`,
                        casey`I don't have perfect clarity tonight. I do have the willingness to stay in the conversation with you.`,
                        morgan`That's enough for me to keep walking with.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "healthy",
                            endingTitle: "Stayed in the Conversation",
                            endingMessage:
                                "Casey interrupts the avoidance pattern in time, replacing silence with a more vulnerable and workable truth.",
                            endingLesson:
                                "Repair often begins the moment someone stops protecting themselves with distance and starts naming the fear honestly instead.",
                            endingQuote: "I don't have perfect clarity tonight. I do have willingness.",
                        }),
                    ])
                    .choose("Stay inside the silence and hope the moment expires on its own.", [
                        adjustStats({ communication: -10, trust: -10, contentment: -8, pressure: 8 }),
                        casey`I really don't know what to say.`,
                        morgan`Then I need to say something for myself. I can't keep building around absence and calling it patience.`,
                        casey`So that's it?`,
                        morgan`No. That's the result of this happening too many times.`,
                        ...finishScenario(scene, sceneResult, "commitment-decisions", {
                            endingId: "breakup",
                            endingTitle: "Silence Became the Answer",
                            endingMessage:
                                "Casey never finds the words quickly enough, and the repeated avoidance becomes more decisive than any explicit statement ever was.",
                            endingLesson:
                                "Not answering is still a form of answer when it becomes a recurring structure in the relationship.",
                            endingQuote: "I can't keep building around absence and calling it patience.",
                        }),
                    ]),
            ]),
    ]);
}



