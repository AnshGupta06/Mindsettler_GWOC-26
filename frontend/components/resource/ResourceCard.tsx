import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Play, PenTool, Globe, GraduationCap } from 'lucide-react';
import { Resource } from '@/data/resources';

interface ResourceCardProps {
    resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'Book':
                return <BookOpen className="w-5 h-5" />;
            case 'Video':
                return <Play className="w-5 h-5" />;
            case 'Website':
                return <Globe className="w-5 h-5" />;
            case 'Course':
                return <GraduationCap className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    // Videos link externally immediately. Books and Websites link to internal detail page.
    const isVideo = resource.type === 'Video';
    const href = isVideo ? resource.link : `/resource/${resource.id}`;
    const target = isVideo ? "_blank" : undefined;
    const buttonText = isVideo ? "Watch Video" : "Access Resource";

    return (
        <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-primary/20 flex flex-col h-full ring-1 ring-slate-100/50">
            <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {getIcon(resource.type)}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    {resource.type}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">
                {resource.title}
            </h3>

            <p className="text-sm text-accent font-medium mb-3">
                {resource.authorOrSource}
            </p>

            <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                {resource.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50">
                <Link
                    href={href}
                    target={target}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors group/link"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default ResourceCard;
