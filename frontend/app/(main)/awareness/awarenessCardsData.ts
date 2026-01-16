export interface AwarenessCard {
  title: string;
  slug: string;
  description: string;
  image: string;
}

export const awarenessAreas: AwarenessCard[] = [
  {
    title: "Anxiety",
    slug: "anxiety",
    description: "Persistent worry, fear, or unease that can interfere with daily life.",
    image: "/awareness_hero/new_anxiety.webp",
  },
  {
    title: "Depression",
    slug: "depression",
    description: "Feelings of sadness, emptiness, or hopelessness lasting over time.",
    image: "/awareness_hero/Depression.webp",
  },
  {
    title: "Stress",
    slug: "stress",
    description: "Mental and emotional strain caused by overwhelming situations.",
    image: "/awareness_hero/new_stress.webp",
  },
  {
    title: "Relationship Issues",
    slug: "relationship-issues",
    description: "Challenges in communication, trust, or emotional connection.",
    image: "/awareness_hero/relationship.webp",
  },
  {
    title: "Self-Esteem",
    slug: "self-esteem",
    description: "Struggles with self-worth, confidence, and self-acceptance.",
    image: "/awareness_hero/new_self-esteem.webp",
  },
  {
    title: "Trauma",
    slug: "trauma",
    description: "Emotional responses to deeply distressing experiences.",
    image: "/awareness_hero/new_trauma.webp",
  },
];
