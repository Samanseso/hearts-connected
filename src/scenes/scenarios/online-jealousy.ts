import { FadeIn, Menu } from "narraleaf-react";
import {
    chris,
    createScene2SpritePair,
    riley,
    scene2ChrisExpressions,
    scene2RileyExpressions,
    scene2SpriteAssets,
    scene2SpriteSwapMotion,
} from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneJealousy, sceneResult } from "@/scenes/core/scenes";

export function registerJealousyScenario() {
    const [rileySprite, chrisSprite] = createScene2SpritePair();
    const rileySwap = new FadeIn(
        scene2SpriteSwapMotion.riley.duration,
        [scene2SpriteSwapMotion.riley.xOffset, 0],
        "easeOut",
    );
    const chrisSwap = new FadeIn(
        scene2SpriteSwapMotion.chris.duration,
        [scene2SpriteSwapMotion.chris.xOffset, 0],
        "easeOut",
    );
    const rileyLook = (expression: keyof typeof scene2RileyExpressions) =>
        rileySprite.char(scene2RileyExpressions[expression], rileySwap.copy());
    const chrisLook = (expression: keyof typeof scene2ChrisExpressions) =>
        chrisSprite.char(scene2ChrisExpressions[expression], chrisSwap.copy());

    scene2SpriteAssets.forEach((asset) => sceneJealousy.preloadImage(asset));

    sceneJealousy.action((scene) => [
        ...scenarioIntro("online-jealousy"),
        rileySprite.show({ duration: 500 }),
        chrisSprite.show({ duration: 500 }),
        rileyLook("neutral"),
        riley`Chris liked her new post, then the next one, then the one from two weeks ago.`,
        rileyLook("anxious"),
        riley`I hate how quickly my brain turns that into a story about me not being enough in this relationship.`,
        riley`Nothing has technically happened, which almost makes it worse. It means I have to decide what to do with my own imagination first.`,
        chrisLook("friendly"),
        chris`You've been typing in our chat and deleting for five minutes. Should I be nervous?`,
        Menu.prompt("How does Riley bring up the discomfort?")
            .choose("Ask about it calmly before the spiral gets bigger.", [
                adjustStats({ communication: 12, trust: 6, anxiety: -4 }),
                rileyLook("vulnerable"),
                riley`A little, maybe. I noticed how often you've been liking Mara's posts, and I don't want to invent a whole story if there isn't one.`,
                chrisLook("confused"),
                chris`Thank you for asking it that way. She's in my group project, and I didn't realize it looked like something else from your side.`,
                rileyLook("retreat"),
                riley`It mostly hit me because I already felt insecure before I opened the app.`,
                chrisLook("reassuring"),
                chris`Then let's talk about the actual insecurity too, not just the likes.`,
                Menu.prompt("Where does Riley take the conversation next?")
                    .choose("Ask for reassurance and clearer boundaries without accusing Chris.", [
                        adjustStats({ communication: 10, trust: 12, anxiety: -8, contentment: 8 }),
                        rileyLook("vulnerable"),
                        riley`I don't need you to never interact with anyone. I just need us to be honest about what would make either of us feel disrespected.`,
                        chrisLook("reassuring"),
                        chris`That's fair. I can be more aware, and I also want you to tell me before you carry it alone for three days.`,
                        rileyLook("repair"),
                        riley`Deal. I'd rather be a little awkward than quietly miserable.`,
                        chrisLook("open"),
                        chris`That's probably how trust gets built anyway.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "trust",
                            endingTitle: "Clearer Boundaries",
                            endingMessage:
                                "Riley lets vulnerability come before accusation, and the conversation becomes about mutual understanding instead of digital evidence.",
                            endingLesson:
                                "Trust grows when both people can name their limits without turning every insecurity into a verdict.",
                            endingQuote: "I'd rather be a little awkward than quietly miserable.",
                        }),
                    ])
                    .choose("Back off too quickly because asking for reassurance suddenly feels embarrassing.", [
                        adjustStats({ communication: -8, selfRespect: -4, anxiety: 8, contentment: -4 }),
                        rileyLook("retreat"),
                        riley`Actually, forget it. I don't want to be that jealous person.`,
                        chrisLook("hurt"),
                        chris`You're not helping either of us by disappearing right after bringing it up.`,
                        riley`I know. I just don't know how to need things without feeling dramatic.`,
                        chrisLook("open"),
                        chris`Then we still have a conversation to come back to.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "self-sabotage",
                            endingTitle: "Uneasy Truce",
                            endingMessage:
                                "The exchange stays civil, but Riley retreats from the need underneath the question, leaving the relationship only half-repaired.",
                            endingLesson:
                                "Direct communication starts the repair, but it cannot finish it if one person immediately apologizes for having emotional needs at all.",
                            endingQuote: "I just don't know how to need things without feeling dramatic.",
                        }),
                    ]),
            ])
            .choose("Stay quiet for now and start checking everything more closely.", [
                adjustStats({ anxiety: 12, trust: -8, communication: -6 }),
                rileyLook("anxious"),
                riley`I don't ask. I just notice more. Who she is, when he likes her posts, what time he was online, whether his reply to me was shorter that night.`,
                riley`The silence feels safer for maybe twenty minutes. Then it starts feeding itself.`,
                chrisLook("confused"),
                chris`You're acting weird, and now I'm trying to guess whether you want comfort or space.`,
                Menu.prompt("What does Riley do with the overthinking?")
                    .choose("Finally admit how much the silent investigation has been affecting you.", [
                        adjustStats({ communication: 10, trust: 6, anxiety: -6, selfRespect: 2 }),
                        rileyLook("retreat"),
                        riley`I made it bigger by not asking. I kept collecting clues because I was scared the real answer would hurt.`,
                        chrisLook("hurt"),
                        chris`That hurts too, you know. Not because you asked, but because you were alone in it while I had no idea.`,
                        rileyLook("repair"),
                        riley`I know. I don't want my fear to keep turning you into a suspect.`,
                        chrisLook("open"),
                        chris`Then let's reset with honesty, not detective work.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "self-sabotage",
                            endingTitle: "Pulled Back From the Spiral",
                            endingMessage:
                                "Riley interrupts the spiral before it becomes a full fight, but the distance created by secrecy still leaves a bruise.",
                            endingLesson:
                                "Silence can protect pride for a moment while quietly damaging trust for much longer.",
                            endingQuote: "I don't want my fear to keep turning you into a suspect.",
                        }),
                    ])
                    .choose("Confront Chris only after the fear has turned into certainty.", [
                        adjustStats({ communication: -12, trust: -12, anxiety: 10, pressure: 6 }),
                        rileyLook("angry"),
                        riley`No, I think I just finally see what's in front of me. You don't like someone's photos that way unless you're inviting something.`,
                        chrisLook("defensive"),
                        chris`You asked a question in your head, answered it for me, and now you're angry at the answer you invented.`,
                        riley`That doesn't make me feel less hurt.`,
                        chrisLook("hurt"),
                        chris`And it doesn't make me feel more trusted.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "conflict",
                            endingTitle: "Frequent Fights",
                            endingMessage:
                                "By the time the conversation finally happens, both people are reacting to accumulated tension instead of the original issue.",
                            endingLesson:
                                "When anxiety is allowed to build evidence in private, the eventual confrontation often lands as accusation instead of communication.",
                            endingQuote: "You answered it for me, and now you're angry at the answer you invented.",
                        }),
                    ]),
            ])
            .choose("Confront Chris in the exact tone your anxiety wants to use.", [
                adjustStats({ communication: -10, anxiety: 8, trust: -8, pressure: 8 }),
                rileyLook("angry"),
                riley`So are you flirting with her, or am I just supposed to pretend this looks normal?`,
                chrisLook("confused"),
                chris`Wow. Okay. That's not where I thought tonight was going.`,
                riley`Then maybe stop acting like someone who needs the benefit of the doubt every time.`,
                chrisLook("defensive"),
                chris`And maybe stop talking to me like I've already confessed to something.`,
                Menu.prompt("What happens after the first blow lands?")
                    .choose("Own the fear underneath the accusation.", [
                        adjustStats({ communication: 12, trust: 8, anxiety: -6, contentment: 4 }),
                        rileyLook("repair"),
                        riley`You're right. I came in hot because I already felt scared before I asked. I don't want to keep doing that when what I really need is clarity.`,
                        chrisLook("open"),
                        chris`I can work with scared. I shut down when I feel prosecuted.`,
                        rileyLook("vulnerable"),
                        riley`Then help me understand what's real and what isn't.`,
                        chrisLook("reassuring"),
                        chris`I can do that. And you can tell me sooner next time.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "trust",
                            endingTitle: "Repaired Mid-Argument",
                            endingMessage:
                                "The conversation starts badly, but Riley redirects it before defensiveness fully takes over, allowing both people to recover some trust.",
                            endingLesson:
                                "A rough start does not have to decide the whole outcome if someone is willing to shift from attack to honesty in time.",
                            endingQuote: "I can work with scared. I shut down when I feel prosecuted.",
                        }),
                    ])
                    .choose("Keep arguing from the defensive position.", [
                        adjustStats({ communication: -8, trust: -10, contentment: -8, anxiety: 6 }),
                        rileyLook("angry"),
                        riley`Maybe I'd tell you sooner if telling you didn't make me feel foolish.`,
                        chrisLook("defensive"),
                        chris`And maybe I'd be less defensive if you didn't open like I was already guilty.`,
                        riley`So this is just what we do now?`,
                        chrisLook("hurt"),
                        chris`If we keep going like this, maybe it is.`,
                        ...finishScenario(scene, sceneResult, "online-jealousy", {
                            endingId: "conflict",
                            endingTitle: "Emotional Crossfire",
                            endingMessage:
                                "Neither person lies, but both keep protecting themselves in ways that make the relationship feel less safe with every argument.",
                            endingLesson:
                                "Trust is hard to rebuild inside a conversation where both people are fighting not to feel small.",
                            endingQuote: "Neither of us is listening anymore. We're just trying not to lose.",
                        }),
                    ]),
            ]),
    ]);
}





