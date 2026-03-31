import { Menu } from "narraleaf-react";
import { createPairSprites, lea, micah } from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    genderWord,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneDigitalSupport, sceneResult } from "@/scenes/core/scenes";

export function registerDigitalSupportScenario() {
    const [leaSprite, micahSprite] = createPairSprites();

    sceneDigitalSupport.action((scene) => [
        ...scenarioIntro("digital-support"),
        leaSprite.show({ duration: 500 }),
        micahSprite.show({ duration: 500 }),
        "Lea has had a brutal day, texts Micah for comfort, and then sees the green online dot appear without any reply.",
        lea`Being online and being emotionally available are really not the same thing, but it still hurts in the moment.`,
        lea`The worst part is how fast my brain turns one unread message into a whole speech about being an unimportant ${genderWord("boyfriend", "girlfriend")}.`,
        Menu.prompt("What does Lea do with the silence?")
            .choose("Send the annoyed version before the hurt gets any bigger.", [
                adjustStats({ communication: -10, anxiety: 10, pressure: 8, trust: -6 }),
                lea`If you're too busy to care, you can just say that.`,
                micah`That's not fair. I'm at the clinic with my brother right now.`,
                Menu.prompt("How does Lea handle the damage from the first message?")
                    .choose("Apologize for the tone and explain the need underneath it.", [
                        adjustStats({ communication: 14, trust: 10, anxiety: -8, contentment: 6 }),
                        lea`I'm sorry. I needed comfort and turned that into blame before I knew what was happening on your side.`,
                        micah`I can show up better if we talk about support before either of us starts guessing.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "support",
                            endingTitle: "Responsive Boundaries",
                            endingMessage:
                                "Lea and Micah turn a reactive moment into a better conversation about what support can realistically look like during stressful nights.",
                            endingLesson:
                                "Being online is not the same as being available. Support becomes clearer when expectations are named instead of inferred from a screen.",
                            endingQuote: "Support gets clearer once we stop guessing from the screen.",
                        }),
                    ])
                    .choose("Keep score of the delay and stay inside the resentment.", [
                        adjustStats({ trust: -10, communication: -6, pressure: 10, anxiety: 6 }),
                        lea`Maybe I just needed to know you'd choose me first for once.`,
                        micah`I can't keep being measured by the timestamp on a reply when my real life is happening off-screen.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "distance",
                            endingTitle: "Offline Distance",
                            endingMessage:
                                "The night becomes less about comfort and more about proving who failed first, leaving both people farther apart than they were before the conversation began.",
                            endingLesson:
                                "Digital misunderstanding becomes heavier when response time turns into a moral scorecard.",
                            endingQuote: "I can't keep being measured by the timestamp on a reply.",
                        }),
                    ]),
            ])
            .choose("Say directly what kind of support you need tonight.", [
                adjustStats({ communication: 12, anxiety: -6, trust: 6, pressure: -2 }),
                lea`Today was rough. I don't need a full conversation if you can't do that right now. I just need to know what kind of support you actually have bandwidth for.`,
                micah`Thank you for saying it that clearly. I can call in twenty minutes or send voice notes sooner.`,
                Menu.prompt("What does Lea do with the answer?")
                    .choose("Meet the support that is actually possible tonight.", [
                        adjustStats({ communication: 10, trust: 10, contentment: 8, anxiety: -6 }),
                        lea`Voice notes are enough for now. I just needed to know you weren't gone.`,
                        micah`Then that's what I can give tonight, and I'll show up better tomorrow too.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "support",
                            endingTitle: "Responsive Boundaries",
                            endingMessage:
                                "Lea asks directly for support, Micah answers with realistic capacity, and the relationship feels steadier because neither person has to guess at the standard.",
                            endingLesson:
                                "Open communication and emotional support work best when they include realistic limits, not just idealized availability.",
                            endingQuote: "I just needed to know you weren't gone.",
                        }),
                    ])
                    .choose("Keep needing more than Micah can actually offer in that moment.", [
                        adjustStats({ pressure: 8, contentment: -4, anxiety: 6, trust: -4 }),
                        lea`I hear that, but part of me still wants you to drop everything and make this feel okay right now.`,
                        micah`I care about you. I just can't make urgency the only proof that care is real.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "misread",
                            endingTitle: "Partial Repair",
                            endingMessage:
                                "The conversation goes better than a fight would have, but Lea still leaves the night feeling only partly reassured because the emotional need stayed bigger than the available response.",
                            endingLesson:
                                "Good communication can reduce hurt without removing it completely. Sometimes the repair is real, but still incomplete.",
                            endingQuote: "I can't make urgency the only proof that care is real.",
                        }),
                    ]),
            ])
            .choose("Close the app and hope the feeling fades on its own.", [
                adjustStats({ anxiety: 4, communication: -8, selfRespect: -2, pressure: 2 }),
                lea`I don't know if this is self-control or just me disappearing first.`,
                micah`I'm sorry. I wasn't free and I should've said that faster.`,
                Menu.prompt("What happens after the space between them has had time to grow?")
                    .choose("Reply later with context and explain why the silence landed badly.", [
                        adjustStats({ communication: 8, trust: 6, anxiety: -4, contentment: 2 }),
                        lea`I wasn't trying to punish you. I just didn't trust myself to text without sounding hurt.`,
                        micah`I wish we had gotten there sooner, but I'm glad we're here now.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "misread",
                            endingTitle: "Partial Repair",
                            endingMessage:
                                "Lea and Micah eventually understand each other better, but only after the delay has already left an emotional bruise that does not disappear immediately.",
                            endingLesson:
                                "Not every problem resolves cleanly. Some conversations end in better understanding without fully erasing the original hurt.",
                            endingQuote: "I wish we had gotten there sooner, but I'm glad we're here now.",
                        }),
                    ])
                    .choose("Keep it in until the resentment starts doing the talking instead.", [
                        adjustStats({ trust: -10, contentment: -8, communication: -10, anxiety: 8 }),
                        lea`By the time I wanted to explain it, it already felt like too much to say.`,
                        ...finishScenario(scene, sceneResult, "digital-support", {
                            endingId: "distance",
                            endingTitle: "Offline Distance",
                            endingMessage:
                                "Lea avoids a fight, but the unspoken hurt settles into a colder distance that neither person knows how to soften quickly anymore.",
                            endingLesson:
                                "Avoiding conflict can sometimes preserve peace for an hour while costing emotional closeness for much longer.",
                            endingQuote: "The silence lasted longer than the missed reply ever should have.",
                        }),
                    ]),
            ]),
    ]);
}
