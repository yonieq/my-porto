"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
    const [fullname, setFullname] = useState("");
    const [jobtitle, setJobtitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();
                if (data.profile) {
                    setFullname(data.profile.fullname || "No Name");
                    setJobtitle(data.profile.jobtitle || "No Title");
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
                setFullname("Unknown");
                setJobtitle("Unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#090921] border-b border-[#1A1A3C] px-4 sm:px-6 md:px-12 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-y-4">
                {/* Branding */}
                <div className="text-center sm:text-left">
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-6 sm:h-8 bg-gray-700 w-48 rounded mb-1"></div>
                            <div className="h-4 bg-gray-700 w-32 rounded mx-auto sm:mx-0"></div>
                        </div>
                    ) : (
                        <Link href="/" className="text-2xl sm:text-3xl font-bold text-white hover:opacity-90 transition">
                            {fullname}{" "}
                            <span className="text-teal-400 font-medium glow-text">
                                {jobtitle}
                            </span>
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-md font-bold">
                    <Link href="#projects" className="text-white hover:text-teal-400 transition-colors duration-300">Projects</Link>
                    <Link href="#about" className="text-white hover:text-teal-400 transition-colors duration-300">About</Link>
                    <Link href="#contact" className="text-white hover:text-teal-400 transition-colors duration-300">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
