import "./globals.css";
import { Toaster } from "react-hot-toast";
import { JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Ambil metadata dari data.json
function getProfileMeta(): { title: string; description: string } {
  try {
    const dataPath = path.resolve("public/data.json");
    const raw = readFileSync(dataPath, "utf-8");
    const json = JSON.parse(raw);
    const name = json?.profile?.fullname || "My Portfolio";
    const job = json?.profile?.jobtitle || "Web Developer";
    return {
      title: name,
      description: `${name} - ${job}`,
    };
  } catch {
    return {
      title: "My Portfolio",
      description: "Web Developer",
    };
  }
}

export const metadata: Metadata = getProfileMeta();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrains.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        {children}
      </body>
    </html>
  );
}
