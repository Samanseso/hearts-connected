import { Menu } from "narraleaf-react";
import { createScene3SpritePair, narra, sam, scene3SpriteAssets, taylor } from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    genderWord,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { scenePeerPressure, sceneResult } from "@/scenes/core/scenes";

export function registerPeerPressureScenario() {
    const [samSprite, taylorSprite] = createScene3SpritePair();

    scene3SpriteAssets.forEach((asset) => scenePeerPressure.preloadImage(asset));

    scenePeerPressure.action((scene) => [
        ...scenarioIntro("peer-pressure"),
        samSprite.show({ duration: 500 }),
        taylorSprite.show({ duration: 500 }),
        sam`Lunch should feel normal, but my friends have decided my love life is apparently a group project.`,
        sam`They're joking, but the joke keeps landing on the same point: last single ${genderWord("guy", "girl")} in the friend group, so clearly I need fixing.`,
        "A chorus of voices keeps pushing one idea.",
        narra`Friend 1: You're the only single one left!`,
        narra`Friend 2: Taylor literally likes talking to you. Just date already!`,
        taylor`For what it's worth, I would prefer not to be volunteered like a class representative.`,
        Menu.prompt("How does Sam respond to the pressure?")
            .choose("Say yes because refusing in public feels even more awkward.", [
                adjustStats({ pressure: 10, selfRespect: -8, commitment: 6, communication: -4 }),
                sam`Fine. Sure. If everybody is that invested, we can try it.`,
                taylor`That sounded less like a yes and more like a hostage note.`,
                sam`I'm just trying not to turn lunch into a whole scene.`,
                taylor`I get that. I just don't want us starting something because the room got loud.`,
                Menu.prompt("What does Sam do after the forced yes?")
                    .choose("Keep dating Taylor anyway so nobody has to feel embarrassed.", [
                        adjustStats({ selfRespect: -8, contentment: -6, pressure: 10, anxiety: 4 }),
                        sam`Maybe it will feel real if we give it enough time.`,
                        taylor`Maybe. But I keep feeling like we're performing calm for everybody else's comfort.`,
                        sam`I know. Every hangout feels pre-labeled before it starts.`,
                        taylor`Then maybe we were set up to disappoint each other from the beginning.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "forced",
                            endingTitle: "Awkward Start",
                            endingMessage:
                                "Sam and Taylor try to make a pressured beginning turn authentic, but the relationship never quite escapes the fact that it was chosen under social pressure.",
                            endingLesson:
                                "Consent and timing matter even when both people are kind. A forced beginning can still shape the whole tone of the connection.",
                            endingQuote: "Every hangout feels pre-labeled before it starts.",
                        }),
                    ])
                    .choose("Talk to Taylor privately and reset the situation honestly.", [
                        adjustStats({ communication: 12, selfRespect: 10, pressure: -8, trust: 8 }),
                        sam`You deserve a real yes, not the version I gave because I didn't want to be teased.`,
                        taylor`Thank you. Honestly, I'd rather be respected than chosen by accident.`,
                        sam`Could we go back to getting to know each other without the group writing the script?`,
                        taylor`Yeah. That feels way more human.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "honest-growth",
                            endingTitle: "Soft Landing",
                            endingMessage:
                                "Sam corrects the pressured start before it becomes a full relationship built on obligation, and Taylor meets that honesty with grace.",
                            endingLesson:
                                "Owning a pressured decision early can still create a respectful outcome, even if it means stepping back from the original label.",
                            endingQuote: "I'd rather be respected than chosen by accident.",
                        }),
                    ]),
            ])
            .choose("Say clearly that you are not ready to date just because everyone else is.", [
                adjustStats({ selfRespect: 12, pressure: -12, communication: 8, contentment: 4 }),
                sam`I'm not anti-love. I'm just not interested in treating dating like a deadline.`,
                narra`Friend 1: Okay, that was... more solid than I expected.`,
                narra`Friend 2: Fair enough. We were teasing, but that's fair.`,
                taylor`For the record, I respect that answer a lot.`,
                Menu.prompt("How does Sam handle the moment with Taylor afterward?")
                    .choose("Leave it there and enjoy the relief of holding the boundary.", [
                        adjustStats({ selfRespect: 10, contentment: 8, anxiety: -4 }),
                        sam`I think I needed to hear myself say it too. Being single is not the same thing as being behind.`,
                        taylor`Exactly. People act like timing is a competition when it's really just personal.`,
                        sam`That might be the nicest way anyone has put it to me all month.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "self-respect",
                            endingTitle: "Own Pace",
                            endingMessage:
                                "Sam protects their boundaries without turning the moment hostile, and the result feels more confident than lonely.",
                            endingLesson:
                                "Self-respect is not anti-romance. It is often what makes future connection healthier when it finally does happen.",
                            endingQuote: "Being single is not the same thing as being behind.",
                        }),
                    ])
                    .choose("Tell Taylor you still want to know them, just without the pressure.", [
                        adjustStats({ communication: 10, trust: 8, commitment: 4, pressure: -4 }),
                        sam`I meant what I said, but I also don't want that answer to sound like rejection by default. I'd still like to hang out sometime if you're open to that.`,
                        taylor`That sounds honest, which makes it a lot easier to trust.`,
                        sam`Coffee without the whole audience?`,
                        taylor`Coffee without the audience.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "honest-growth",
                            endingTitle: "Honest Growth",
                            endingMessage:
                                "Sam chooses boundaries first and interest second, giving the connection room to grow without being cornered by the group.",
                            endingLesson:
                                "Pressure falls away when people are allowed to define the pace of intimacy for themselves.",
                            endingQuote: "Coffee without the audience.",
                        }),
                    ]),
            ])
            .choose("Suggest getting to know Taylor first, without calling it dating yet.", [
                adjustStats({ communication: 10, pressure: -6, selfRespect: 6, trust: 4 }),
                sam`I don't want a label assigned by committee, but I would be open to actually talking to Taylor like a person.`,
                narra`Friend 1: That's annoyingly mature of you.`,
                taylor`I'll take annoyingly mature over weirdly rushed.`,
                sam`Good, because I was not going to survive the rushed version.`,
                Menu.prompt("What tone does Sam set next?")
                    .choose("Keep it low-pressure and let the connection stay undefined for now.", [
                        adjustStats({ trust: 10, contentment: 8, selfRespect: 6, anxiety: -2 }),
                        sam`Let's just hang out and see if conversation feels easy without anybody narrating it.`,
                        taylor`That sounds nice, actually. Low stakes is underrated.`,
                        sam`So we're agreed. No debut announcement, no surprise status update, no joking wedding hashtags.`,
                        taylor`I can absolutely commit to not letting our first coffee become content.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "honest-growth",
                            endingTitle: "Slow Start, Real Start",
                            endingMessage:
                                "Sam and Taylor create room for something genuine precisely because they refuse to rush into a label for the audience's benefit.",
                            endingLesson:
                                "Exploration becomes healthier when both people stay free to be curious instead of immediately obligated.",
                            endingQuote: "Low stakes is underrated.",
                        }),
                    ])
                    .choose("Let the friend group keep framing every interaction like a public soft launch.", [
                        adjustStats({ pressure: 8, selfRespect: -4, contentment: -4, communication: -2 }),
                        sam`I thought I could ignore the commentary, but now every text feels like evidence in a case I never opened.`,
                        taylor`Same. I like you more when it feels like ours and less when it feels like a running joke.`,
                        sam`Then maybe I should've protected the pace more carefully from the start.`,
                        ...finishScenario(scene, sceneResult, "peer-pressure", {
                            endingId: "forced",
                            endingTitle: "Crowded Beginning",
                            endingMessage:
                                "Sam chooses the gentler route, but never fully shuts the crowd out, and the outside pressure keeps crowding the connection.",
                            endingLesson:
                                "A healthy start still needs boundaries. Without them, other people's expectations can quietly retake control.",
                            endingQuote: "I like you more when it feels like ours.",
                        }),
                    ]),
            ]),
    ]);
}




