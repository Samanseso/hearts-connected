import { Menu } from "narraleaf-react";
import { createScene4SpritePair, jordan, reese, scene4SpriteAssets } from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    genderWord,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneComparison, sceneResult } from "@/scenes/core/scenes";

export function registerComparisonScenario() {
    const [jordanSprite, reeseSprite] = createScene4SpritePair();

    scene4SpriteAssets.forEach((asset) => sceneComparison.preloadImage(asset));

    sceneComparison.action((scene) => [
        ...scenarioIntro("comparison-online"),
        jordanSprite.show({ duration: 500 }),
        reeseSprite.show({ duration: 500 }),
        jordan`Date dumps, anniversary reels, spontaneous road trips on a random Tuesday. The feed is full of relationships that look like they were written by a marketing team.`,
        jordan`And somehow I still end up asking whether I'm a disappointing ${genderWord("boyfriend", "girlfriend")} because Reese and I mostly have grocery runs, study breaks, and check-ins between deadlines.`,
        reese`You're staring at your phone like it owes you an apology.`,
        jordan`Maybe it does. Or maybe I do for giving it this much power.`,
        reese`Either way, talk to me before you decide we're losing something I didn't know we'd lost.`,
        Menu.prompt("What does Jordan do with the comparison spiral?")
            .choose("Keep scrolling and let the insecurity build before saying anything.", [
                adjustStats({ anxiety: 10, contentment: -8, trust: -6, communication: -4 }),
                jordan`I tell myself I'm just looking. Really I'm collecting proof that everybody else seems more in love than we do.`,
                reese`You're getting quieter by the second, which usually means you're arguing with a version of me I haven't met yet.`,
                jordan`Maybe I'm arguing with a version of us.`,
                reese`And maybe the feed is giving you edited footage while you're judging us in real time.`,
                Menu.prompt("What happens once the feeling gets big enough to speak?")
                    .choose("Admit the comparison has been distorting your view of the relationship.", [
                        adjustStats({ communication: 10, trust: 10, anxiety: -8, contentment: 8 }),
                        jordan`I think I'm borrowing other people's aesthetics and calling the result dissatisfaction.`,
                        reese`That sounds a lot more honest than "we're boring."`,
                        jordan`We might be ordinary, but ordinary is not the same thing as empty. I need to remember that.`,
                        reese`Then let's protect what we actually have before the feed teaches you to look past it.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "contentment",
                            endingTitle: "Back to Ourselves",
                            endingMessage:
                                "Jordan notices the comparison before it fully rewrites the relationship, and Reese helps pull the conversation back toward reality.",
                            endingLesson:
                                "Contentment is easier to recover once comparison is named as the distortion rather than treated like objective proof.",
                            endingQuote: "Ordinary is not the same thing as empty.",
                        }),
                    ])
                    .choose("Keep framing the relationship as lacking, even without clear evidence.", [
                        adjustStats({ contentment: -10, trust: -8, anxiety: 6, pressure: 6 }),
                        jordan`I don't know how to unsee it now. They all look more alive than we do.`,
                        reese`That's a brutal standard when all you're comparing it to is fifteen seconds of everybody else's best angle.`,
                        jordan`Maybe brutal doesn't make it less true.`,
                        reese`Or maybe it just makes us easier to wound.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "insecurity",
                            endingTitle: "Lingering Doubt",
                            endingMessage:
                                "Jordan keeps treating comparison as insight, and the relationship becomes less secure even though nothing concrete actually changes between them.",
                            endingLesson:
                                "A relationship can start feeling inadequate long before it is actually unhealthy if comparison keeps setting the terms of evaluation.",
                            endingQuote: "Maybe brutal doesn't make it less true.",
                        }),
                    ]),
            ])
            .choose("Talk to Reese before the online standard hardens into resentment.", [
                adjustStats({ communication: 12, trust: 8, anxiety: -4 }),
                jordan`Can I say something shallow in a serious tone?`,
                reese`Those are usually the conversations worth having. Go ahead.`,
                jordan`The feed keeps making me feel like our relationship isn't vivid enough. Not because you've done anything wrong. More because I'm being very impressionable right now.`,
                reese`That makes sense. Comparison can still hurt even when you know it's curated.`,
                Menu.prompt("How does Jordan handle Reese's openness?")
                    .choose("Use the opening to talk about what kind of connection you actually miss.", [
                        adjustStats({ communication: 10, trust: 10, contentment: 10, commitment: 4 }),
                        jordan`I think I miss intention more than spectacle. I don't need fireworks. I just want us to keep choosing each other on purpose.`,
                        reese`That feels doable. Weekly coffee outside campus, maybe. Phones away. Something small enough to survive real life.`,
                        jordan`That already feels more comforting than anything I saw online tonight.`,
                        reese`Good. Because I want our relationship to feel lived in, not advertised.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "contentment",
                            endingTitle: "Intentional, Not Impressive",
                            endingMessage:
                                "Jordan turns vague dissatisfaction into a concrete conversation about presence, and Reese meets the need without performing romance for an imaginary audience.",
                            endingLesson:
                                "Comparison loses some of its power once a couple defines what they actually want instead of what they are supposed to want.",
                            endingQuote: "I want our relationship to feel lived in, not advertised.",
                        }),
                    ])
                    .choose("Keep needing Reese to disprove every couple on the feed right away.", [
                        adjustStats({ pressure: 10, trust: -6, contentment: -6, anxiety: 4 }),
                        jordan`I hear you, but part of me still wants you to fix the feeling immediately so I stop comparing.`,
                        reese`I can care for you. I can't out-perform the entire internet in one conversation.`,
                        jordan`I know. I just don't like how small I feel in this.`,
                        reese`Then let's be careful not to turn that smallness into a test I automatically fail.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "strain",
                            endingTitle: "Tender Strain",
                            endingMessage:
                                "The conversation stays loving, but Jordan still reaches for immediate reassurance that Reese cannot fully provide, leaving a soft but real tension behind.",
                            endingLesson:
                                "Even caring partners can feel strained when one person's insecurity becomes the other's impossible assignment to solve on command.",
                            endingQuote: "I can't out-perform the entire internet in one conversation.",
                        }),
                    ]),
            ])
            .choose("Step away from the app first and see if the feeling changes offline.", [
                adjustStats({ anxiety: -8, contentment: 4, selfRespect: 6 }),
                jordan`I put the phone face down and try to notice what the room feels like without a scoreboard in it.`,
                reese`You look more like yourself already.`,
                jordan`That's because the app isn't narrating my life anymore.`,
                reese`Do you want to leave it there, or do you still want to talk about what it brought up?`,
                Menu.prompt("What does Jordan choose after the pause?")
                    .choose("Use the calmer mood to name the insecurity more gently.", [
                        adjustStats({ communication: 10, trust: 8, contentment: 8, anxiety: -4 }),
                        jordan`I still want to talk. The break helped me realize I wasn't actually upset at you. I was feeling left behind by images.`,
                        reese`That distinction matters a lot.`,
                        jordan`Yeah. So maybe tonight I don't need a perfect date. I just need a real check-in.`,
                        reese`That I can absolutely do.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "contentment",
                            endingTitle: "Feed Detox",
                            endingMessage:
                                "Jordan creates enough distance from the feed to tell the difference between a triggered mood and an actual relationship problem.",
                            endingLesson:
                                "Sometimes the healthiest conversation begins with stepping away from the environment that distorted the feeling in the first place.",
                            endingQuote: "I wasn't actually upset at you. I was feeling left behind by images.",
                        }),
                    ])
                    .choose("Stay quiet, but keep the private standard in your head.", [
                        adjustStats({ communication: -8, contentment: -8, anxiety: 4, trust: -4 }),
                        jordan`The app is closed, but the ranking system came with me.`,
                        reese`You don't have to answer right now, but I can feel you comparing us to something.`,
                        jordan`I know. I just don't know how to talk without sounding ungrateful.`,
                        reese`Silence has its own way of sounding too.`,
                        ...finishScenario(scene, sceneResult, "comparison-online", {
                            endingId: "insecurity",
                            endingTitle: "Private Metrics",
                            endingMessage:
                                "Jordan avoids a direct fight, but the unspoken standard remains alive enough to keep eroding contentment from the inside.",
                            endingLesson:
                                "Detox helps only partway if the underlying insecurity stays unnamed and keeps evaluating the relationship in silence.",
                            endingQuote: "The ranking system came with me.",
                        }),
                    ]),
            ]),
    ]);
}



