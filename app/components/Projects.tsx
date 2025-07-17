"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
    projectName: string;
    jobtitle: string;
    description: string;
    image?: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();
                const experience = data?.profile?.projectExperience || [];
                setProjects(experience);
            } catch (err) {
                console.error("Failed to fetch projectExperience from data.json", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-white">
                Experience Projects
            </h3>

            {loading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="animate-pulse bg-[#1B1B3A] rounded-xl h-72"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="bg-[#1B1B3A] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            <Image
                                src={project.image || "/empty_project.jpg"}
                                alt={project.projectName}
                                width={400}
                                height={240}
                                className="object-cover w-full h-48"
                            />
                            <div className="p-5 space-y-2">
                                <h4 className="font-semibold text-lg text-white text-center">
                                    {project.projectName}
                                </h4>
                                <p className="text-sm text-teal-300 text-center">
                                    {project.jobtitle}
                                </p>
                                <p className="text-sm text-gray-400 text-center line-clamp-3">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#1f2937] text-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <h4 className="text-xl font-bold text-teal-400">
                                {selectedProject.projectName} - {selectedProject.jobtitle}
                            </h4>

                            <Image
                                src={selectedProject.image || "/empty_project.jpg"}
                                alt={selectedProject.projectName}
                                width={600}
                                height={320}
                                unoptimized
                                className="w-full h-56 object-cover rounded-md"
                            />

                            <p className="text-gray-300 text-sm whitespace-pre-line">
                                {selectedProject.description}
                            </p>

                            <button
                                onClick={() => setSelectedProject(null)}
                                className="mt-4 block ml-auto bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
