export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Tool' | 'Book';
  category: string;
  imageUrl?: string;
  link: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety Triggers',
    description: 'Learn how to identify and manage the triggers that cause anxiety in your daily life.',
    type: 'Article',
    category: 'Anxiety',
    link: '#',
  },
  {
    id: '2',
    title: 'Guided Meditation for Stress Relief',
    description: 'A 15-minute guided meditation session to help you relax and de-stress.',
    type: 'Video',
    category: 'Meditation',
    link: '#',
  },
  {
    id: '3',
    title: 'CBT Worksheet: Challenger Your Thoughts',
    description: 'A downloadable worksheet to practice Cognitive Behavioral Therapy techniques.',
    type: 'Tool',
    category: 'Therapy Tools',
    link: '#',
  },
  {
    id: '4',
    title: 'The Body Keeps the Score',
    description: 'A groundbreaking book on trauma and recovery by Bessel van der Kolk.',
    type: 'Book',
    category: 'Trauma',
    link: '#',
  },
  {
    id: '5',
    title: 'Sleep Hygiene Checklist',
    description: 'Simple steps you can take to improve your sleep quality starting tonight.',
    type: 'Tool',
    category: 'Wellness',
    link: '#',
  },
  {
    id: '6',
    title: 'Depression: Signs and Symptoms',
    description: 'An in-depth guide to recognizing the early signs of depression.',
    type: 'Article',
    category: 'Depression',
    link: '#',
  },
];
