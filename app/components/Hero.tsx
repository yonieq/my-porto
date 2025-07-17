"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState("Loading...");
    const [jobtitle, setJobtitle] = useState("");
    const [description, setDescription] = useState("");
    const [cvPath, setCvPath] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/data.json");
                const data = await res.json();

                if (data.profile) {
                    setFullname(data.profile.fullname || "Anonymous");
                    setJobtitle(data.profile.jobtitle || "No Title");
                    setDescription(data.profile.description || "");
                    setCvPath(data.profile.cv || "");
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
                setFullname("Unknown");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <section className="grid md:grid-cols-2 gap-10 items-center">
            <div>
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 w-3/4 bg-gray-700 rounded"></div>
                        <div className="h-8 w-1/2 bg-gray-600 rounded"></div>
                        <div className="h-20 w-full bg-gray-700 rounded"></div>
                        <div className="flex gap-4 mt-4">
                            <div className="h-10 w-32 bg-gray-600 rounded-full"></div>
                            <div className="h-10 w-36 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-5xl sm:text-5xl font-extrabold leading-tight text-balance">
                            <span className="text-white">
                                <Typewriter
                                    words={[fullname]}
                                    loop={false}
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={180}
                                    deleteSpeed={150}
                                    delaySpeed={2000}
                                />
                            </span>
                        </h2>

                        <h3 className="text-2xl sm:text-3xl text-teal-300 mt-4">
                            {jobtitle}
                        </h3>

                        <p className="text-gray-300 mt-4 text-base sm:text-lg leading-relaxed max-w-md">
                            {description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link
                                href="#projects"
                                className="inline-block bg-white text-[#0D0D2B] font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-teal-400 transition-transform duration-300"
                            >
                                View My Work
                            </Link>

                            {cvPath && (
                                <Link
                                    href={`/uploads/${cvPath.split("/").pop()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-teal-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-teal-600 transition"
                                >
                                    Download CV
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-center">
                <Image
                    src="/hero-illustration.png"
                    alt="Hero Illustration"
                    width={350}
                    height={350}
                    priority
                    className="rounded-xl drop-shadow-2xl"
                />
            </div>
        </section>
    );
}
