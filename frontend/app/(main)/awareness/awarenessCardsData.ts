export interface AwarenessCard {
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[]; // Added for search functionality
}

export const awarenessAreas: AwarenessCard[] = [
  {
    title: "Anxiety",
    slug: "anxiety",
    description: "Persistent worry, fear, or unease that can interfere with daily life.",
    image: "/awareness_hero/new_anxiety.webp",
    tags: ["panic", "nervous", "fear", "worry", "stress", "palpitations", "overthinking", "unease"]
  },
  {
    title: "Depression",
    slug: "depression",
    description: "Feelings of sadness, emptiness, or hopelessness lasting over time.",
    image: "/awareness_hero/Depression.webp",
    tags: ["sad", "lonely", "cry", "hopeless", "empty", "suicide", "unhappy", "grief", "low mood"]
  },
  {
    title: "Stress",
    slug: "stress",
    description: "Mental and emotional strain caused by overwhelming situations.",
    image: "/awareness_hero/new_stress.webp",
    tags: ["pressure", "overwhelmed", "busy", "tension", "burnout", "work", "strain"]
  },
  {
    title: "ADHD",
    slug: "adhd",
    description: "A condition affecting focus, impulse control, and executive function.",
    image: "/awareness_hero/adhd-new.webp",
    tags: ["focus", "distracted", "hyper", "attention", "forgetful", "procrastination", "impulsive"]
  },
  {
    title: "OCD",
    slug: "ocd",
    description: "Unwanted intrusive thoughts and repetitive behaviors performed to reduce anxiety.",
    image: "/awareness_hero/ocd.webp",
    tags: ["cleaning", "checking", "obsessive", "compulsive", "ritual", "germs", "intrusive", "thoughts"]
  },
  {
    title: "Bipolar Disorder",
    slug: "bipolar",
    description: "Extreme mood swings that include emotional highs (mania) and lows (depression).",
    image: "/awareness_hero/bipolar.webp",
    tags: ["mood", "manic", "mania", "swings", "high", "low", "energy", "cycle"]
  },
  {
    title: "Burnout",
    slug: "burnout",
    description: "Emotional, physical, and mental exhaustion caused by prolonged stress.",
    image: "/awareness_hero/burnout.webp",
    tags: ["tired", "exhausted", "work", "job", "fatigue", "drained", "cynical", "weary"]
  },
  {
    title: "Eating Disorders",
    slug: "eating-disorders",
    description: "Persistent eating behaviors that negatively impact health and emotions.",
    image: "/awareness_hero/eating_disorders.webp",
    tags: ["food", "weight", "anorexia", "bulimia", "binge", "starving", "purge", "body image", "diet"]
  },
  {
    title: "Insomnia",
    slug: "insomnia",
    description: "Persistent difficulty falling or staying asleep, impairing daily functioning.",
    image: "/awareness_hero/insomnia.webp",
    tags: ["sleep", "awake", "tired", "night", "restless", "waking up", "sleepless"]
  },
  {
    title: "Substance Addiction",
    slug: "substance-addiction",
    description: "Compulsive substance use despite harmful consequences to health and life.",
    image: "/awareness_hero/substance.webp",
    tags: ["drugs", "alcohol", "drinking", "smoking", "dependence", "rehab", "abuse", "addict"]
  },
  {
    title: "Relationship Issues",
    slug: "relationship-issues",
    description: "Challenges in communication, trust, or emotional connection.",
    image: "/awareness_hero/relationship.webp",
    tags: ["love", "partner", "marriage", "divorce", "breakup", "communication", "fight", "dating", "trust"]
  },
  {
    title: "Self-Esteem",
    slug: "self-esteem",
    description: "Struggles with self-worth, confidence, and self-acceptance.",
    image: "/awareness_hero/new_self-esteem.webp",
    tags: ["confidence", "shy", "worthless", "insecure", "hate myself", "ugly", "value"]
  },
  {
    title: "Trauma",
    slug: "trauma",
    description: "Emotional responses to deeply distressing experiences.",
    image: "/awareness_hero/new_trauma.webp",
    tags: ["abuse", "accident", "shock", "hurt", "violence", "distress", "pain"]
  },
  {
    title: "PTSD",
    slug: "ptsd",
    description: "A disorder developing after a terrifying event, involving flashbacks and anxiety.",
    image: "/awareness_hero/ptsd.webp",
    tags: ["flashback", "nightmare", "trauma", "trigger", "war", "assault", "hypervigilance"]
  },
  {
    title: "Social Anxiety",
    slug: "social-anxiety",
    description: "Intense, persistent fear of being watched and judged by others.",
    image: "/awareness_hero/social_anxiety.webp",
    tags: ["public speaking", "shy", "embarrassed", "judged", "crowd", "people", "introvert", "social"]
  },
  {
    title: "BPD",
    slug: "bpd",
    description: "Instability in moods, behavior, self-image, and functioning.",
    image: "/awareness_hero/bpd.webp",
    tags: ["borderline", "abandonment", "mood swings", "impulsive", "unstable", "intense", "relationships"]
  },
  {
    title: "Schizophrenia",
    slug: "schizophrenia",
    description: "A condition affecting how a person thinks, feels, and acts clearly.",
    image: "/awareness_hero/schizophrenia.webp",
    tags: ["voices", "hallucination", "delusion", "psychosis", "paranoid", "reality", "mind"]
  },
  {
    title: "Grief",
    slug: "grief",
    description: "The natural, multifaceted response to losing someone or something important.",
    image: "/awareness_hero/grief.webp",
    tags: ["death", "loss", "mourning", "died", "cry", "miss", "bereavement", "funeral"]
  },
];