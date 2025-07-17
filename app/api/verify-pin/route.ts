import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    const dataPath = path.resolve("public/data.json");
    const file = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(file);

    const match = await bcrypt.compare(pin, data.adminPin);

    return NextResponse.json({ success: match });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
