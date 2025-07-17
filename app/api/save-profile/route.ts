// File: app/api/save-profile/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";

const dataFilePath = path.resolve("public/data.json");
const uploadDir = path.resolve("public/uploads");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const fullname = formData.get("fullname") as string;
        const jobtitle = formData.get("jobtitle") as string;
        const description = formData.get("description") as string;
        const cv = formData.get("cv") as File | null;
        const whatsapp = formData.get('whatsapp') as string;
        const telegram = formData.get('telegram') as string;
        const linkedin = formData.get('linkedin') as string;
        const github = formData.get('github') as string;
        const email = formData.get('email') as string;

        if (!fullname || !jobtitle || !description) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        let cvFilename = "";
        if (cv && cv.size > 0) {
            if (cv.size > 2 * 1024 * 1024) {
                return NextResponse.json({ success: false, message: "CV file too large" }, { status: 400 });
            }

            const cvBuffer = Buffer.from(await cv.arrayBuffer());
            cvFilename = `cv-${Date.now()}.pdf`;
            if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, cvFilename), cvBuffer);
        }

        const projectListRaw = formData.get("projectList");
        const companyListRaw = formData.get("companyList");

        if (!projectListRaw || !companyListRaw) {
            return NextResponse.json({ success: false, message: "Project or company list missing" }, { status: 400 });
        }

        const projectList = JSON.parse(projectListRaw as string);
        const companyList = JSON.parse(companyListRaw as string);
        const projectImages = formData.getAll("projectImages") as File[];

        for (let i = 0; i < projectImages.length; i++) {
            const file = projectImages[i];
            if (!file || file.size === 0) continue;
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `project-${Date.now()}-${i}.jpg`;
            await writeFile(path.join(uploadDir, filename), buffer);
            if (projectList[i]) {
                projectList[i].image = `/uploads/${filename}`;
            }
        }

        const newData = {
            fullname,
            jobtitle,
            description,
            cv: cvFilename ? `/uploads/${cvFilename}` : null,
            projectExperience: projectList,
            companyExperience: companyList,
            whatsapp,
            telegram,
            linkedin,
            github,
            email

        };

        const existing = JSON.parse(await readFile(dataFilePath, "utf-8"));
        existing.profile = newData;
        await writeFile(dataFilePath, JSON.stringify(existing, null, 2));

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Save profile error:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Internal error" },
            { status: 500 }
        );
    }
}
