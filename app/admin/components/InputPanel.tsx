// File: app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import EnhancedBackground from "../../components/EnhancedBackground";
import { FaTrash, FaPlus, FaFilePdf } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Project {
    projectName: string;
    jobtitle: string;
    description: string;
}

interface Company {
    companyName: string;
    jobtitle: string;
    description: string;
    fromYear: string;
    toYear: string;
}

export default function ProfileInputPage() {
    const [formData, setFormData] = useState({
        fullname: "",
        jobtitle: "",
        description: "",
        cv: null as File | string | null,
        projectList: [{ projectName: "", jobtitle: "", description: "" }] as Project[],
        projectImages: [] as (File | null)[],
        companyList: [{ companyName: "", jobtitle: "", description: "", fromYear: "", toYear: "" }] as Company[],
        whatsapp: "",
        telegram: "",
        github: "",
        linkedin: "",
        email: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch("/data.json");
                const json = await res.json();
                if (json.profile) {
                    setFormData({
                        fullname: json.profile.fullname,
                        jobtitle: json.profile.jobtitle,
                        description: json.profile.description,
                        cv: json.profile.cv || null,
                        projectList: json.profile.projectExperience || [{ projectName: "", jobtitle: "", description: "" }],
                        projectImages: (json.profile.projectExperience || []).map(() => null),
                        companyList: json.profile.companyExperience || [{ companyName: "", jobtitle: "", description: "", fromYear: "", toYear: "" }],
                        whatsapp: json.profile.whatsapp || "",
                        telegram: json.profile.telegram || "",
                        github: json.profile.github || "",
                        linkedin: json.profile.linkedin || "",
                        email: json.profile.email || ""
                    });
                }
            } catch (e) {
                console.error("Failed to load profile:", e);
            }
        };

        loadProfile();
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData((prev) => ({ ...prev, cv: e.target.files![0] }));
        }
    };

    const removeCv = () => {
        setFormData((prev) => ({ ...prev, cv: null }));
    };

    const handleProjectChange = (index: number, field: keyof Project, value: string) => {
        const updated = [...formData.projectList];
        updated[index][field] = value;
        setFormData({ ...formData, projectList: updated });
    };

    const handleProjectImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = [...formData.projectImages];
        files[index] = e.target.files?.[0] || null;
        setFormData({ ...formData, projectImages: files });
    };

    const handleCompanyChange = (index: number, field: keyof Company, value: string) => {
        const updated = [...formData.companyList];
        updated[index][field] = value;
        setFormData({ ...formData, companyList: updated });
    };

    const addProject = () => {
        setFormData((prev) => ({
            ...prev,
            projectList: [...prev.projectList, { projectName: "", jobtitle: "", description: "" }],
            projectImages: [...prev.projectImages, null],
        }));
    };

    const removeProject = (index: number) => {
        if (index === 0) return;
        const projectList = [...formData.projectList];
        const projectImages = [...formData.projectImages];
        projectList.splice(index, 1);
        projectImages.splice(index, 1);
        setFormData({ ...formData, projectList, projectImages });
    };

    const addCompany = () => {
        setFormData((prev) => ({
            ...prev,
            companyList: [...prev.companyList, { companyName: "", jobtitle: "", description: "", fromYear: "", toYear: "" }],
        }));
    };

    const removeCompany = (index: number) => {
        if (index === 0) return;
        const companyList = [...formData.companyList];
        companyList.splice(index, 1);
        setFormData({ ...formData, companyList });
    };

    const handleSubmit = async () => {
        if (!formData.fullname || !formData.jobtitle || !formData.description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const body = new FormData();
        body.append("fullname", formData.fullname);
        body.append("jobtitle", formData.jobtitle);
        body.append("description", formData.description);
        body.append("whatsapp", formData.whatsapp);
        body.append("telegram", formData.telegram);
        body.append("github", formData.github);
        body.append("linkedin", formData.linkedin);
        body.append("email", formData.email);

        if (formData.cv instanceof File) body.append("cv", formData.cv);

        body.append("projectList", JSON.stringify(formData.projectList));
        formData.projectImages.forEach((file) => file && body.append("projectImages", file));
        body.append("companyList", JSON.stringify(formData.companyList));

        try {
            const res = await fetch("/api/save-profile", { method: "POST", body });
            const result = await res.json();
            if (result.success) {
                toast.success("Profile saved successfully!");
            } else {
                toast.error("Failed to save profile.");
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred while saving.");
        }
    };

    return (
        <>
            <EnhancedBackground />
            <div className="relative z-10 min-h-screen py-12 px-4 max-w-4xl mx-auto text-white">
                <h1 className="text-3xl font-bold mb-6 text-cyan-300">Professional Profile Form</h1>

                <div className="bg-[#111827] text-white p-6 rounded-xl border border-cyan-500/30 shadow-xl space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Full Name</label>
                        <input name="fullname" value={formData.fullname} className="w-full border border-gray-700 bg-[#1f2937] p-2 rounded" onChange={handleInput} />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Job Title</label>
                        <input name="jobtitle" value={formData.jobtitle} className="w-full border border-gray-700 bg-[#1f2937] p-2 rounded" onChange={handleInput} />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Short Description</label>
                        <textarea name="description" value={formData.description} className="w-full border border-gray-700 bg-[#1f2937] p-2 rounded" rows={4} onChange={handleInput} />
                    </div>

                    <div className="flex items-center gap-4">
                        {typeof formData.cv === "string" ? (
                            <div className="flex items-center gap-2 text-sm text-green-300">
                                <a href={formData.cv} target="_blank" className="underline flex items-center gap-1">
                                    <FaFilePdf /> View CV
                                </a>
                                <button onClick={removeCv} className="text-red-400"><FaTrash /></button>
                            </div>
                        ) : (
                            <>
                                <input type="file" accept="application/pdf" className="w-full" onChange={handleCvUpload} />
                                {formData.cv && (
                                    <button onClick={removeCv} className="text-red-400"><FaTrash /></button>
                                )}
                            </>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold mt-6 text-cyan-400">Project Experience</h2>
                    {formData.projectList.map((proj, i) => (
                        <details key={i} className="bg-[#1f2937] border border-gray-700 rounded mb-2">
                            <summary className="cursor-pointer px-4 py-2 flex justify-between items-center text-cyan-300 font-medium">
                                {proj.projectName || "Untitled Project"} - {proj.jobtitle || "Role"}
                                {i !== 0 && <FaTrash onClick={() => removeProject(i)} className="text-red-400 hover:text-red-500" />}
                            </summary>
                            <div className="p-4 space-y-2">
                                <div>
                                    <label className="block text-sm">Project Name</label>
                                    <input value={proj.projectName} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleProjectChange(i, "projectName", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm">Job Title</label>
                                    <input value={proj.jobtitle} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleProjectChange(i, "jobtitle", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm">Description</label>
                                    <textarea value={proj.description} rows={3} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleProjectChange(i, "description", e.target.value)} />
                                </div>
                                <input type="file" accept="image/*" onChange={(e) => handleProjectImage(e, i)} />
                            </div>
                        </details>
                    ))}
                    <button onClick={addProject} className="text-sm px-3 py-1 bg-cyan-600 text-white rounded flex items-center gap-2"><FaPlus /> Add Project</button>

                    <h2 className="text-xl font-semibold mt-6 text-cyan-400">Company Experience</h2>
                    {formData.companyList.map((comp, i) => (
                        <details key={i} className="bg-[#1f2937] border border-gray-700 rounded mb-2">
                            <summary className="cursor-pointer px-4 py-2 flex justify-between items-center text-cyan-300 font-medium">
                                {comp.companyName || "Company"} - {comp.jobtitle || "Position"}
                                {i !== 0 && <FaTrash onClick={() => removeCompany(i)} className="text-red-400 hover:text-red-500" />}
                            </summary>
                            <div className="p-4 space-y-2">
                                <div>
                                    <label className="block text-sm">Company Name</label>
                                    <input value={comp.companyName} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleCompanyChange(i, "companyName", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm">Job Title</label>
                                    <input value={comp.jobtitle} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleCompanyChange(i, "jobtitle", e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm">Description</label>
                                    <textarea value={comp.description} rows={3} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleCompanyChange(i, "description", e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <label className="block text-sm">From Year</label>
                                        <input value={comp.fromYear} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleCompanyChange(i, "fromYear", e.target.value)} />
                                    </div>
                                    <div className="w-full">
                                        <label className="block text-sm">To Year</label>
                                        <input value={comp.toYear} className="w-full border p-2 rounded bg-[#111827]" onChange={(e) => handleCompanyChange(i, "toYear", e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </details>
                    ))}

                    <button onClick={addCompany} className="text-sm px-3 py-1 bg-cyan-600 text-white rounded flex items-center gap-2"><FaPlus /> Add Company</button>

                    <h2 className="text-xl font-semibold mt-6 text-cyan-400">Contact Information</h2>
                    <div>
                        <label className="block text-sm">WhatsApp</label>
                        <input name="whatsapp" value={formData.whatsapp} onChange={handleInput} className="w-full border p-2 rounded bg-[#1f2937]" />
                    </div>
                    <div>
                        <label className="block text-sm">Telegram</label>
                        <input name="telegram" value={formData.telegram} onChange={handleInput} className="w-full border p-2 rounded bg-[#1f2937]" />
                    </div>
                    <div>
                        <label className="block text-sm">Github</label>
                        <input name="github" value={formData.github} onChange={handleInput} className="w-full border p-2 rounded bg-[#1f2937]" />
                    </div>
                    <div>
                        <label className="block text-sm">LinkedIn</label>
                        <input name="linkedin" value={formData.linkedin} onChange={handleInput} className="w-full border p-2 rounded bg-[#1f2937]" />
                    </div>
                    <div>
                        <label className="block text-sm">Email</label>
                        <input name="email" value={formData.email} onChange={handleInput} className="w-full border p-2 rounded bg-[#1f2937]" />
                    </div>

                    <button onClick={handleSubmit} className="mt-6 w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded">Submit</button>
                </div>
            </div>
        </>
    );
}
