"use client";

import { useState, useRef, useEffect } from "react";
import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import clsx from "clsx";
import EnhancedBackground from "../components/EnhancedBackground";

interface InputPinProps {
    onSuccess: () => void;
}

const LOCKOUT_KEY = "admin_pin_lockout_time";

export default function InputPin({ onSuccess }: InputPinProps) {
    const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockout, setLockout] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
            setError(false);

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            const newPin = [...pin];
            newPin[index - 1] = "";
            setPin(newPin);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyPin = async () => {
        if (lockout) return;

        setLoading(true);
        const res = await fetch("/api/verify-pin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin: pin.join("") }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
            setSuccess(true);
            onSuccess();
        } else {
            setAttempts(prev => prev + 1);
            setError(true);
            setAnimate(true);
            setPin(["", "", "", "", "", ""]);

            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 10);

            setTimeout(() => {
                setAnimate(false);
                setError(false);
            }, 3000);

            if (attempts + 1 >= 3) {
                const lockUntil = Date.now() + 60000;
                localStorage.setItem(LOCKOUT_KEY, lockUntil.toString());
                setLockout(true);
                setCountdown(60);
            }
        }
    };

    useEffect(() => {
        if (pin.every((p) => p !== "") && !lockout) {
            verifyPin();
        }
    }, [pin]);

    useEffect(() => {
        if (!lockout) return;

        const interval = setInterval(() => {
            const lockUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || "0", 10);
            const remaining = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));

            setCountdown(remaining);

            if (remaining <= 0) {
                setLockout(false);
                setAttempts(0);
                localStorage.removeItem(LOCKOUT_KEY);
                clearInterval(interval);

                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 10);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lockout]);

    useEffect(() => {
        const lockUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || "0", 10);
        if (Date.now() < lockUntil) {
            setLockout(true);
            setCountdown(Math.ceil((lockUntil - Date.now()) / 1000));
        }

        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);


    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 z-0">
                <EnhancedBackground />
            </div>

            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div
                    className={clsx(
                        "bg-[#0c1327] border border-cyan-500 rounded-2xl shadow-[0_0_30px_#00ffe1] p-8 w-full max-w-md text-center transition-transform duration-300 text-white font-sans",
                        animate && "animate-shake"
                    )}
                >
                    <h2 className="text-3xl font-bold mb-2 glow-text flex justify-center items-center gap-3">
                        <FaLock className="text-cyan-300" /> Admin Access
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">Enter your 6-digit secure PIN</p>

                    <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                        {pin.map((digit, idx) => (
                            <input
                                key={idx}
                                type="password"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                ref={(el) => (inputRefs.current[idx] = el)}
                                disabled={loading || lockout}
                                className={clsx(
                                    "w-14 h-16 md:w-12 md:h-13 text-center text-3xl rounded-lg bg-[#1f2937] text-cyan-300 border-2 transition-all outline-none shadow-lg",
                                    error
                                        ? "border-red-500 shadow-red-500/30"
                                        : success
                                            ? "border-green-400 shadow-green-400/40"
                                            : "border-cyan-400 ring-2 ring-cyan-300 shadow-cyan-500/40",
                                    lockout && "opacity-50 cursor-not-allowed"
                                )}
                            />
                        ))}
                    </div>

                    {lockout && (
                        <p className="text-sm text-yellow-400 mt-2">
                            Terlalu banyak percobaan. Coba lagi dalam <span className="font-bold">{countdown}s</span>.
                        </p>
                    )}
                    {error && (
                        <p className="text-sm text-red-500 font-medium animate-pulse flex items-center justify-center gap-2">
                            <FaTimesCircle /> PIN salah. Coba lagi.
                        </p>
                    )}
                    {success && (
                        <div className="text-green-400 flex justify-center items-center gap-2 text-sm font-medium">
                            <FaCheckCircle /> Verified. Redirecting...
                        </div>
                    )}
                    {loading && <p className="text-sm text-gray-400 mt-2">Checking PIN...</p>}
                </div>
            </div>
        </div>
    );

}
