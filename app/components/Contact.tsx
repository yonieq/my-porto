"use client";

import { useEffect, useState } from "react";
import {
    FaWhatsapp,
    FaTelegramPlane,
    FaGithub,
    FaLinkedin,
    FaEnvelope,
} from "react-icons/fa";

interface ContactLinks {
    whatsapp: string;
    telegram: string;
    github: string;
    linkedin: string;
    email: string;
}

export default function Contact() {
    const [links, setLinks] = useState<ContactLinks | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();
                const profile = data?.profile;
                if (profile) {
                    setLinks({
                        whatsapp: profile.whatsapp,
                        telegram: profile.telegram,
                        github: profile.github,
                        linkedin: profile.linkedin,
                        email: profile.email,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch contact links from data.json", err);
            }
        };

        fetchLinks();
    }, []);

    return (
        <section
            id="contact"
            className="px-4 sm:px-6 md:px-12 py-20 bg-[#0B0B1F] text-white"
        >
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-teal-400 glow-text mb-4">
                        Let&apos;s Connect
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Want to collaborate or just say hi? Reach out through the form or connect with me on social media.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <form className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-[#1A1A3C] text-white rounded-md outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-4 py-3 bg-[#1A1A3C] text-white rounded-md outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        <textarea
                            placeholder="Your Message"
                            rows={6}
                            className="w-full px-4 py-3 bg-[#1A1A3C] text-white rounded-md outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button
                            type="submit"
                            className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-md text-base font-semibold transition-colors"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Social Links */}
                    <div className="flex flex-col items-center md:items-start justify-center gap-6">
                        <p className="text-gray-300 mb-2 text-base">
                            Or find me on:
                        </p>
                        {links ? (
                            <div className="flex flex-wrap gap-4 text-2xl text-white">
                                <a
                                    href={links.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-green-400 transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp />
                                </a>
                                <a
                                    href={links.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors"
                                    aria-label="Telegram"
                                >
                                    <FaTelegramPlane />
                                </a>
                                <a
                                    href={links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-300 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <FaGithub />
                                </a>
                                <a
                                    href={links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-300 transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin />
                                </a>
                                <a
                                    href={`mailto:${links.email}`}
                                    className="hover:text-teal-400 transition-colors"
                                    aria-label="Email"
                                >
                                    <FaEnvelope />
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Loading contact links...</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
