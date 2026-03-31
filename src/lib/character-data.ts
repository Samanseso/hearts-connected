export type CharacterGroup = {
    id: string;
    label: string;
    scenarioTitle: string;
    hook: string;
    profiles: Array<{
        name: string;
        role: string;
        traits: string;
        intro: string;
    }>;
};

export const CHARACTER_GROUPS: CharacterGroup[] = [
    {
        id: "alex-jamie",
        label: "Alex and Jamie",
        scenarioTitle: "Social Media Influence on Relationship Expectations",
        hook: "A caring relationship gets tested when online couple culture starts feeling like a standard to beat.",
        profiles: [
            {
                name: "Alex",
                role: "Player",
                traits: "Idealistic, observant, self-critical",
                intro: "Alex wants a sincere relationship, but curated posts make simple affection feel too small.",
            },
            {
                name: "Jamie",
                role: "Partner",
                traits: "Practical, warm, understated",
                intro: "Jamie shows care through steady effort and quiet presence, not grand romantic performance.",
            },
        ],
    },
    {
        id: "riley-chris",
        label: "Riley and Chris",
        scenarioTitle: "Online Jealousy and Trust Issues",
        hook: "A few likes and follows become emotionally loaded when insecurity fills in the missing context.",
        profiles: [
            {
                name: "Riley",
                role: "Player",
                traits: "Sensitive, introspective, anxious",
                intro: "Riley values honesty but struggles with spirals when digital behavior feels ambiguous.",
            },
            {
                name: "Chris",
                role: "Partner",
                traits: "Friendly, social, reactive",
                intro: "Chris is open online and does not always notice how that visibility can unsettle a partner.",
            },
        ],
    },
    {
        id: "sam-taylor",
        label: "Sam and Taylor",
        scenarioTitle: "Peer Pressure in Dating",
        hook: "A group dynamic pushes romance forward before the people involved are ready to define it for themselves.",
        profiles: [
            {
                name: "Sam",
                role: "Player",
                traits: "Independent, thoughtful, quietly stubborn",
                intro: "Sam wants relationships to happen at an honest pace, even when that means resisting the crowd.",
            },
            {
                name: "Taylor",
                role: "Interest",
                traits: "Kind, low-key, respectful",
                intro: "Taylor prefers clarity and comfort over labels that get assigned from the outside.",
            },
        ],
    },
    {
        id: "jordan-reese",
        label: "Jordan and Reese",
        scenarioTitle: "Comparing Relationships Online",
        hook: "The feed keeps offering perfect snapshots, and Jordan starts measuring real intimacy against them.",
        profiles: [
            {
                name: "Jordan",
                role: "Player",
                traits: "Reflective, curious, self-doubting",
                intro: "Jordan notices emotional shifts early, but comparison makes it hard to trust what is already good.",
            },
            {
                name: "Reese",
                role: "Partner",
                traits: "Steady, reassuring, grounded",
                intro: "Reese believes relationships should fit the people in them, not the audience around them.",
            },
        ],
    },
    {
        id: "casey-morgan",
        label: "Casey and Morgan",
        scenarioTitle: "Commitment Decisions",
        hook: "The future becomes harder to talk about when one person wants clarity and the other fears saying the wrong thing.",
        profiles: [
            {
                name: "Casey",
                role: "Player",
                traits: "Cautious, sincere, growth-oriented",
                intro: "Casey wants to answer honestly, but honesty feels risky when commitment is already on the table.",
            },
            {
                name: "Morgan",
                role: "Partner",
                traits: "Direct, emotionally literate, patient",
                intro: "Morgan can handle uncertainty, but not silence that leaves the relationship undefined for too long.",
            },
        ],
    },
    {
        id: "dana-nico",
        label: "Dana and Nico",
        scenarioTitle: "Dating Norms and Mixed Signals",
        hook: "Soft-launch culture makes everyone think the relationship has a label before Dana and Nico ever choose one.",
        profiles: [
            {
                name: "Dana",
                role: "Player",
                traits: "Socially aware, careful, warm",
                intro: "Dana tries to stay easygoing, but ambiguity starts to feel heavier once other people define the relationship first.",
            },
            {
                name: "Nico",
                role: "Partner",
                traits: "Affectionate, flexible, conflict-averse",
                intro: "Nico likes closeness, but has a habit of avoiding hard definitions until somebody else forces the talk.",
            },
        ],
    },
    {
        id: "lea-micah",
        label: "Lea and Micah",
        scenarioTitle: "Digital Availability and Emotional Support",
        hook: "Being online is not the same as being emotionally available, but the difference can be hard to feel in the moment.",
        profiles: [
            {
                name: "Lea",
                role: "Player",
                traits: "Expressive, loyal, easily overwhelmed",
                intro: "Lea reaches for reassurance quickly when stress is high and silence feels personal.",
            },
            {
                name: "Micah",
                role: "Partner",
                traits: "Caring, busy, imperfectly responsive",
                intro: "Micah wants to be dependable, but work, family pressure, and poor texting habits keep sending mixed signals.",
            },
        ],
    },
];
