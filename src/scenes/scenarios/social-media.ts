import { FadeIn, Menu } from "narraleaf-react";
import {
    alex,
    createScene1SpritePair,
    jamie,
    scene1AlexExpressions,
    scene1JamieExpressions,
    scene1SpriteSwapMotion,
} from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    genderWord,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneResult, sceneSocialMedia } from "@/scenes/core/scenes";

export function registerSocialMediaScenario() {
    const [alexSprite, jamieSprite] = createScene1SpritePair();
    const alexSwap = new FadeIn(
        scene1SpriteSwapMotion.alex.duration,
        [scene1SpriteSwapMotion.alex.xOffset, 0],
        "easeOut",
    );
    const jamieSwap = new FadeIn(
        scene1SpriteSwapMotion.jamie.duration,
        [scene1SpriteSwapMotion.jamie.xOffset, 0],
        "easeOut",
    );
    const alexLook = (expression: keyof typeof scene1AlexExpressions) =>
        alexSprite.char(scene1AlexExpressions[expression], alexSwap.copy());
    const jamieLook = (expression: keyof typeof scene1JamieExpressions) =>
        jamieSprite.char(scene1JamieExpressions[expression], jamieSwap.copy());

    sceneSocialMedia.action((scene) => [
        ...scenarioIntro("social-media-expectations"),
        alexSprite.show({ duration: 500 }),
        jamieSprite.show({ duration: 500 }),
        alexLook("insecure"),
        alex`Jamie is standing right here, and somehow a stranger's anniversary reel is still louder in my head than the actual person I care about.`,
        alex`Half the time the feed makes me feel like I'm failing at being a good ${genderWord("boyfriend", "girlfriend")}.`,
        jamieLook("concern"),
        jamie`You look far away. Did today drain you that much?`,
        alexLook("neutral"),
        alex`Not exactly. I've just been scrolling too much.`,
        jamieLook("warm"),
        jamie`Then maybe we do something low-stakes. Want to grab snacks after class and walk the long way home?`,
        alexLook("insecure"),
        alex`The invite is sweet. My brain just keeps comparing it to candlelit surprises that were probably sponsored.`,
        Menu.prompt("How does Alex answer Jamie?")
            .choose("Let the disappointment come out sharper than intended.", [
                adjustStats({ communication: -6, pressure: 10, contentment: -8, trust: -6 }),
                alexLook("sharp"),
                alex`That's kind of the problem. Everything between us is starting to feel... ordinary.`,
                jamieLook("boundary"),
                jamie`Ordinary, or just not cinematic enough for your timeline?`,
                alex`I don't know anymore. Maybe both.`,
                jamieLook("hurt"),
                jamie`That hurts more than I think you meant it to.`,
                Menu.prompt("What does Alex do once the tension is out in the open?")
                    .choose("Keep comparing Jamie to what you see online.", [
                        adjustStats({ trust: -12, contentment: -10, pressure: 12, anxiety: 6 }),
                        alex`I just want to feel chosen in a way people can actually see.`,
                        jamieLook("boundary"),
                        jamie`So my actual effort matters less than whether it photographs well?`,
                        alex`That's not exactly what I mean, but maybe it's what this has turned into.`,
                        jamieLook("sad"),
                        jamie`Then I don't know how to keep loving you without feeling graded.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "toxic",
                            endingTitle: "Measured Love",
                            endingMessage:
                                "Alex keeps reaching for a public proof of love, and Jamie starts to feel evaluated instead of known.",
                            endingLesson:
                                "Comparison becomes corrosive when a partner has to compete with a performance standard instead of being met as a real person.",
                            endingQuote: "I don't know how to keep loving you without feeling graded.",
                        }),
                    ])
                    .choose("Admit the feed has been shaping your mood more than Jamie has.", [
                        adjustStats({ communication: 14, trust: 12, pressure: -10, anxiety: -8, contentment: 8 }),
                        alexLook("honest"),
                        alex`No. That's the embarrassing part. You've been here and trying. I've just been letting strangers define what counts as romantic.`,
                        jamieLook("open"),
                        jamie`Then let me compete with your real needs, not with everybody else's highlight reel.`,
                        alexLook("open"),
                        alex`I can do that. I think I just needed to hear myself say it out loud.`,
                        jamie`Good. Because I can plan something thoughtful with you. I just don't want us turning love into content strategy.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "healthy",
                            endingTitle: "Grounded Reset",
                            endingMessage:
                                "The sharp moment becomes a useful one once Alex names the real pressure behind it and Jamie responds without pretending the hurt never happened.",
                            endingLesson:
                                "Honest repair works better than polished romance when expectation and reality have started pulling apart.",
                            endingQuote: "Let me compete with your real needs, not with everybody else's highlight reel.",
                        }, { contentment: 6 }),
                    ]),
            ])
            .choose("Say yes, but be honest that you have been craving something more intentional.", [
                adjustStats({ communication: 10, trust: 4, pressure: -2, anxiety: -2 }),
                alexLook("honest"),
                alex`Yeah, I want that. I just also want to admit something before it turns weird in my head.`,
                jamieLook("open"),
                jamie`Then admit it. I'd rather hear the awkward version than the filtered one.`,
                alex`I miss feeling surprised by us. Not expensive. Just... thought about.`,
                jamie`That's fair. I can work with specific. I just freeze when the standard is "be more like the internet."`,
                Menu.prompt("How specific does Alex get?")
                    .choose("Describe a small ritual the two of you could actually build together.", [
                        adjustStats({ communication: 12, trust: 10, contentment: 10, pressure: -8, commitment: 6 }),
                        alexLook("open"),
                        alex`Maybe one intentional date a month. Or even a note in my bag sometimes. Something that belongs to us, not to the algorithm.`,
                        jamie`That I can do. I just needed a real map instead of a vibe I was supposed to magically guess.`,
                        alex`That actually sounds better than copying somebody else's anniversary montage.`,
                        jamieLook("warm"),
                        jamie`Good. Then let's make something smaller and more ours.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "healthy",
                            endingTitle: "Built, Not Performed",
                            endingMessage:
                                "Alex asks for intention instead of spectacle, and Jamie responds with the kind of clarity that turns pressure into partnership.",
                            endingLesson:
                                "Specific requests create room for intimacy. Vague pressure usually only creates defensiveness.",
                            endingQuote: "Let's make something smaller and more ours.",
                        }),
                    ])
                    .choose("Keep the request vague and hope Jamie figures out the fantasy version.", [
                        adjustStats({ communication: -8, pressure: 10, contentment: -4, trust: -6 }),
                        alexLook("insecure"),
                        alex`I don't know. I just want it to feel more special without having to explain every little thing.`,
                        jamieLook("boundary"),
                        jamie`Then I'm probably going to keep missing, because "special" can mean ten different things and only one of us is in your head.`,
                        alex`That's exactly what I'm scared of.`,
                        jamieLook("sad"),
                        jamie`And now I'm scared of disappointing you by default.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "toxic",
                            endingTitle: "Quiet Drift",
                            endingMessage:
                                "Neither person explodes, but the relationship bends under an expectation nobody has really defined in human terms.",
                            endingLesson:
                                "Even a gentle request can turn into pressure when the desired outcome stays imaginary and the partner is left guessing.",
                            endingQuote: "I'm scared of disappointing you by default.",
                        }),
                    ]),
            ])
            .choose("Say yes and decide not to bring up the insecurity yet.", [
                adjustStats({ contentment: 8, trust: 6, anxiety: -2 }),
                alexLook("neutral"),
                alex`Snacks sound good. Maybe I just need to get out of my own head for an hour.`,
                jamieLook("warm"),
                jamie`That I can help with. Come on.`,
                alexLook("insecure"),
                alex`The walk is easy in the way real things are easy. That almost makes me sadder.`,
                jamieLook("concern"),
                jamie`You're smiling and spiraling at the same time, which is honestly kind of impressive.`,
                Menu.prompt("What does Alex do with the feeling during the walk?")
                    .choose("Open up before the quiet turns resentful.", [
                        adjustStats({ communication: 12, trust: 10, contentment: 8, anxiety: -6 }),
                        alexLook("honest"),
                        alex`Can I ruin the easy mood for one second by being honest? I'm scared simple means I'm settling, and I don't even know if that's my thought or the internet's.`,
                        jamieLook("open"),
                        jamie`That's not ruining the mood. That's trusting me with the part of you that's embarrassed.`,
                        alexLook("open"),
                        alex`I think I needed that more than I needed a grand gesture.`,
                        jamie`Then let's keep choosing real over impressive.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "healthy",
                            endingTitle: "Real Things, Said Out Loud",
                            endingMessage:
                                "Alex lets a simple afternoon become the place where the deeper insecurity finally gets named instead of hidden.",
                            endingLesson:
                                "Sometimes the most romantic move is not escalation. It is choosing honesty before dissatisfaction hardens into distance.",
                            endingQuote: "That's trusting me with the part of you that's embarrassed.",
                        }),
                    ])
                    .choose("Decide the relationship may simply want a different language than you do.", [
                        adjustStats({ selfRespect: 6, commitment: -14, contentment: -8, pressure: -4 }),
                        alexLook("bittersweet"),
                        alex`I keep trying to make myself want this exact style of love, and maybe that's the part that isn't fair to either of us.`,
                        jamieLook("sad"),
                        jamie`Do you mean you want something else, or that you want out?`,
                        alex`I think I need to stop pretending those are different questions for me.`,
                        jamie`Then I'd rather hear the truth now than six months after we've both gotten quieter.`,
                        ...finishScenario(scene, sceneResult, "social-media-expectations", {
                            endingId: "breakup",
                            endingTitle: "Clean Break",
                            endingMessage:
                                "Alex leaves with more clarity than certainty, choosing not to keep stretching the relationship into a shape that no longer feels honest.",
                            endingLesson:
                                "Not every ending means someone failed. Sometimes it means the comparison uncovered a mismatch that needed honest language, not denial.",
                            endingQuote: "I'd rather hear the truth now than six months after we've both gotten quieter.",
                        }),
                    ]),
            ]),
    ]);
}
