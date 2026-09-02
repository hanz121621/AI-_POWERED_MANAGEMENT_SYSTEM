// ============================================================
// COMM-005 — SEND PROJECT ANNOUNCEMENT
// AIPMS Manager Communication
// ============================================================

import React, { useState } from "react";

function SendProjectAnnouncement() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [project, setProject] = useState("");
    const [priority, setPriority] = useState("Normal");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim() || !message.trim() || !project) {
            return;
        }

        const announcement = {
            id: Date.now(),
            title: title.trim(),
            message: message.trim(),
            project,
            priority,
            createdAt: new Date().toISOString(),
        };

        console.log("Project announcement:", announcement);

        setSuccess(true);

        setTitle("");
        setMessage("");
        setProject("");
        setPriority("Normal");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-4xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Send Project Announcement
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Send an announcement to members of a project.
                    </p>
                </div>

                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                        Project announcement sent successfully.
                    </div>
                )}

                {/* ==================================================
                    FORM
                ================================================== */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* PROJECT */}

                        <div>
                            <label
                                htmlFor="project"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Project
                            </label>

                            <select
                                id="project"
                                value={project}
                                onChange={(event) =>
                                    setProject(event.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="">
                                    Select a project
                                </option>

                                <option value="AI-Powered PMS">
                                    AI-Powered PMS
                                </option>

                                <option value="FieldSync">
                                    FieldSync
                                </option>

                                <option value="Library Management System">
                                    Library Management System
                                </option>
                            </select>
                        </div>

                        {/* TITLE */}

                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Announcement Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Enter announcement title"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* PRIORITY */}

                        <div>
                            <label
                                htmlFor="priority"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Priority
                            </label>

                            <select
                                id="priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="Normal">
                                    Normal
                                </option>

                                <option value="Important">
                                    Important
                                </option>

                                <option value="Urgent">
                                    Urgent
                                </option>
                            </select>
                        </div>

                        {/* MESSAGE */}

                        <div>
                            <label
                                htmlFor="message"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Announcement Message
                            </label>

                            <textarea
                                id="message"
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                placeholder="Write your announcement..."
                                rows={7}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* ACTIONS */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

                            <button
                                type="button"
                                onClick={() => {
                                    setTitle("");
                                    setMessage("");
                                    setProject("");
                                    setPriority("Normal");
                                    setSuccess(false);
                                }}
                                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                Send Announcement
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// DEFAULT EXPORT
// IMPORTANT: AppRoutes.jsx requires this.
// ============================================================

export default SendProjectAnnouncement;
