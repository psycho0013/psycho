import { motion } from 'framer-motion';
import { Instagram, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import DataManager, { type SiteContent } from '@/services/dataManager';

const About = () => {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        setContent(DataManager.getContent());
        const handleUpdate = () => setContent(DataManager.getContent());
        window.addEventListener('content-updated', handleUpdate);
        return () => window.removeEventListener('content-updated', handleUpdate);
    }, []);

    if (!content) return null;

    const { header, developer, techStack } = content.about;

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">{header.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        {header.description}
                    </p>
                </div>

                {/* Developer Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
                        <img
                            src={developer.image}
                            alt="Developer"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-center md:text-right flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{developer.name}</h2>
                        <p className="text-primary font-medium mb-4">{developer.role}</p>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            {developer.bio}
                        </p>

                        <div className="flex justify-center md:justify-start gap-4">
                            {developer.socialLinks?.instagram && (
                                <a
                                    href={developer.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white transition-all"
                                >
                                    <Instagram size={20} />
                                </a>
                            )}
                            {developer.socialLinks?.telegram && (
                                <a
                                    href={developer.socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    <Send size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">{techStack.title}</h3>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {techStack.technologies.map((tech: string) => (
                            <span key={tech} className="text-lg font-bold text-slate-400 hover:text-primary transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
