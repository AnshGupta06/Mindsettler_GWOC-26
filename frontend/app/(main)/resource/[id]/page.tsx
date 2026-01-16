import { resources } from '@/data/resources';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ResourceClient from './ResourceClient'; 

interface Props {
  params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = resources.find((r) => r.id === id);

  if (!resource) return { title: "Resource Not Found" };

  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: 'article', 
    },
  };
}


export default async function ResourcePage({ params }: Props) {
  const { id } = await params;
  const resource = resources.find((r) => r.id === id);

  if (!resource) notFound();

  
  return <ResourceClient resource={resource} />;
}