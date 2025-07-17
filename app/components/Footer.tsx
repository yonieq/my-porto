"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
    const [fullname, setFullname] = useState("");
    const [jobtitle, setJobtitle] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();
                const profile = data?.profile;
                if (profile) {
                    setFullname(profile.fullname);
                    setJobtitle(profile.jobtitle);
                }
            } catch (err) {
                console.error("Failed to fetch profile for footer", err);
            }
        };

        fetchProfile();
    }, []);

    return (
        <motion.footer
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#0B0B1F] text-gray-300 py-10 border-t border-gray-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-y-6">
                {/* Left - Dynamic Name & Title */}
                <div className="text-center sm:text-left">
                    <h4 className="text-lg font-semibold text-white">
                        {fullname || "Loading..."}
                    </h4>
                    <p className="text-sm text-gray-400">{jobtitle || "..."}</p>
                </div>

                {/* Navigation */}
                <nav className="flex gap-6 text-sm justify-center font-bold">
                    <Link href="#projects" className="hover:text-teal-400 transition">
                        Projects
                    </Link>
                    <Link href="#about" className="hover:text-teal-400 transition">
                        About
                    </Link>
                    <Link href="#contact" className="hover:text-teal-400 transition">
                        Contact
                    </Link>
                </nav>

                {/* Copyright */}
                <div className="text-xs text-gray-500 text-center sm:text-right w-full sm:w-auto">
                    © {new Date().getFullYear()} {fullname || ""}. All rights reserved.
                </div>
            </div>
        </motion.footer>
    );
}
