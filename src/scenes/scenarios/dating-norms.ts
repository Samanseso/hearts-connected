import { Menu } from "narraleaf-react";
import { createScene6SpritePair, dana, nico, scene6SpriteAssets } from "@/scenes/core/cast";
import {
    adjustStats,
    finishScenario,
    scenarioIntro,
} from "@/scenes/core/helpers";
import { sceneDatingNorms, sceneResult } from "@/scenes/core/scenes";

export function registerDatingNormsScenario() {
    const [danaSprite, nicoSprite] = createScene6SpritePair();

    scene6SpriteAssets.forEach((asset) => sceneDatingNorms.preloadImage(asset));

    sceneDatingNorms.action((scene) => [
        ...scenarioIntro("dating-norms"),
        danaSprite.show({ duration: 500 }),
        nicoSprite.show({ duration: 500 }),
        "A cropped hand photo on Nico's story is enough for the group chat to decide Dana and Nico are suddenly official.",
        dana`I like you. I just don't like the feeling of other people deciding what that means first.`,
        dana`The weird part is how fast people start assuming they know what kind of partner I'm supposed to be once the rumor starts.`,
        nico`Same. I didn't mean for one post to become a relationship announcement.`,
        Menu.prompt("What does Dana do with the sudden label?")
            .choose("Let everyone assume the relationship is official.", [
                adjustStats({ pressure: 10, commitment: 6, communication: -4, anxiety: 4 }),
                dana`If people want to assume things, maybe it's easier not to fight it.`,
                nico`Easy for them, maybe. I'm not sure it feels easy for me.`,
                Menu.prompt("What happens once the label starts feeling heavier?")
                    .choose("Keep the label because correcting it feels awkward now.", [
                        adjustStats({ communication: -8, trust: -6, pressure: 10, contentment: -4 }),
                        dana`Maybe we should just keep going with it since everyone already thinks they know.`,
                        nico`I don't want a relationship that exists because neither of us corrected a rumor.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "drift",
                            endingTitle: "Quiet Drift",
                            endingMessage:
                                "Dana and Nico stay inside a label they never fully chose, and the connection slowly loses ease because it is being managed more than understood.",
                            endingLesson:
                                "Dating norms can turn into pressure when the crowd defines the relationship before the people inside it do.",
                            endingQuote: "I don't want a relationship that exists because neither of us corrected a rumor.",
                        }),
                    ])
                    .choose("Ask Nico for real clarity before it hardens further.", [
                        adjustStats({ communication: 12, trust: 10, pressure: -8, selfRespect: 6 }),
                        dana`I laughed because it felt easier than stopping it, but I don't want other people naming this for us.`,
                        nico`Then let's answer it ourselves instead of inheriting the rumor version.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "clarity",
                            endingTitle: "Defined Together",
                            endingMessage:
                                "Dana reopens the conversation before the borrowed label settles in too deeply, and both people finally define the pace and meaning on purpose.",
                            endingLesson:
                                "Clarity can feel less romantic in the moment, but it protects connection better than assumption usually does.",
                            endingQuote: "Let's answer it ourselves instead of inheriting the rumor version.",
                        }),
                    ]),
            ])
            .choose("Ask Nico privately what the two of you actually mean to each other.", [
                adjustStats({ communication: 12, trust: 8, pressure: -6, anxiety: -4 }),
                dana`Can we talk before the group chat finishes writing our story for us?`,
                nico`Please. I was hoping you would say that.`,
                Menu.prompt("Where does Dana take the talk from here?")
                    .choose("Say clearly what exclusivity and respect would mean to you.", [
                        adjustStats({ communication: 10, trust: 10, selfRespect: 6, commitment: 6 }),
                        dana`If this becomes official, I want it to be because we both chose the same definition, not because the internet softened us into it.`,
                        nico`That actually makes me feel calmer, not cornered.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "clarity",
                            endingTitle: "Defined Together",
                            endingMessage:
                                "Dana and Nico define the relationship directly, turning ambiguity into a more respectful version of closeness rather than a performance.",
                            endingLesson:
                                "Healthy dating norms are not just about labels. They are about shared definitions, consent, and respect.",
                            endingQuote: "I want it to be because we both chose the same definition.",
                        }),
                    ])
                    .choose("Accept that the two of you may want different kinds of connection.", [
                        adjustStats({ selfRespect: 8, commitment: -6, contentment: -2, trust: 4 }),
                        dana`I don't need a dramatic answer. I just need an honest one, even if it doesn't line up with mine.`,
                        nico`Then the honest answer is that I care about you, but I'm not at exclusivity yet.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "mismatch",
                            endingTitle: "Different Paces",
                            endingMessage:
                                "Dana gets the clarity they asked for, but the clarity reveals a real mismatch in pacing that kindness alone cannot erase.",
                            endingLesson:
                                "Not every honest conversation ends in agreement, but clarity still protects both people from a more confusing hurt later.",
                            endingQuote: "I care about you, but I'm not at exclusivity yet.",
                        }),
                    ]),
            ])
            .choose("Act detached so nobody can make the connection feel bigger than it is.", [
                adjustStats({ selfRespect: -4, communication: -6, anxiety: 6, pressure: 4 }),
                dana`People read way too much into everything. It's really not that serious.`,
                nico`Okay. If that's where you are, I won't push it.`,
                Menu.prompt("What does Dana do after creating that distance?")
                    .choose("Keep the distance and let the connection fade on its own.", [
                        adjustStats({ trust: -8, contentment: -8, communication: -4, commitment: -4 }),
                        dana`I thought detachment would protect me. Mostly it just made everything colder.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "drift",
                            endingTitle: "Quiet Drift",
                            endingMessage:
                                "Dana protects against pressure by sounding detached, but the distance eventually hollows out the connection more than the rumors would have.",
                            endingLesson:
                                "Detachment can feel safer than clarity, but it often leaves both people living inside confusion for longer.",
                            endingQuote: "Mostly it just made everything colder.",
                        }),
                    ])
                    .choose("Admit the distance was self-protection and restart honestly.", [
                        adjustStats({ communication: 12, trust: 10, anxiety: -6, selfRespect: 6 }),
                        dana`I acted casual because I didn't want other people pushing us somewhere before we were ready. That wasn't the same as me not caring.`,
                        nico`Then let's talk like we care and stop letting the performance set the tone.`,
                        ...finishScenario(scene, sceneResult, "dating-norms", {
                            endingId: "clarity",
                            endingTitle: "Defined Together",
                            endingMessage:
                                "Dana repairs the self-protective distance with an honest explanation, giving the relationship a clearer and more respectful starting point.",
                            endingLesson:
                                "Clarity often arrives after awkwardness. What matters is whether someone is willing to return and say what they really meant.",
                            endingQuote: "Let's talk like we care and stop letting the performance set the tone.",
                        }),
                    ]),
            ]),
    ]);
}





