"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Experience {
    companyName: string;
    jobtitle: string;
    description: string;
    fromYear: string;
    toYear: string;
}

export default function About() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();
                const companyList = data?.profile?.companyExperience || [];
                setExperiences(companyList);
            } catch (err) {
                console.error("Failed to load company experience:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section id="about" className="px-4 sm:px-6 md:px-12 py-16 bg-[#0B0B1F] text-white">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-3xl font-bold mb-8 text-teal-400 glow-text text-center"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    About Me
                </motion.h2>

                <motion.p
                    className="text-lg text-gray-300 mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    I'm a passionate developer who enjoys crafting elegant, performant, and accessible user interfaces. Below is a summary of my professional journey:
                </motion.p>

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse h-28 bg-[#1B1B3A] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                className="relative pl-6 border-l border-teal-500 hover:border-teal-300 transition-all"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-teal-400 shadow-md animate-pulse" />
                                <div className="mb-1 text-sm text-teal-300">
                                    {exp.fromYear} - {exp.toYear}
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    {exp.jobtitle} @ {exp.companyName}
                                </h3>
                                <p className="text-gray-400 mt-1 leading-relaxed">
                                    {exp.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
