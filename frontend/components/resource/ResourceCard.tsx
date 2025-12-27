import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Play, PenTool } from 'lucide-react';
import { Resource } from '@/data/resources';

interface ResourceCardProps {
    resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'Article':
                return <FileText className="w-5 h-5" />;
            case 'Video':
                return <Play className="w-5 h-5" />;
            case 'Tool':
                return <PenTool className="w-5 h-5" />;
            case 'Book':
                return <BookOpen className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-primary/20 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {getIcon(resource.type)}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    {resource.category}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                {resource.title}
            </h3>

            <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                {resource.description}
            </p>

            <div className="mt-auto">
                <Link
                    href={resource.link}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors group/link"
                >
                    View Resource
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default ResourceCard;
