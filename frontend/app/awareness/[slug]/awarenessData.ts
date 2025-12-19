export interface AwarenessContent {
  title: string;
  slug: string;
  category: string;
  heroImage: string;
  intro: string;
  keyPoints: string[];
  whatIs: string;
  whatIsExtended?: string;
  symptoms: Array<{
    title: string;
    description: string;
  }>;
  causes?: string[];
  statistics?: Array<{
    value: string;
    description: string;
  }>;
  treatmentApproach: Array<{
    title: string;
    description: string;
  }>;
}

export const awarenessContent: Record<string, AwarenessContent> = {
  anxiety: {
    title: "Anxiety",
    slug: "anxiety",
    category: "Mental Health",
    heroImage: "/awareness_hero/anxiety.png",
    intro: "Anxiety is a natural response to stress, but when it becomes persistent and overwhelming, it can significantly impact daily life. Understanding anxiety is the first step toward managing it effectively.",
    keyPoints: ["Common & Treatable", "Multiple Types", "Manageable with Support"],
    whatIs: "Anxiety is a feeling of worry, nervousness, or unease about something with an uncertain outcome. While occasional anxiety is a normal part of life, anxiety disorders involve more than temporary worry or fear. For people with anxiety disorders, the anxiety does not go away and can get worse over time, interfering with daily activities such as job performance, school work, and relationships.",
    whatIsExtended: "Anxiety disorders are the most common mental health concern in many countries, affecting millions of people. They can manifest in various forms, including generalized anxiety disorder (GAD), panic disorder, social anxiety disorder, and specific phobias. Each type has unique characteristics, but they all share the common feature of excessive fear or worry that interferes with daily functioning.",
    symptoms: [
      {
        title: "Physical Symptoms",
        description: "Rapid heartbeat, sweating, trembling, shortness of breath, dizziness, muscle tension, fatigue, and sleep disturbances."
      },
      {
        title: "Emotional Symptoms",
        description: "Feelings of apprehension, dread, restlessness, irritability, and a constant sense of being on edge or overwhelmed."
      },
      {
        title: "Cognitive Symptoms",
        description: "Excessive worry, racing thoughts, difficulty concentrating, catastrophic thinking, and persistent fear of worst-case scenarios."
      },
      {
        title: "Behavioral Symptoms",
        description: "Avoidance of anxiety-provoking situations, difficulty making decisions, seeking constant reassurance, and restlessness."
      }
    ],
    causes: [
      "Genetic predisposition",
      "Brain chemistry imbalances",
      "Environmental stressors",
      "Traumatic experiences",
      "Medical conditions",
      "Substance use"
    ],
    statistics: [
      {
        value: "1 in 5",
        description: "Adults experience anxiety disorders each year"
      },
      {
        value: "31%",
        description: "Of adults will experience an anxiety disorder at some point in their lives"
      }
    ],
    treatmentApproach: [
      {
        title: "Cognitive Behavioral Therapy (CBT)",
        description: "Learn to identify and challenge negative thought patterns that contribute to anxiety, developing healthier coping strategies."
      },
      {
        title: "Mindfulness & Relaxation",
        description: "Practice techniques like deep breathing, meditation, and progressive muscle relaxation to manage physical symptoms of anxiety."
      },
      {
        title: "Lifestyle Modifications",
        description: "Explore how sleep, exercise, nutrition, and stress management can significantly impact anxiety levels."
      }
    ]
  },
  depression: {
    title: "Depression",
    slug: "depression",
    category: "Mental Health",
    heroImage: "/awareness_hero/Depression.jpg",
    intro: "Depression is more than just feeling sad—it's a serious mental health condition that affects how you think, feel, and handle daily activities. With proper understanding and support, recovery is possible.",
    keyPoints: ["Highly Treatable", "Not a Weakness", "Recovery is Possible"],
    whatIs: "Depression is a mood disorder that causes persistent feelings of sadness, hopelessness, and loss of interest in activities once enjoyed. It affects how you think, feel, and behave, and can lead to a variety of emotional and physical problems. Depression is not a sign of weakness or something you can simply 'snap out of'—it requires understanding, support, and often professional treatment.",
    whatIsExtended: "Major depressive disorder affects millions of people worldwide and can occur at any age. It can be triggered by various factors including genetics, brain chemistry, life events, and medical conditions. Depression can range from mild to severe, and symptoms can vary from person to person. The good news is that depression is highly treatable, and many people find relief through therapy, lifestyle changes, and support.",
    symptoms: [
      {
        title: "Emotional Symptoms",
        description: "Persistent sadness, emptiness, hopelessness, irritability, frustration, loss of interest in activities, feelings of worthlessness or guilt."
      },
      {
        title: "Physical Symptoms",
        description: "Fatigue, changes in sleep patterns (insomnia or oversleeping), changes in appetite, unexplained aches and pains, slowed thinking or movement."
      },
      {
        title: "Cognitive Symptoms",
        description: "Difficulty concentrating, making decisions, remembering details, negative thinking patterns, and thoughts of death or suicide."
      },
      {
        title: "Behavioral Changes",
        description: "Withdrawal from social activities, decreased productivity, changes in daily routines, and difficulty maintaining responsibilities."
      }
    ],
    causes: [
      "Biological factors",
      "Brain chemistry",
      "Hormonal changes",
      "Genetic factors",
      "Life events",
      "Medical conditions"
    ],
    statistics: [
      {
        value: "280+ million",
        description: "People worldwide live with depression"
      },
      {
        value: "60-80%",
        description: "Of people respond well to treatment"
      }
    ],
    treatmentApproach: [
      {
        title: "Psychotherapy",
        description: "Work with a therapist to explore thoughts, feelings, and behaviors, develop coping strategies, and address underlying issues contributing to depression."
      },
      {
        title: "Behavioral Activation",
        description: "Gradually increase engagement in meaningful activities and social connections to improve mood and break the cycle of depression."
      },
      {
        title: "Self-Care & Support",
        description: "Learn about the importance of sleep, exercise, nutrition, and building a strong support network in managing depression."
      }
    ]
  },
  stress: {
    title: "Stress",
    slug: "stress",
    category: "Mental Health",
    heroImage: "/awareness_hero/stress.jpg",
    intro: "Stress is your body's natural response to challenges and demands. While some stress can be motivating, chronic stress can take a toll on your mental and physical well-being.",
    keyPoints: ["Normal Response", "Manageable", "Preventable"],
    whatIs: "Stress is a physical, mental, and emotional response to life's challenges and demands. It's a normal part of life that can help you stay alert, focused, and ready to avoid danger. However, when stress becomes chronic or overwhelming, it can negatively impact your health, relationships, and quality of life. Understanding stress and learning to manage it effectively is crucial for maintaining mental and physical well-being.",
    whatIsExtended: "Stress can be categorized into acute stress (short-term response to immediate challenges) and chronic stress (ongoing stress that persists over time). While acute stress can be beneficial, chronic stress can lead to serious health problems including anxiety, depression, heart disease, and weakened immune function. The key is learning to recognize stress triggers and developing healthy coping mechanisms.",
    symptoms: [
      {
        title: "Physical Signs",
        description: "Headaches, muscle tension, chest pain, fatigue, sleep problems, digestive issues, and changes in appetite."
      },
      {
        title: "Emotional Signs",
        description: "Anxiety, restlessness, lack of motivation, irritability, anger, sadness, and feeling overwhelmed."
      },
      {
        title: "Cognitive Signs",
        description: "Racing thoughts, constant worrying, forgetfulness, difficulty concentrating, poor judgment, and negative thinking."
      },
      {
        title: "Behavioral Signs",
        description: "Changes in eating or sleeping patterns, social withdrawal, procrastination, increased use of substances, and nervous behaviors."
      }
    ],
    causes: [
      "Work pressure",
      "Financial concerns",
      "Relationship issues",
      "Major life changes",
      "Health problems",
      "Time management"
    ],
    statistics: [
      {
        value: "77%",
        description: "Of people regularly experience physical symptoms caused by stress"
      },
      {
        value: "73%",
        description: "Report experiencing psychological symptoms of stress"
      }
    ],
    treatmentApproach: [
      {
        title: "Stress Management Techniques",
        description: "Learn practical strategies like time management, prioritization, and boundary-setting to reduce stress in daily life."
      },
      {
        title: "Relaxation Methods",
        description: "Practice breathing exercises, progressive muscle relaxation, and mindfulness to activate your body's relaxation response."
      },
      {
        title: "Lifestyle Balance",
        description: "Explore how regular exercise, healthy eating, adequate sleep, and social support can build resilience against stress."
      }
    ]
  },
  "relationship-issues": {
    title: "Relationship Issues",
    slug: "relationship-issues",
    category: "Interpersonal",
    heroImage: "/awareness_hero/relationship.jpg",
    intro: "Healthy relationships are fundamental to well-being, but challenges in communication, trust, and emotional connection can create significant distress. Understanding these patterns can help build stronger connections.",
    keyPoints: ["Common Challenges", "Improvement Possible", "Skills Can Be Learned"],
    whatIs: "Relationship issues encompass a wide range of challenges that can occur in romantic partnerships, friendships, family relationships, or professional connections. These issues often stem from communication breakdowns, unmet needs, trust problems, conflict resolution difficulties, or differences in values and expectations. When relationship problems persist, they can significantly impact mental health, self-esteem, and overall quality of life.",
    whatIsExtended: "Every relationship faces challenges, but persistent issues can lead to emotional distress, anxiety, depression, and isolation. Common relationship problems include poor communication, lack of intimacy, trust issues, financial conflicts, and difficulty managing boundaries. The good news is that relationship skills can be learned and improved with awareness, effort, and sometimes professional guidance.",
    symptoms: [
      {
        title: "Communication Problems",
        description: "Difficulty expressing needs, frequent misunderstandings, avoiding difficult conversations, and feeling unheard or misunderstood."
      },
      {
        title: "Trust Issues",
        description: "Jealousy, suspicion, difficulty trusting others, fear of betrayal, and past hurts affecting current relationships."
      },
      {
        title: "Emotional Disconnection",
        description: "Feeling distant, lack of intimacy, emotional unavailability, and difficulty connecting on a deeper level."
      },
      {
        title: "Conflict Patterns",
        description: "Frequent arguments, inability to resolve disagreements, unhealthy conflict styles, and resentment building over time."
      }
    ],
    causes: [
      "Poor communication skills",
      "Unresolved past trauma",
      "Different values or goals",
      "Lack of boundaries",
      "Unmet emotional needs",
      "Life stressors"
    ],
    statistics: [
      {
        value: "50%",
        description: "Of marriages end in divorce, often due to communication issues"
      },
      {
        value: "65%",
        description: "Of relationship problems stem from communication breakdowns"
      }
    ],
    treatmentApproach: [
      {
        title: "Communication Skills Training",
        description: "Learn effective listening, assertiveness, and conflict resolution techniques to improve how you express needs and understand others."
      },
      {
        title: "Emotional Intelligence",
        description: "Develop self-awareness and empathy to better understand your own emotions and those of your partner or loved ones."
      },
      {
        title: "Boundary Setting",
        description: "Learn to establish healthy boundaries, respect others' boundaries, and create relationships based on mutual respect and understanding."
      }
    ]
  },
  "self-esteem": {
    title: "Self-Esteem",
    slug: "self-esteem",
    category: "Personal Development",
    heroImage: "/awareness_hero/Self-Esteem-2.png",
    intro: "Self-esteem is how you perceive and value yourself. When self-esteem is low, it can affect every aspect of your life—from relationships to career success. Building healthy self-esteem is a journey worth taking.",
    keyPoints: ["Buildable", "Affects Everything", "Journey of Growth"],
    whatIs: "Self-esteem refers to your overall sense of self-worth and personal value. It's how you see yourself and how you believe others perceive you. Healthy self-esteem means having a balanced, realistic view of yourself—recognizing your strengths while accepting your limitations. Low self-esteem involves persistent negative beliefs about yourself, often leading to self-criticism, comparison with others, and difficulty accepting compliments or achievements.",
    whatIsExtended: "Self-esteem develops throughout life and is influenced by experiences, relationships, achievements, and internal dialogue. Low self-esteem can stem from childhood experiences, trauma, social comparison, perfectionism, or critical environments. The good news is that self-esteem can be improved through self-awareness, challenging negative beliefs, building competence, and developing self-compassion.",
    symptoms: [
      {
        title: "Negative Self-Talk",
        description: "Constant self-criticism, focusing on flaws, discounting achievements, and harsh inner dialogue that undermines confidence."
      },
      {
        title: "Social Withdrawal",
        description: "Avoiding social situations, fear of judgment, difficulty asserting needs, and tendency to isolate from others."
      },
      {
        title: "Perfectionism",
        description: "Setting unrealistically high standards, fear of making mistakes, all-or-nothing thinking, and difficulty accepting imperfection."
      },
      {
        title: "Comparison & Envy",
        description: "Constantly comparing yourself to others, feeling inadequate, difficulty celebrating others' success, and feeling 'less than'."
      }
    ],
    causes: [
      "Childhood experiences",
      "Critical environments",
      "Trauma or abuse",
      "Social media comparison",
      "Unrealistic standards",
      "Lack of achievement"
    ],
    statistics: [
      {
        value: "85%",
        description: "Of people worldwide struggle with low self-esteem"
      },
      {
        value: "70%",
        description: "Of girls feel they don't measure up in some way"
      }
    ],
    treatmentApproach: [
      {
        title: "Cognitive Restructuring",
        description: "Identify and challenge negative self-beliefs, replace self-critical thoughts with compassionate, realistic self-talk."
      },
      {
        title: "Self-Compassion Practice",
        description: "Learn to treat yourself with kindness, recognize common humanity, and develop mindfulness around self-judgment."
      },
      {
        title: "Achievement & Growth",
        description: "Set realistic goals, celebrate small wins, build competence through skill development, and recognize your inherent worth."
      }
    ]
  },
  trauma: {
    title: "Trauma",
    slug: "trauma",
    category: "Mental Health",
    heroImage: "/awareness_hero/trauma-2.png",
    intro: "Trauma is an emotional response to a deeply distressing or disturbing event. Understanding trauma and its effects is crucial for healing and recovery. You are not alone, and healing is possible.",
    keyPoints: ["Healing Possible", "Not Your Fault", "Recovery Takes Time"],
    whatIs: "Trauma is an emotional response to a terrible event like an accident, abuse, natural disaster, or other deeply distressing experience. Trauma can result from a single event or from ongoing exposure to stressful situations. It affects how you think, feel, and relate to others. Trauma responses are normal reactions to abnormal situations—your body and mind's way of trying to protect you.",
    whatIsExtended: "Trauma can be categorized as acute (resulting from a single incident), chronic (repeated and prolonged exposure), or complex (exposure to multiple traumatic events, often in childhood). Trauma affects everyone differently, and there's no 'right' or 'wrong' way to respond. Common responses include shock, denial, flashbacks, emotional numbness, anxiety, and difficulty trusting others. With proper support and treatment, people can heal from trauma and reclaim their lives.",
    symptoms: [
      {
        title: "Intrusive Memories",
        description: "Flashbacks, nightmares, distressing memories, emotional distress when reminded of the event, and physical reactions to triggers."
      },
      {
        title: "Avoidance",
        description: "Avoiding thoughts, feelings, people, places, or activities that remind you of the trauma, and emotional numbness."
      },
      {
        title: "Negative Changes in Thinking",
        description: "Negative thoughts about yourself or others, hopelessness, memory problems, difficulty maintaining relationships, and feeling detached."
      },
      {
        title: "Changes in Reactivity",
        description: "Being easily startled, always on guard, self-destructive behavior, trouble sleeping, difficulty concentrating, and irritability."
      }
    ],
    causes: [
      "Physical or sexual abuse",
      "Accidents or injuries",
      "Natural disasters",
      "Violence or assault",
      "Loss of loved ones",
      "Medical trauma"
    ],
    statistics: [
      {
        value: "70%",
        description: "Of adults have experienced at least one traumatic event"
      },
      {
        value: "20%",
        description: "Of people who experience trauma develop PTSD"
      }
    ],
    treatmentApproach: [
      {
        title: "Trauma-Informed Therapy",
        description: "Work with trained professionals using evidence-based approaches like EMDR, trauma-focused CBT, or somatic therapies to process traumatic memories."
      },
      {
        title: "Safety & Stabilization",
        description: "Learn grounding techniques, emotional regulation skills, and create a sense of safety before processing traumatic memories."
      },
      {
        title: "Post-Traumatic Growth",
        description: "Explore how healing from trauma can lead to increased resilience, deeper relationships, and a renewed sense of purpose and meaning."
      }
    ]
  }
};
