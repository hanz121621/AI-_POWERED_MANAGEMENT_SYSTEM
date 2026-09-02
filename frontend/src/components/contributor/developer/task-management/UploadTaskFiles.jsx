import { useState } from "react";
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    "image/png",
    "image/jpeg",
    "application/zip",
];

export default function UploadTaskFiles({
    task,
}) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "This file type is not allowed.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "File size exceeds the allowed limit of 10 MB.";
        }

        return null;
    };

    const handleFileChange = (e) => {
        setError("");
        setSuccess("");

        const selectedFiles = Array.from(
            e.target.files || []
        );

        if (!selectedFiles.length) return;

        for (const file of selectedFiles) {
            const validationError =
                validateFile(file);

            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setFiles((current) => [
            ...current,
            ...selectedFiles,
        ]);
    };

    const removeFile = (index) => {
        setFiles((current) =>
            current.filter(
                (_, fileIndex) => fileIndex !== index
            )
        );
    };

    const handleUpload = () => {
        setError("");
        setSuccess("");

        if (!task) {
            setError("Task not found.");
            return;
        }

        if (!files.length) {
            setError("Please select at least one file.");
            return;
        }

        setSuccess(
            "File uploaded successfully."
        );
    };

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Upload className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Upload Task Files
                    </h2>

                    <p className="text-sm text-slate-500">
                        {task?.title || "Selected task"}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" />
                    {success}
                </div>
            )}

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:bg-slate-100">

                <Upload className="h-10 w-10 text-slate-400" />

                <p className="mt-3 font-medium text-slate-700">
                    Click to select files
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    Maximum file size: 10 MB
                </p>

                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {files.length > 0 && (
                <div className="mt-5 space-y-3">
                    <h3 className="text-sm font-semibold">
                        Selected Files
                    </h3>

                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <FileText className="h-5 w-5 shrink-0 text-blue-600" />

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {file.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {(
                                            file.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    removeFile(index)
                                }
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={handleUpload}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
                <Upload className="h-4 w-4" />
                Upload Files
            </button>
        </div>
    );
}