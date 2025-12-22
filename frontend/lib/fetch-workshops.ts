import workshopsData from '@/data/workshops.json';

export interface Workshop {
  id: number;
  title: string;
  purpose: string;
  examples: string[];
}

export interface WorkshopsData {
  workshops: Workshop[];
}

export async function getWorkshops(): Promise<Workshop[]> {
  // In a real application, you might fetch from an API
  // For now, we'll return the static data
  return workshopsData.workshops;
}

export function getWorkshopById(id: number): Workshop | undefined {
  return workshopsData.workshops.find(workshop => workshop.id === id);
}