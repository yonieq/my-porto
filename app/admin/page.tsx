"use client";

import { useState } from "react";
import InputPanel from "./components/InputPanel";
import InputPin from "../components/InputPin";

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {!authenticated && <InputPin onSuccess={() => setAuthenticated(true)} />}
            {authenticated && <InputPanel />}
        </div>
    );
}
