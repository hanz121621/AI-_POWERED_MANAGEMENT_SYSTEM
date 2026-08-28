
import { useMemo, useState } from "react";
import {
    Download,
    Eye,
    File,
    FileImage,
    FileText,
    FileSpreadsheet,
    Search,
    
    X,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";


const MOCK_PROJECT_FILES = [
    {
        id: "FILE-001",
        name: "Project Requirements.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Project Manager",
        uploadedDate: "2026-08-10",
        relatedArea: "Project Requirements",
        access: "authorized",
    },
    {
        id: "FILE-002",
        name: "Sprint Planning.xlsx",
        type: "Excel",
        size: "856 KB",
        uploadedBy: "Team Leader",
        uploadedDate: "2026-08-12",
        relatedArea: "Sprint 1",
        access: "authorized",
    },
    {
        id: "FILE-003",
        name: "UI Design.png",
        type: "Image",
        size: "1.8 MB",
        uploadedBy: "Developer",
        uploadedDate: "2026-08-14",
        relatedArea: "Frontend Development",
        access: "authorized",
    },
    {
        id: "FILE-004",
        name: "Technical Documentation.docx",
        type: "Word",
        size: "1.2 MB",
        uploadedBy: "Developer",
        uploadedDate: "2026-08-15",
        relatedArea: "Technical Documentation",
        access: "authorized",
    },
    {
        id: "FILE-005",
        name: "Internal Management Report.pdf",
        type: "PDF",
        size: "3.1 MB",
        uploadedBy: "Project Manager",
        uploadedDate: "2026-08-16",
        relatedArea: "Management",
        access: "restricted",
    },
];

// ============================================================
// FILE TYPE ICON
// ============================================================

function getFileIcon(type) {
    switch (type) {
        case "PDF":
        case "Word":
            return FileText;

        case "Excel":
            return FileSpreadsheet;

        case "Image":
            return FileImage;

        default:
            return File;
    }
}

// ============================================================
// COMPONENT
// ============================================================

export default function ViewProjectFiles({
    projectId = "PROJ-001",
    projectName = "AI Powered Management System",
    isArchived = false,
}) {
    // ========================================================
    // STATE
    // ========================================================

    const [files, setFiles] = useState(MOCK_PROJECT_FILES);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ========================================================
    // FILE TYPES
    // ========================================================

    const fileTypes = useMemo(() => {
        const types = files.map((file) => file.type);

        return ["All", ...new Set(types)];
    }, [files]);

    // ========================================================
    // AUTHORIZED FILES
    // CONT-PROJECT-007
    // ========================================================

    const authorizedFiles = useMemo(() => {
        return files.filter((file) => file.access === "authorized");
    }, [files]);

    // ========================================================
    // SEARCH + FILTER
    // ========================================================

    const filteredFiles = useMemo(() => {
        return authorizedFiles.filter((file) => {
            const matchesSearch =
                file.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                file.relatedArea
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                file.uploadedBy
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType =
                selectedType === "All" ||
                file.type === selectedType;

            return matchesSearch && matchesType;
        });
    }, [
        authorizedFiles,
        searchTerm,
        selectedType,
    ]);

    // ========================================================
    // VIEW FILE
    // ========================================================

    const handleViewFile = (file) => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!file) {
            setErrorMessage("The requested file is no longer available.");
            return;
        }

        if (file.access !== "authorized") {
            setErrorMessage(
                "You do not have permission to access this file."
            );
            return;
        }

        setSelectedFile(file);
    };

    // ========================================================
    // DOWNLOAD FILE
    // ========================================================

    const handleDownload = (file) => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!file) {
            setErrorMessage("The requested file is no longer available.");
            return;
        }

        if (file.access !== "authorized") {
            setErrorMessage(
                "You do not have permission to access this file."
            );
            return;
        }

        // Temporary frontend demonstration.
        // This will later call the .NET backend API.

        const content = `Project File\n\nName: ${file.name}\nProject: ${projectName}\nUploaded By: ${file.uploadedBy}`;

        const blob = new Blob([content], {
            type: "text/plain",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setSuccessMessage(
            `${file.name} is ready to download.`
        );
    };

    // ========================================================
    // CLOSE FILE DETAILS
    // ========================================================

    const handleClose = () => {
        setSelectedFile(null);
    };

    // ========================================================
    // REFRESH FILES
    // ========================================================

    const handleRefresh = () => {
        setErrorMessage("");
        setSuccessMessage("");

        // Using setFiles here intentionally.
        // Later this will be replaced by API retrieval.

        setFiles([...MOCK_PROJECT_FILES]);

        setSuccessMessage(
            "Project files refreshed successfully."
        );
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <File className="h-6 w-6 text-blue-600" />

                        <h2 className="text-2xl font-bold text-slate-900">
                            Project Files
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        {projectName}
                    </p>

                    <p className="text-xs text-slate-400">
                        Project ID: {projectId}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Refresh Files
                </button>
            </div>

            {/* ==================================================
                ARCHIVED PROJECT NOTICE
            ================================================== */}

            {isArchived && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />

                    <div>
                        <p className="font-semibold text-amber-800">
                            Archived Project
                        </p>

                        <p className="text-sm text-amber-700">
                            You can view permitted historical files,
                            but modification of archived project
                            information is not allowed.
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />

                    <span className="text-sm font-medium">
                        {successMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle className="h-5 w-5" />

                    <span className="text-sm font-medium">
                        {errorMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                SEARCH + FILTER
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row">
                    {/* SEARCH */}

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search project files..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* FILE TYPE */}

                    <select
                        value={selectedType}
                        onChange={(event) =>
                            setSelectedType(event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {fileTypes.map((type) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type === "All"
                                    ? "All File Types"
                                    : type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ==================================================
                FILE COUNT
            ================================================== */}

            <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                    {filteredFiles.length}
                </span>{" "}
                authorized file
                {filteredFiles.length !== 1 ? "s" : ""}
            </div>

            {/* ==================================================
                NO FILES
            ================================================== */}

            {filteredFiles.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                    <File className="mx-auto h-10 w-10 text-slate-300" />

                    <h3 className="mt-3 font-semibold text-slate-700">
                        No project files available
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        The requested files are currently unavailable.
                    </p>
                </div>
            )}

            {/* ==================================================
                FILE TABLE
            ================================================== */}

            {filteredFiles.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        File
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Type
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Uploaded By
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Upload Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Related Area
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredFiles.map((file) => {
                                    const FileIcon =
                                        getFileIcon(file.type);

                                    return (
                                        <tr
                                            key={file.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* FILE */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-blue-50 p-2">
                                                        <FileIcon className="h-5 w-5 text-blue-600" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {file.name}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {file.size}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* TYPE */}

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {file.type}
                                            </td>

                                            {/* UPLOADED BY */}

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {file.uploadedBy}
                                            </td>

                                            {/* DATE */}

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {file.uploadedDate}
                                            </td>

                                            {/* RELATED AREA */}

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {file.relatedArea}
                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewFile(
                                                                file
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDownload(
                                                                file
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==================================================
                FILE DETAILS MODAL
            ================================================== */}

            {selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    {(() => {
                                        const Icon =
                                            getFileIcon(
                                                selectedFile.type
                                            );

                                        return (
                                            <Icon className="h-5 w-5 text-blue-600" />
                                        );
                                    })()}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        File Details
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        {selectedFile.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-4 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase text-slate-400">
                                    File Name
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {selectedFile.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase text-slate-400">
                                        File Type
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {selectedFile.type}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase text-slate-400">
                                        File Size
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {selectedFile.size}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Uploaded By
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedFile.uploadedBy}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Upload Date
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedFile.uploadedDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase text-slate-400">
                                    Related Project Area
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedFile.relatedArea}
                                </p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-3">
                                <p className="text-sm font-medium text-green-700">
                                    Authorized Access
                                </p>

                                <p className="mt-1 text-xs text-green-600">
                                    You have permission to view this
                                    project file.
                                </p>
                            </div>
                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDownload(selectedFile)
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}