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
  
  
  return workshopsData.workshops;
}

export function getWorkshopById(id: number): Workshop | undefined {
  return workshopsData.workshops.find(workshop => workshop.id === id);
}