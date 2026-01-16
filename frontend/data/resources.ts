export interface Resource {
  id: string;
  title: string;
  authorOrSource: string;
  description: string;
  type: 'Book' | 'Website' | 'Video' | 'Course';
  category: 'Core Books' | 'Academic & Clinical' | 'Video & Lecture';
  link: string;
  longSummary?: string; 
}

const detailedSummaries = {
  giftOfTherapy: `
### Overview
The Gift of Therapy is a culmination of Irvin Yalom's forty-five years of clinical practice. It is an open letter to a new generation of therapists and their patients. Yalom advises students to avoid sectarianism and diagnosis-based therapy, and instead focus on the "here and now" of the therapeutic relationship.

### Key Themes

#### 1. The Therapeutic Relationship
Yalom argues that the most important factor in effective therapy is the bond between therapist and client. He encourages therapists to be authentic, transparent, and empathetic. He believes that the diagnosis is often less important than the relationship itself.

#### 2. The Here and Now
A central concept in Yalom's work is focusing on what is happening in the room between the therapist and client in the present moment. This "here and now" focus acts as a microcosm of the client's life outside therapy.

#### 3. Obstacles to Growth
Yalom discusses common obstacles to therapy, such as resistance, transference, and countertransference. He provides practical advice on how to navigate these challenges without losing the therapeutic alliance.

#### 4. Death and Meaning
Drawing from his existential background, Yalom addresses the importance of confronting ultimate concerns like death, isolation, freedom, and meaninglessness. He suggests that anxiety often stems from these existential fears.

### Detailed Chapter Breakdown

**Chapter 1: Remove the Obstacles to Growth**
Therapy is not about "curing" a patient, but removing the obstacles that prevent their natural growth. Just as an acorn grows into an oak tree if obstacles are removed, humans will strive towards self-actualization.

**Chapter 2: Avoid Diagnosis (Except for Insurance)**
Diagnosis can distance the therapist from the patient. It focuses on pathology rather than the person. While necessary for administrative purposes, it should not dictate the course of therapy.

**Chapter 3: Therapist and Patient as "Fellow Travelers"**
The traditional hierarchy of doctor-patient is replaced with the concept of "fellow travelers." Both are facing the same existential human condition. This reduces the isolation of the patient and humanizes the therapist.

(This summary continues for detailed depth...)
  `,
  theoryPractice: `
### Overview
Gerald Corey's "Theory and Practice of Counseling and Psychotherapy" is widely considered the standard text for counseling students. It provides a comprehensive overview of the major theories of counseling and how they can be applied in practice.

### Major Theories Covered

#### Psychoanalytic Therapy
Focuses on unconscious factors, early life experiences, and development. Key figures include Freud. Corey explains techniques like free association and dream analysis.

#### Adlerian Therapy
Based on the belief that human behavior is goal-directed and socially embedded. It focuses on feelings of inferiority and the striving for superiority.

#### Existential Therapy
Explores the central themes of human existence: death, freedom, responsibility, and meaning. It is less technique-oriented and more focused on the philosophical foundation of the client's life.

#### Person-Centered Therapy
Developed by Carl Rogers, this approach emphasizes the client's capacity for self-healing and growth. The therapist provides empathy, unconditional positive regard, and congruence.

#### Gestalt Therapy
Focuses on the present moment and the "what and how" of experiencing. It aims to integrate fragmented parts of the personality.

#### Behavior Therapy
Focuses on observable behavior and current determinants of behavior. It uses scientific principles to help clients change maladaptive behaviors.

#### Cognitive Behavior Therapy (CBT)
Emphasizes the role of thinking in how we feel and act. It aims to identify and challenge invalid or irrational thoughts.

### Integration
Corey advocates for an integrative approach, encouraging students to develop their own personal style of counseling by drawing from various theories. He provides a framework for how to synthesize these different approaches.
  `,
  mentalHealthWorkbook: `
### Overview
James Morrison's workbook is a practical guide designed to help clinicians refine their diagnostic and interviewing skills. It bridges the gap between theoretical knowledge and clinical application.

### Key Features

#### 1. Clinical Evaluation
The book provides detailed instructions on how to conduct a thorough clinical evaluation. This includes the initial interview, mental status examination, and gathering collateral information.

#### 2. Differential Diagnosis
Morrison emphasizes the importance of differential diagnosis—distinguishing between conditions with similar symptoms. He provides decision trees and algorithms to aid in this process.

#### 3. Case Studies
The workbook is filled with rich case examples that illustrate common and complex clinical scenarios. Readers are invited to work through these cases to practice their skills.

#### 4. Interviewing Techniques
Practical advice on what to say, how to phrase questions, and when to probe deeper. Morrison covers difficult topics like suicide assessment, substance use, and trauma.

### Practical Application
Each chapter focuses on a specific skill set, followed by exercises. This allows clinicians to "lock in" their skills through repetition and practice. It is an essential resource for keeping professional skills sharp.
  `,
  relationshipsWork: `
### Overview
John Norcross's "Psychotherapy Relationships That Work" is a compendium of research on the therapeutic alliance. It answers the question: "What works in the therapy relationship?"

### Evidence-Based Elements

#### 1. Empathy
Research consistently shows that therapist empathy is highly correlated with positive treatment outcomes. The book defines empathy and how to effectively communicate it.

#### 2. Alliance
The collaborative bond between therapist and client (the alliance) is one of the strongest predictors of success. Norcross details how to build, maintain, and repair the alliance.

#### 3. Goal Consensus
Therapy works best when the therapist and client agree on the goals of treatment and the tasks necessary to achieve them.

#### 4. Positive Regard
Demonstrating non-possessive warmth and caring for the client is fundamental.

### Customizing Therapy
The book basically argues against a "one size fits all" approach. It provides evidence for tailoring the relationship style to the individual client's characteristics, such as their resistance level, coping style, and stage of change.
  `,
  cbtBeck: `
### Overview
This foundational text by Aaron T. Beck introduces the cognitive model of emotional disorders. It explains how distorted thinking leads to emotional distress and behavioral problems.

### Core Concepts

#### 1. The Cognitive Triad
In depression, patients have a negative view of:
*   Themselves (I am worthless)
*   The World (The world is unfair)
*   The Future (It will never get better)

#### 2. Cognitive Distortions
Beck identifies common errors in thinking, such as:
*   **All-or-Nothing Thinking:** Viewing situations in only two categories.
*   **Overgeneralization:** Seeing a negative event as a never-ending pattern of defeat.
*   **Mental Filter:** Dwelling on the negatives and ignoring positives.

#### 3. Automatic Thoughts
These are fleeting thoughts that occur spontaneously. Beck teaches how to identify these thoughts and evaluate their validity.

### Treatment Process
The book outlines the structure of CBT sessions, including setting an agenda, checking mood, reviewing homework, and teaching skills. It emphasizes a collaborative empirical approach where the patient and therapist work together to test the validity of the patient's beliefs.
   `,
  existentialYalom: `
### Overview
Irvin Yalom's "Existential Psychotherapy" is the definitive text on the subject. It organizes the field around four "ultimate concerns" of life.

### The Four Ultimate Concerns

#### 1. Death
The inevitable fact of our mortality. The conflict between the awareness of death and the desire to continue to be.

#### 2. Freedom
The absence of external structure. We are responsible for our own choices, actions, and life situation. This responsibility can be terrifying (existential isolation).

#### 3. Isolation
No matter how close we become to another, there remains a final, unbridgeable gap. We enter existence alone and we must leave it alone.

#### 4. Meaninglessness
If we must die, if we constitute our own world, if each is ultimately alone, then what meaning is there in life?

### Clinical Application
Yalom explores how these concerns manifest in clinical symptoms (e.g., anxiety as a fear of death). He provides therapeutic strategies to help clients confront these givens and live more authentically.
   `,
  systemsProchaska: `
### Overview
This text provides a transtheoretical analysis of the major systems of psychotherapy. It looks for common principles of change across different schools of thought.

### The Transtheoretical Model (Stages of Change)
Prochaska and Norcross introduce the famous Stages of Change model:
1.  **Precontemplation:** Not ready to change.
2.  **Contemplation:** Thinking about change.
3.  **Preparation:** Getting ready to change.
4.  **Action:** Making the change.
5.  **Maintenance:** Sustaining the change.

### Processes of Change
The authors identify processes like consciousness-raising, counter-conditioning, and helping relationships that facilitate movement through the stages.

### Integrative Approach
The book helps therapists understand which interventions are most effective at which stage of change, regardless of their theoretical orientation.
   `,
  apaWeb: `
### Overview of APA Resources
The American Psychological Association (APA) is the leading scientific and professional organization representing psychology in the United States. Their website is a treasure trove of resources for both professionals and the public.

### Key Sections

#### 1. Psychology Help Center
Articles and guides on managing stress, anxiety, depression, and other mental health/lifestyle issues. It provides evidence-based advice for the general public.

#### 2. Publications and Databases
Access to journals like the *American Psychologist* and databases like PsycINFO. This is crucial for accessing the latest research.

#### 3. Education and Career
Resources for students and professionals about psychology careers, accreditation, and continuing education.

#### 4. News and Advocacy
Updates on how psychology impacts society, including legislative advocacy for mental health parity and funding.

### Utility for Therapists
The APA website is "highly reliable" because it is backed by the largest body of psychologists. It is a go-to for ethical guidelines, practice standards, and the latest scientific findings.
   `,
  nimhWeb: `
### Overview
The National Institute of Mental Health (NIMH) is the lead federal agency for research on mental disorders.

### Resource Highlights

#### 1. Health Topics
Comprehensive, science-based information on specific disorders (Autism, Bipolar Disorder, Depression, Schizophrenia, etc.).

#### 2. Statistics
Data on the prevalence and impact of mental illness in the US.

#### 3. Clinical Trials
Information on participating in research studies and finding new treatments.

#### 4. Brochures and Fact Sheets
Free, downloadable materials that therapists can give to clients to explain diagnoses and treatment options.

### Value
NIMH resources are authoritative and free of commercial bias. They provide the "gold standard" medical/scientific view on mental health conditions.
   `,
  openLearn: `
### Overview
OpenLearn is the free learning platform of The Open University. It offers free courses derived from their formal catalogue.

### Relevant Modules

#### 1. Introduction to Counselling
Explores the core concepts of counseling, listening skills, and the therapeutic relationship.

#### 2. Understanding Mental Health
Modules that look at mental health from social, psychological, and biological perspectives.

#### 3. Psychology of Childhood
Courses focusing on developmental psychology and the needs of children/adolescents.

### Features
*   **Badges/Statements of Participation:** You can earn recognition for completing modules.
*   **Accessibility:** Content is available in various formats (video, audio, text).
*   **Quality:** Produced by a leading UK university.
   `
};

export const resources: Resource[] = [
  
  {
    id: 'b1',
    title: 'The Gift of Therapy',
    authorOrSource: 'Irvin D. Yalom',
    description: 'Best for understanding the human side of therapy. Focuses on the therapist–client relationship, presence, and process over technique. Very readable and conversational.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Gift-Therapy-generation-therapists-patients/dp/0749923733/ref=sr_1_2?crid=SV351HA1QV39&dib=eyJ2IjoiMSJ9.vUi5qUnoG9g5VKnLjR5dOLzE6XgERuBlAKFP72TNNdx5NaqU8WzOlNv3Ov3q3jz_5nAmKse0Jg8189hSs9eGdNntQZ0iX7EAp0Y21ASPZglvyuabAs2KcRu7AZtDVq-4uF5MzAPGl7PVXff9UvjsA4my6wanWSQJ6BVaHQPU0Tx2E1hmqpwf4XlYHPXp0h_svTxp0g5ePR5RPDUQkRm0rvaOuzz8CLg5pvUwWueQJFhyRsOElByuAgfYHFGku84w4_7dtid_i2CHPpQroHpsQL8q0hySlxTSVLAP7rXBaIY.L9Fr5jozwcuj-49MmBX9anyiXMFBKpFDf_mtwxZ3KQo&dib_tag=se&keywords=gift+of+therapy+book&qid=1766830244&sprefix=gift+of+th%2Caps%2C401&sr=8-2',
    longSummary: detailedSummaries.giftOfTherapy,
  },
  {
    id: 'b2',
    title: 'Theory and Practice of Counseling and Psychotherapy',
    authorOrSource: 'Gerald Corey',
    description: 'The most structured overview explaining how therapy actually unfolds across different approaches. Covers intake, formulation, intervention, and termination.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Theory-Practice-Counseling-Psychotherapy-Gerald/dp/9353502071/ref=sr_1_1?crid=SGKOAEDV65PS&dib=eyJ2IjoiMSJ9.UZcPCqpoGhjWTAzpZELHlTCiwg7qt2-qLQfbfebfo7xdzkagBviiOb-I4GVfmVPC-ISrj8mUkISVERn6kDjiEWtj3NiXWkJ8P0SNK8XA721YqlOAA0PC2xiAh6eD-gXj6YvPx-BWhroB5LMmtttMbm8L60BBdeHp_yMl-7UdHrdVjbVhJguszjxNnD3o3klrFp7M07jSoWS6U00w9l7yqoyID_R6oxZaOItukxfhq8k.Uvl5sc4rjaIjKLz7qn3a5rzyscg9Ro4cCTekJ_wLicI&dib_tag=se&keywords=Theory+and+Practice+of+Counseling+and+Psychotherapy&qid=1766830340&sprefix=theory+and+practice+of+counseling+and+psychotherapy%2Caps%2C471&sr=8-1',
    longSummary: detailedSummaries.theoryPractice,
  },
  {
    id: 'b3',
    title: 'The Mental Health Clinician’s Workbook',
    authorOrSource: 'James Morrison',
    description: 'Extremely practical guide showing what therapists say, why they say it, and when. Great for process-level understanding.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Mental-Health-Clinicians-Workbook-Professional/dp/1462534856/ref=sr_1_1?crid=2PA5DFK8KNGAE&dib=eyJ2IjoiMSJ9.oqalveij7k73kWGueL1Shw.98rYNRD0-Y-iNYf7huYbQscxvUBSove3QUCCTwzktJw&dib_tag=se&keywords=The+Mental+Health+Clinician%E2%80%99s+Workbook+James+Morrison&qid=1766830380&sprefix=the+mental+health+clinician+s+workbook+james+morrison%2Caps%2C444&sr=8-1',
    longSummary: detailedSummaries.mentalHealthWorkbook,
  },
  {
    id: 'b4',
    title: 'Psychotherapy Relationships That Work',
    authorOrSource: 'John Norcross',
    description: 'Evidence-based look at what really helps: alliance, empathy, rupture-repair, and collaboration.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Psychotherapy-Relationships-that-Work-Evidence-Based/dp/0190843950/ref=sr_1_1?crid=2XP9QRZMOMAPU&dib=eyJ2IjoiMSJ9.zMjP5BztZ-r6BtJxPsifK7ncxQbPkQh3IQwv1DsfWoaKisLvc1e1IrivoKWjhe5Ee2Et5v2gW797_bRKJhvFWA.wxhaOgWn_uYR5-syCEN-ZyJTipI1alElUPVcoCE43zE&dib_tag=se&keywords=Psychotherapy+Relationships+That+Work+John+Norcross&qid=1766830423&sprefix=psychotherapy+relationships+that+work+john+norcross%2Caps%2C416&sr=8-1',
    longSummary: detailedSummaries.relationshipsWork,
  },
  {
    id: 'b5',
    title: 'Cognitive Therapy and the Emotional Disorders',
    authorOrSource: 'Aaron T. Beck',
    description: 'Explains the CBT process step-by-step: case conceptualization, thought records, and behavioral change.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Cognitive-Therapy-Emotional-Disorders-Aaron/dp/0140156895/ref=sr_1_1?crid=23CUAZPDKE00N&dib=eyJ2IjoiMSJ9.VJTGM38MeX46yJ8WnQqlrszBhmMnKggej56CjkrTwbjlE9O-Tf_lG-OGFGDO2dYRvw1vOHd85PcPv8F4itJxjQ.krEYRrAigGEfEJ4k2MMY4OtVSkQ6rMDo1kEITQ9-4AI&dib_tag=se&keywords=Cognitive+Therapy+and+the+Emotional+Disorders+Aaron+T.+Beck&nsdOptOutParam=true&qid=1766830463&sprefix=cognitive+therapy+and+the+emotional+disorders+aaron+t.+beck%2Caps%2C432&sr=8-1',
    longSummary: detailedSummaries.cbtBeck,
  },
  {
    id: 'b6',
    title: 'Existential Psychotherapy',
    authorOrSource: 'Irvin D. Yalom',
    description: 'Deep dive into meaning, death, freedom, and isolation. Explains how conversations evolve in existential therapy.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Audible-Existential-Psychotherapy/dp/B0DPY13J1N/ref=sr_1_1?crid=3GFFP0QIHZEZ6&dib=eyJ2IjoiMSJ9.Any5Vk1CGRDhv4ZOQXtCmHxkGbV1IMfv7mMtcOx_2jS8TNKinHfy5FrrMoJi9-xZSLftUs2mzAPLhcSaZJ3-0j6_4A-Tg3j9Jy8BwfKBtsKFq5Es0-8Cd6xHt9RFSww_II9_lM1aZr3xVAoAOOwgX2zLmC3inGKc8QvBuYDiiUovMdrHqfhkDM6KZwwuysaBoe8ClASiju8qonGNqhFl6YnEjXaak2gBJYvnt146N4M.FKDnR17A1Rv6--voGgnVnP6w0GvLwyCX_4EL5-9pIK8&dib_tag=se&keywords=Existential+Psychotherapy+Irvin+D.+Yalom&qid=1766830489&sprefix=existential+psychotherapy+irvin+d.+yalom%2Caps%2C438&sr=8-1',
    longSummary: detailedSummaries.existentialYalom,
  },
  {
    id: 'b7',
    title: 'Systems of Psychotherapy: A Transtheoretical Analysis',
    authorOrSource: 'Prochaska & Norcross',
    description: 'Comparative understanding of psychotherapy systems. Helps you see why processes differ across approaches.',
    type: 'Book',
    category: 'Core Books',
    link: 'https://www.amazon.in/Systems-Psychotherapy-Transtheoretical-James-Prochaska/dp/0534590853/ref=sr_1_1?crid=NEDU2LLKZSWK&dib=eyJ2IjoiMSJ9.FG20iVNLwzrN_eZ543WBKKmq5iN2W2lkWZ1et6NUSwg3g5eh1j9Hnij2h95EeTiG.kPXv-jC7KEnoREJKCtQSlvXtkTtYhptUWx01a5eaKjw&dib_tag=se&keywords=Systems+of+Psychotherapy%3A+A+Transtheoretical+Analysis+Prochaska+%26+Norcross&nsdOptOutParam=true&qid=1766830524&sprefix=systems+of+psychotherapy+a+transtheoretical+analysis+prochaska+%26+norcross%2Caps%2C392&sr=8-1',
    longSummary: detailedSummaries.systemsProchaska,
  },

  
  {
    id: 'w1',
    title: 'American Psychological Association',
    authorOrSource: 'APA',
    description: 'Therapy process guides, research summaries, and accessible therapy resources.',
    type: 'Website',
    category: 'Academic & Clinical',
    link: 'https://www.apa.org',
    longSummary: detailedSummaries.apaWeb,
  },
  {
    id: 'w2',
    title: 'National Institute of Mental Health',
    authorOrSource: 'NIMH',
    description: 'Clear explanations of how therapy works and evidence-based treatment information.',
    type: 'Website',
    category: 'Academic & Clinical',
    link: 'https://www.nimh.nih.gov/health/topics/psychotherapies',
    longSummary: detailedSummaries.nimhWeb,
  },
  {
    id: 'w3',
    title: 'Open University (OpenLearn)',
    authorOrSource: 'Open University',
    description: 'Free psychotherapy & counseling modules and educational resources.',
    type: 'Course',
    category: 'Academic & Clinical',
    link: 'https://www.open.edu/openlearn/health-sports-psychology/psychology',
    longSummary: detailedSummaries.openLearn,
  },

  
  {
    id: 'v1',
    title: 'Carl Rogers Therapy Sessions',
    authorOrSource: 'YouTube',
    description: 'Best to understand therapeutic presence. Watch the legendary "Gloria" sessions.',
    type: 'Video',
    category: 'Video & Lecture',
    link: 'https://www.youtube.com/results?search_query=carl+rogers+therapy+sessions',
  },
  {
    id: 'v2',
    title: 'Psychotherapy.net',
    authorOrSource: 'Psychotherapy.net',
    description: 'Real session videos across modalities. Gold for process observation and learning.',
    type: 'Video',
    category: 'Video & Lecture',
    link: 'https://www.psychotherapy.net',
  },
  {
    id: 'v3',
    title: 'Yale University – Mental Health Lectures',
    authorOrSource: 'Yale University',
    description: 'Structured academic explanations and lectures on mental health topics.',
    type: 'Video',
    category: 'Video & Lecture',
    link: 'https://www.youtube.com/user/YaleUniversity',
  },
];
