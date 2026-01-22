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
    heroImage: "/awareness_hero/new_anxiety.webp",
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
    heroImage: "/awareness_hero/Depression.webp",
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
    heroImage: "/awareness_hero/new_stress.webp",
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
    heroImage: "/awareness_hero/relationship.webp",
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
    heroImage: "/awareness_hero/new_Self-Esteem-2.webp",
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
    heroImage: "/awareness_hero/new_trauma.webp",
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
  },
  adhd: {
    title: "ADHD (Attention Deficit Hyperactivity Disorder)",
    slug: "adhd",
    category: "Neurodevelopmental",
    heroImage: "/awareness_hero/adhd-new.webp",
    intro: "ADHD is not just about being distracted; it's a complex neurodevelopmental condition affecting focus, impulse control, and executive function. With the right strategies, it can be managed effectively.",
    keyPoints: ["Neurobiological", "Executive Function", "managable Strengths"],
    whatIs: "ADHD is a chronic condition that affects millions of children and often continues into adulthood. It includes a combination of persistent problems, such as difficulty sustaining attention, hyperactivity, and impulsive behavior. In adults, it often presents as difficulty with time management, organization, goal setting, and holding down a job.",
    whatIsExtended: "ADHD is largely genetic and relates to how the brain processes dopamine and regulates executive functions. It is generally categorized into three types: predominantly inattentive, predominantly hyperactive-impulsive, and combined presentation. Many adults with ADHD have developed coping mechanisms that mask their symptoms, leading to late diagnosis.",
    symptoms: [
      {
        title: "Inattention",
        description: "Difficulty sustaining focus, overlooking details, trouble listening when spoken to, losing things, and poor organizational skills."
      },
      {
        title: "Hyperactivity & Impulsivity",
        description: "Fidgeting, inability to sit still, excessive talking, interrupting others, and acting without thinking of consequences."
      },
      {
        title: "Emotional Dysregulation",
        description: "Low frustration tolerance, frequent mood swings, temper outbursts, and difficulty coping with stress."
      },
      {
        title: "Executive Dysfunction",
        description: "Chronic procrastination, difficulty starting tasks (task paralysis), time blindness, and trouble prioritizing responsibilities."
      }
    ],
    causes: [
      "Genetics (hereditary)",
      "Brain structure differences",
      "Premature birth",
      "Environmental toxins",
      "Brain injury",
    ],
    statistics: [
      {
        value: "4-5%",
        description: "Of adults worldwide have ADHD"
      },
      {
        value: "3x",
        description: "Males are diagnosed more often than females, though females are often underdiagnosed"
      }
    ],
    treatmentApproach: [
      {
        title: "Medication Management",
        description: "Stimulant and non-stimulant medications can help regulate brain chemistry to improve focus and impulse control."
      },
      {
        title: "CBT & Coaching",
        description: "Cognitive Behavioral Therapy and ADHD coaching help develop practical skills for organization, time management, and emotional regulation."
      },
      {
        title: "Environmental Structuring",
        description: "Creating supportive environments, using planners, alarms, and breaking tasks into smaller steps to reduce overwhelm."
      }
    ]
  },
  ocd: {
    title: "OCD (Obsessive-Compulsive Disorder)",
    slug: "ocd",
    category: "Mental Health",
    heroImage: "/awareness_hero/ocd.webp",
    intro: "OCD is characterized by unwanted intrusive thoughts and repetitive behaviors performed to alleviate anxiety. It is a challenging condition, but evidence-based treatments can provide significant relief.",
    keyPoints: ["Intrusive Thoughts", "Compulsive Rituals", "Treatable Cycle"],
    whatIs: "Obsessive-Compulsive Disorder (OCD) is a disorder in which people have recurring, unwanted thoughts, ideas, or sensations (obsessions) that make them feel driven to do something repetitively (compulsions). The repetitive behaviors, such as hand washing, checking on things, or cleaning, can significantly interfere with a person's daily activities and social interactions.",
    whatIsExtended: "The cycle of OCD involves the obsession (triggering anxiety), the compulsion (performed to reduce anxiety), and temporary relief, which reinforces the cycle. OCD is not simply about being tidy or organized; it is a debilitating condition where the sufferer often recognizes their thoughts are irrational but feels powerless to stop them.",
    symptoms: [
      {
        title: "Obsessions",
        description: "Fear of germs/contamination, unwanted forbidden thoughts, aggressive thoughts towards others or self, and needing things symmetrical."
      },
      {
        title: "Compulsions",
        description: "Excessive cleaning/handwashing, ordering and arranging things, repeatedly checking on things (e.g., door locks), and compulsive counting."
      },
      {
        title: "Emotional Distress",
        description: "Intense anxiety when things aren't 'right', guilt or shame over intrusive thoughts, and a constant sense of doubt."
      },
      {
        title: "Avoidance",
        description: "Avoiding situations that trigger obsessions, such as shaking hands or touching doorknobs."
      }
    ],
    causes: [
      "Biological factors",
      "Genetic predisposition",
      "Brain structure differences",
      "Childhood trauma",
      "PANDAS (in children)"
    ],
    statistics: [
      {
        value: "1.2%",
        description: "Of the population has OCD"
      },
      {
        value: "19",
        description: "Average age of onset for OCD"
      }
    ],
    treatmentApproach: [
      {
        title: "Exposure and Response Prevention (ERP)",
        description: "The gold standard therapy involving gradual exposure to feared objects or obsessions while refusing to do the compulsive ritual."
      },
      {
        title: "Medication",
        description: "SSRIs (Selective Serotonin Reuptake Inhibitors) are often used to help control obsessions and compulsions."
      },
      {
        title: "Mindfulness-Based CBT",
        description: "Learning to observe intrusive thoughts without engaging with them or judging them."
      }
    ]
  },
  bipolar: {
    title: "Bipolar Disorder",
    slug: "bipolar",
    category: "Mood Disorder",
    heroImage: "/awareness_hero/bipolar.webp",
    intro: "Bipolar disorder causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). Management and stability are achievable with the right care plan.",
    keyPoints: ["Mood Cycles", "Lifelong Management", "Stability Possible"],
    whatIs: "Bipolar disorder (formerly called manic depression) is a mental health condition that causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). When you become depressed, you may feel sad or hopeless and lose interest or pleasure in most activities. When your mood shifts to mania, you may feel euphoric, full of energy, or unusually irritable.",
    whatIsExtended: "There are several types of bipolar disorder (Bipolar I, Bipolar II, Cyclothymic Disorder). Bipolar I involves severe manic episodes, while Bipolar II involves depressive episodes and hypomania (less severe mania). These mood shifts can affect sleep, energy, activity, judgment, behavior, and the ability to think clearly.",
    symptoms: [
      {
        title: "Manic/Hypomanic Symptoms",
        description: "Increased energy, jumpiness, euphoria, exaggerated self-confidence, less need for sleep, racing thoughts, and impulsive decision-making."
      },
      {
        title: "Depressive Symptoms",
        description: "Depressed mood, loss of interest, significant weight loss/gain, insomnia or sleeping too much, fatigue, and feelings of worthlessness."
      },
      {
        title: "Cognitive Symptoms",
        description: "During mania: racing thoughts and distractibility. During depression: difficulty concentrating and forgetfulness."
      },
      {
        title: "Behavioral Changes",
        description: "Risky behavior (spending sprees, reckless driving) during mania; withdrawal and inactivity during depression."
      }
    ],
    causes: [
      "Biological differences",
      "Genetics",
      "Neurotransmitter imbalances",
      "High stress periods",
      "Drug or alcohol abuse"
    ],
    statistics: [
      {
        value: "2.8%",
        description: "Of US adults experienced bipolar disorder in the past year"
      },
      {
        value: "83%",
        description: "Of cases are classified as severe"
      }
    ],
    treatmentApproach: [
      {
        title: "Mood Stabilizers",
        description: "Medication is usually the cornerstone of treatment to balance moods and prevent episodes."
      },
      {
        title: "Psychotherapy",
        description: "Interpersonal and social rhythm therapy (IPSRT) helps stabilize daily rhythms (sleep, wake, meal times) which is crucial for mood management."
      },
      {
        title: "Lifestyle Management",
        description: "Strict adherence to sleep schedules, avoiding substances, and stress reduction are vital for long-term stability."
      }
    ]
  },
  burnout: {
    title: "Burnout",
    slug: "burnout",
    category: "Occupational Phenomenon",
    heroImage: "/awareness_hero/burnout.webp",
    intro: "Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands.",
    keyPoints: ["Exhaustion", "Detachment", "Inefficacy"],
    whatIs: "Burnout is a syndrome conceptualized as resulting from chronic workplace stress that has not been successfully managed. It is characterized by three dimensions: feelings of energy depletion or exhaustion; increased mental distance from one’s job, or feelings of negativism or cynicism related to one's job; and reduced professional efficacy.",
    whatIsExtended: "While often related to work, burnout can also occur in caregiving roles or parenting. It differs from general stress; stress involves 'too much' (pressures that demand too much of you), while burnout is about 'not enough' (feeling empty, devoid of motivation, and beyond caring). People experiencing burnout often don't see any hope of positive change in their situations.",
    symptoms: [
      {
        title: "Physical Exhaustion",
        description: "Chronic fatigue, insomnia, physical symptoms like chest pain or palpitations, shortness of breath, and lowered immunity."
      },
      {
        title: "Emotional Detachment",
        description: "Sense of failure and self-doubt, feeling helpless, trapped, and defeated. detachment, feeling alone in the world."
      },
      {
        title: "Cynicism & Negativity",
        description: "Negative outlook on work and life, loss of enjoyment, pessimism, and isolation from others."
      },
      {
        title: "Reduced Performance",
        description: "Difficulty concentrating, lack of creativity, missing deadlines, and procrastination."
      }
    ],
    causes: [
      "Unmanageable workloads",
      "Unfair treatment at work",
      "Lack of role clarity",
      "Lack of communication/support",
      "Unreasonable time pressure"
    ],
    statistics: [
      {
        value: "77%",
        description: "Of employees have experienced burnout at their current job"
      },
      {
        value: "63%",
        description: "Of employees are more likely to take a sick day when experiencing burnout"
      }
    ],
    treatmentApproach: [
      {
        title: "Rest & Recovery",
        description: "Taking time off is often necessary to reset the body's stress response system."
      },
      {
        title: "Boundary Setting",
        description: "Learning to say no, disconnecting from work after hours, and re-establishing work-life balance."
      },
      {
        title: "Value Re-alignment",
        description: "Re-evaluating career goals and personal values to ensure your daily activities align with what matters to you."
      }
    ]
  },
  "eating-disorders": {
    title: "Eating Disorders",
    slug: "eating-disorders",
    category: "Mental Health",
    heroImage: "/awareness_hero/eating_disorders.webp",
    intro: "Eating disorders are serious conditions related to persistent eating behaviors that negatively impact your health, your emotions, and your ability to function in important areas of life.",
    keyPoints: ["Serious Illness", "Not a Choice", "Recovery Possible"],
    whatIs: "Eating disorders are behavioral conditions characterized by severe and persistent disturbance in eating behaviors and associated distressing thoughts and emotions. They can be very serious conditions affecting physical, psychological and social function. Types include Anorexia Nervosa, Bulimia Nervosa, and Binge-Eating Disorder.",
    whatIsExtended: "These disorders are often associated with a preoccupation with food, weight, or body shape, or with anxiety about eating or the consequences of eating certain foods. Behaviors can range from restrictive eating to binge eating, purging, or excessive exercise. Eating disorders are not a lifestyle choice; they are biologically influenced medical illnesses.",
    symptoms: [
      {
        title: "Behavioral Signs",
        description: "Skipping meals, rigid eating rituals, binge eating, purging, excessive exercise, and frequent checking in the mirror."
      },
      {
        title: "Physical Signs",
        description: "Significant weight fluctuations, gastrointestinal complaints, dizziness, sleep issues, dry skin/hair, and muscle weakness."
      },
      {
        title: "Emotional Signs",
        description: "Extreme mood swings, withdrawal from friends, intense fear of weight gain, and self-worth tied to body shape."
      },
      {
        title: "Cognitive Signs",
        description: "Obsessive thoughts about food, weight, and calories; distorted body image (dysmorphia)."
      }
    ],
    causes: [
      "Genetics and biology",
      "Psychological health",
      "Cultural pressure",
      "Peer pressure",
      "Emotional trauma"
    ],
    statistics: [
      {
        value: "9%",
        description: "Of the worldwide population is affected by an eating disorder"
      },
      {
        value: "2nd",
        description: "Highest mortality rate of any mental illness (after opioid overdose)"
      }
    ],
    treatmentApproach: [
      {
        title: "Nutritional Rehabilitation",
        description: "Working with a dietitian to restore healthy eating patterns and weight."
      },
      {
        title: "Psychotherapy",
        description: "Family-based therapy (FBT) and CBT are effective in addressing the underlying thoughts and behaviors."
      },
      {
        title: "Medical Monitoring",
        description: "Regular health checks to address physical complications arising from the disorder."
      }
    ]
  },
  insomnia: {
    title: "Insomnia",
    slug: "insomnia",
    category: "Sleep Disorder",
    heroImage: "/awareness_hero/insomnia.webp",
    intro: "Insomnia is the persistent difficulty in falling or staying asleep, leading to impaired daytime functioning. It is the most common sleep disorder but is highly treatable with behavioral changes.",
    keyPoints: ["Sleep Quality", "Daytime Impact", "CBT-I Effective"],
    whatIs: "Insomnia is a sleep disorder where you have trouble falling asleep, staying asleep, or getting good quality sleep. This happens even if you have the time and the right environment to sleep well. Insomnia can get in the way of your daily activities and may make you feel sleepy during the day.",
    whatIsExtended: "Insomnia can be short-term (acute), often triggered by stress or traumatic events, or long-term (chronic), lasting for a month or more. It is not defined by the number of hours you sleep, but by the quality of sleep and how you feel the next day. Chronic insomnia can lead to serious health problems like high blood pressure, heart disease, and diabetes.",
    symptoms: [
      {
        title: "Sleep Onset/Maintenance",
        description: "Lying awake for a long time before falling asleep, waking up often during the night, or waking up too early and not being able to get back to sleep."
      },
      {
        title: "Daytime Impairment",
        description: "Excessive daytime sleepiness, fatigue, grumpiness, difficulty concentrating, and increased errors or accidents."
      },
      {
        title: "Sleep Anxiety",
        description: "Worrying about sleep even before bed, feeling stressed as bedtime approaches, and checking the clock repeatedly."
      },
      {
        title: "Physical Distress",
        description: "Tension headaches, gastrointestinal symptoms, and low energy/motivation."
      }
    ],
    causes: [
      "Stress and anxiety",
      "Poor sleep habits",
      "Caffeine/alcohol use",
      "Chronic pain",
      "Medications",
      "Irregular schedules"
    ],
    statistics: [
      {
        value: "30-50%",
        description: "Of adults experience short-term insomnia symptoms annually"
      },
      {
        value: "10%",
        description: "Of the population suffers from chronic insomnia disorder"
      }
    ],
    treatmentApproach: [
      {
        title: "CBT-I (Cognitive Behavioral Therapy for Insomnia)",
        description: "The first-line treatment that helps you identify and replace thoughts and behaviors that cause or worsen sleep problems."
      },
      {
        title: "Sleep Hygiene",
        description: "Establishing a consistent sleep schedule, creating a relaxing bedtime routine, and optimizing the sleep environment (cool, dark, quiet)."
      },
      {
        title: "Stimulus Control",
        description: "Re-associating the bed with sleep by only going to bed when tired and leaving if you can't sleep within 20 minutes."
      }
    ]
  },
  "substance-addiction": {
    title: "Substance Addiction",
    slug: "substance-addiction",
    category: "Addiction",
    heroImage: "/awareness_hero/substance.webp",
    intro: "Addiction is a complex condition, a brain disease that is manifested by compulsive substance use despite harmful consequence. Recovery requires patience, support, and often medical intervention.",
    keyPoints: ["Brain Disease", "Compulsive Use", "Recovery is a Journey"],
    whatIs: "Substance addiction (Substance Use Disorder) is a chronic, relapsing disorder characterized by compulsive drug seeking and use despite adverse consequences. It involves functional changes to brain circuits involved in reward, stress, and self-control. It is considered a brain disorder because it involves functional changes to brain circuits involved in reward, stress, and self-control.",
    whatIsExtended: "Addiction is not a sign of moral weakness or a lack of willpower. Substances hijack the brain's reward system, flooding it with dopamine and creating a powerful craving that overrides normal survival instincts. Over time, the brain builds tolerance, requiring more of the substance to feel the same effect, and withdrawal symptoms occur when the substance is stopped.",
    symptoms: [
      {
        title: "Impaired Control",
        description: "Using more than intended, wanting to cut down but failing, and spending a lot of time getting, using, or recovering from the substance."
      },
      {
        title: "Social Impairment",
        description: "Failing to fulfill major role obligations at work, school, or home; giving up social, occupational, or recreational activities."
      },
      {
        title: "Risky Use",
        description: "Using in physically hazardous situations (e.g., driving) and continuing use despite knowing it is causing physical or psychological problems."
      },
      {
        title: "Pharmacological Criteria",
        description: "Tolerance (needing more for same effect) and Withdrawal (physical/mental symptoms when stopping)."
      }
    ],
    causes: [
      "Genetic predisposition",
      "Environmental factors",
      "Peer pressure",
      "Early use",
      "Method of administration",
      "Trauma or abuse"
    ],
    statistics: [
      {
        value: "35 million",
        description: "People worldwide suffer from drug use disorders"
      },
      {
        value: "40-60%",
        description: "Of vulnerability to addiction is attributable to genetics"
      }
    ],
    treatmentApproach: [
      {
        title: "Detoxification & Medical Management",
        description: "Safely managing acute physical symptoms of withdrawal, often with medication assistance (MAT)."
      },
      {
        title: "Behavioral Counseling",
        description: "Therapies like CBT and Contingency Management to modify attitudes and behaviors related to drug use and increase healthy life skills."
      },
      {
        title: "Long-Term Follow-up",
        description: "Ongoing support through recovery groups (like 12-step programs), sober living environments, and relapse prevention planning."
      }
    ]
  },
  ptsd: {
    title: "PTSD (Post-Traumatic Stress Disorder)",
    slug: "ptsd",
    category: "Trauma-Related",
    heroImage: "/awareness_hero/ptsd.webp",
    intro: "PTSD is a condition that can develop after experiencing a shocking, scary, or dangerous event. It keeps the body's 'fight-or-flight' response active long after the danger has passed.",
    keyPoints: ["Re-experiencing", "Avoidance", "Hyperarousal"],
    whatIs: "Post-Traumatic Stress Disorder (PTSD) is a psychiatric disorder that may occur in people who have experienced or witnessed a traumatic event such as a natural disaster, a serious accident, a terrorist act, war/combat, or violent personal assault. While it is normal to feel afraid during and after a traumatic situation, people with PTSD don't recover naturally and continue to feel stressed or frightened even when they are safe.",
    whatIsExtended: "Symptoms usually begin within 3 months of the traumatic incident, but they sometimes begin years afterward. Symptoms must last more than a month and be severe enough to interfere with relationships or work to be considered PTSD. The course of the illness varies; some people recover within 6 months, while others have symptoms that last much longer and become chronic.",
    symptoms: [
      {
        title: "Re-experiencing Symptoms",
        description: "Flashbacks (reliving the trauma over and over), bad dreams, and frightening thoughts."
      },
      {
        title: "Avoidance Symptoms",
        description: "Staying away from places, events, or objects that are reminders of the traumatic experience; avoiding thoughts or feelings related to the event."
      },
      {
        title: "Arousal and Reactivity",
        description: "Being easily startled, feeling tense or 'on edge' (hypervigilance), having difficulty sleeping, and having angry outbursts."
      },
      {
        title: "Cognitive and Mood Symptoms",
        description: "Trouble remembering key features of the traumatic event, negative thoughts about oneself or the world, distorted feelings like guilt or blame."
      }
    ],
    causes: [
      "Life-threatening experiences",
      "Trauma history",
      "Brain chemistry",
      "Lack of social support",
      "Genetic risks"
    ],
    statistics: [
      {
        value: "6%",
        description: "Of the population will have PTSD at some point in their lives"
      },
      {
        value: "Women",
        description: "Are twice as likely as men to develop PTSD"
      }
    ],
    treatmentApproach: [
      {
        title: "Trauma-Focused Therapies",
        description: "Cognitive Processing Therapy (CPT) and Prolonged Exposure (PE) are highly effective in processing the traumatic memory."
      },
      {
        title: "EMDR",
        description: "Eye Movement Desensitization and Reprocessing helps the brain process traumatic memories so they are less distressing."
      },
      {
        title: "Medication",
        description: "Antidepressants can help control symptoms of sadness, worry, anger, and feeling numb inside."
      }
    ]
  },
  "social-anxiety": {
    title: "Social Anxiety Disorder",
    slug: "social-anxiety",
    category: "Anxiety Disorder",
    heroImage: "/awareness_hero/social_anxiety.webp",
    intro: "Social anxiety is an intense, persistent fear of being watched and judged by others. It goes beyond simple shyness and can stop you from doing everyday things.",
    keyPoints: ["Fear of Judgment", "Avoidance", "Treatable"],
    whatIs: "Social Anxiety Disorder (formerly social phobia) is characterized by an overwhelming fear of social situations. People with this condition suffer from an intense fear of being criticized, rejected, or judged by others. This fear can be so severe that it interferes with work, school, and other ordinary activities.",
    whatIsExtended: "While many people feel nervous before a presentation or a date, social anxiety involves a level of fear that is out of proportion to the situation. It often starts in the teenage years. Sufferers may worry for days or weeks before an event, and the anxiety can persist afterward as they analyze how they acted and worry about what others thought of them.",
    symptoms: [
      {
        title: "Physical Symptoms",
        description: "Blushing, sweating, trembling, rapid heart rate, muscle tension, and feeling your mind go blank."
      },
      {
        title: "Emotional Symptoms",
        description: "Intense fear of interacting with strangers, fear of physical symptoms causing embarrassment, and expecting the worst consequences."
      },
      {
        title: "Behavioral Avoidance",
        description: "Avoiding attending parties, eating in front of others, asking questions in class, or using public restrooms."
      },
      {
        title: "Post-Event Analysis",
        description: "Spending time after a social situation analyzing your performance and identifying perceived flaws in your interactions."
      }
    ],
    causes: [
      "Brain structure (Amygdala)",
      "Environment/Upbringing",
      "Genetics",
      "Negative past experiences",
      "Parental modeling"
    ],
    statistics: [
      {
        value: "15 million",
        description: "American adults have social anxiety disorder"
      },
      {
        value: "36%",
        description: "Wait 10+ years before seeking help"
      }
    ],
    treatmentApproach: [
      {
        title: "CBT (Cognitive Behavioral Therapy)",
        description: "Teaches you different ways of thinking, behaving, and reacting to situations to help you feel less anxious and fearful."
      },
      {
        title: "Exposure Therapy",
        description: "Gradually exposing yourself to uncomfortable social situations in a safe environment to build confidence."
      },
      {
        title: "Group Therapy",
        description: "Learning social skills and interacting with people who have the same problem to realize you are not alone."
      }
    ]
  },
  bpd: {
    title: "Borderline Personality Disorder",
    slug: "bpd",
    category: "Personality Disorder",
    heroImage: "/awareness_hero/bpd.webp",
    intro: "BPD is a mental health disorder that impacts the way you think and feel about yourself and others, causing problems functioning in everyday life. It includes self-image issues and difficulty managing emotions.",
    keyPoints: ["Emotional Instability", "Fear of Abandonment", "DBT is Effective"],
    whatIs: "Borderline Personality Disorder (BPD) is characterized by a pervasive pattern of instability in interpersonal relationships, self-image, and affects, and marked impulsivity. People with BPD often have an intense fear of abandonment or instability, and they may have difficulty tolerating being alone. Yet inappropriate anger, impulsiveness, and frequent mood swings may push others away, even though they want to have loving and lasting relationships.",
    whatIsExtended: "BPD usually begins by early adulthood. The condition seems to be worse in young adulthood and may gradually get better with age. Individuals with BPD are very sensitive to environmental circumstances. Seemingly small events can trigger intense reactions. For example, a minor separation from a loved one might trigger intense anxiety or anger.",
    symptoms: [
      {
        title: "Intense Fear of Abandonment",
        description: "Going to extreme measures to avoid real or imagined separation or rejection."
      },
      {
        title: "Unstable Relationships",
        description: "A pattern of intense and unstable relationships, often swinging from extreme closeness and love (idealization) to extreme dislike or anger (devaluation)."
      },
      {
        title: "Identity Disturbance",
        description: "Distorted and unstable self-image or sense of self. Values, goals, and career plans may change frequently."
      },
      {
        title: "Impulsivity",
        description: "Impulsive and risky behavior, such as gambling, reckless driving, unsafe sex, spending sprees, or binge eating."
      }
    ],
    causes: [
      "Genetic predisposition",
      "Brain abnormalities",
      "Childhood trauma/Abuse",
      "Neglect",
      "Invalidating environments"
    ],
    statistics: [
      {
        value: "1.6%",
        description: "Of the general population has BPD"
      },
      {
        value: "75%",
        description: "Of people diagnosed are women (though men are often misdiagnosed)"
      }
    ],
    treatmentApproach: [
      {
        title: "Dialectical Behavior Therapy (DBT)",
        description: "The gold standard for BPD treatment. Focuses on teaching skills to control intense emotions, reduce self-destructive behaviors, and improve relationships."
      },
      {
        title: "Schema Therapy",
        description: "Focuses on identifying and changing deep-seated patterns or themes in thinking, feeling, and behaving."
      },
      {
        title: "Mentalization-Based Therapy (MBT)",
        description: "A talk therapy that helps people identify and understand what others might be thinking and feeling."
      }
    ]
  },
  schizophrenia: {
    title: "Schizophrenia",
    slug: "schizophrenia",
    category: "Psychotic Disorder",
    heroImage: "/awareness_hero/schizophrenia.webp",
    intro: "Schizophrenia is a chronic brain disorder that affects how a person thinks, feels, and acts. Although it is a lifelong condition, effective treatments can help people engage in school, work, and relationships.",
    keyPoints: ["Altered Reality", "Treatable", "Requires Support"],
    whatIs: "Schizophrenia is a serious mental illness that interferes with a person's ability to think clearly, manage emotions, make decisions, and relate to others. It is a complex, long-term medical illness. It is characterized by thoughts or experiences that seem out of touch with reality, disorganized speech or behavior, and decreased participation in daily activities.",
    whatIsExtended: "Schizophrenia is not a split personality or multiple-personality disorder. It involves psychosis, a type of mental illness in which a person can't tell what is real from what is imagined. Symptoms can come and go. When the disease is active, it can be characterized by episodes in which the patient is unable to distinguish between real and unreal experiences.",
    symptoms: [
      {
        title: "Positive Symptoms (Psychosis)",
        description: "Hallucinations (hearing/seeing things that aren't there) and delusions (fixed false beliefs not based in reality)."
      },
      {
        title: "Negative Symptoms",
        description: "Reduced ability to function normally, such as neglecting personal hygiene, appearing to lack emotion (flat affect), and loss of interest in life."
      },
      {
        title: "Disorganized Thinking",
        description: "Trouble organizing thoughts or connecting them logically; speech may be garbled or hard to understand."
      },
      {
        title: "Cognitive Symptoms",
        description: "Problems with attention, concentration, and memory; difficulty processing information to make decisions."
      }
    ],
    causes: [
      "Genetics",
      "Brain chemistry/Structure",
      "Viral infections",
      "Birth complications",
      "Psychosocial factors"
    ],
    statistics: [
      {
        value: "1 in 300",
        description: "People worldwide (0.32%) are affected by schizophrenia"
      },
      {
        value: "Top 15",
        description: "Leading causes of disability worldwide"
      }
    ],
    treatmentApproach: [
      {
        title: "Antipsychotic Medications",
        description: "Central to treatment, these reduce the intensity and frequency of psychotic symptoms."
      },
      {
        title: "Psychosocial Treatments",
        description: "CBT, behavioral skills training, and supported employment help patients deal with everyday challenges."
      },
      {
        title: "Coordinated Specialty Care (CSC)",
        description: "A team approach involving medication, therapy, case management, and family support, especially effective for early-stage schizophrenia."
      }
    ]
  },
  grief: {
    title: "Grief & Loss",
    slug: "grief",
    category: "Emotional Wellness",
    heroImage: "/awareness_hero/grief.webp",
    intro: "Grief is the natural reaction to loss. It is a unique, personal experience that has no set timeline, but understanding the process can help you navigate the waves of emotion.",
    keyPoints: ["Natural Process", "Non-linear", "Personal Journey"],
    whatIs: "Grief is the acute pain that accompanies the loss of something or someone important. While usually associated with the death of a loved one, grief can also follow the loss of a job, a relationship (divorce/breakup), health, or a cherished dream. It is a multifaceted response that affects your emotions, thoughts, body, and behavior.",
    whatIsExtended: "There is no 'right' way to grieve. The famous 'Five Stages of Grief' (Denial, Anger, Bargaining, Depression, Acceptance) are not a rigid roadmap; people often skip stages or cycle through them in a different order. Complicated Grief (or Prolonged Grief Disorder) occurs when the feelings of loss are debilitating and don't improve even after time passes, preventing you from resuming your life.",
    symptoms: [
      {
        title: "Emotional Waves",
        description: "Profound sadness, yearning, shock, numbness, anger, guilt, and fear. These feelings often come in waves or 'bursts'."
      },
      {
        title: "Physical Sensations",
        description: "Hollowness in the stomach, tightness in the chest, throat tightness, fatigue, insomnia, and loss of appetite."
      },
      {
        title: "Cognitive Effects",
        description: "Disbelief, confusion, preoccupation with the loss, hallucinations (thinking you see/hear the deceased), and brain fog."
      },
      {
        title: "Social Changes",
        description: "Withdrawing from others, feeling detached from daily life, or feeling that others 'don't understand' your pain."
      }
    ],
    causes: [
      "Death of a loved one",
      "Divorce or breakup",
      "Loss of health",
      "Loss of job/financial stability",
      "Miscarriage",
      "Loss of a pet"
    ],
    statistics: [
      {
        value: "2.5 million",
        description: "People die in the US annually, leaving an average of 5 grieving people behind each"
      },
      {
        value: "10-20%",
        description: "Of grievers develop Complicated Grief requiring professional support"
      }
    ],
    treatmentApproach: [
      {
        title: "Grief Counseling",
        description: "Provides a space to express feelings, retell the story of the loss, and learn to live with the new reality."
      },
      {
        title: "Support Groups",
        description: "Connecting with others who have experienced similar losses can reduce isolation and validate your feelings."
      },
      {
        title: "Rituals & Memorials",
        description: "Creating intentional ways to honor the loss can help process emotions and create a sense of ongoing connection."
      }
    ]
  }
};
