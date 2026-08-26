import { useRef, useState } from "react";

import {
    Upload,
    File,
    FileText,
    Image,
    FileSpreadsheet,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// STAFF USE CASE 4
// CONT-STAFF-004
// UPLOAD WORK FILES
// ============================================================
//
// Goal:
// Allow Staff to attach documents, images, reports, or other
// work-related files to an assigned task.
//
// Business flow:
//
// Staff
//   ↓
// Task Details
//   ↓
// Attachments
//   ↓
// Upload File
//   ↓
// Validate file
//   ↓
// Upload
//   ↓
// Link to task
//   ↓
// Record activity
//   ↓
// Notify relevant users
//
// ============================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_FILE_TYPES = [
    "application/pdf",

    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/plain",

    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",

    "application/zip",
];

function UploadWorkFiles({
    taskId = null,
    onUploadSuccess,
}) {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [isUploading, setIsUploading] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================================
    // SELECT FILE
    // ========================================================

    const handleFileSelect = (event) => {
        const file =
            event.target.files?.[0];

        setSuccessMessage("");
        setErrorMessage("");

        if (!file) {
            return;
        }

        // ----------------------------------------------------
        // Validate file type
        // ----------------------------------------------------

        if (
            !ALLOWED_FILE_TYPES.includes(
                file.type
            )
        ) {
            setSelectedFile(null);

            setErrorMessage(
                "This file type is not allowed."
            );

            event.target.value = "";

            return;
        }

        // ----------------------------------------------------
        // Validate file size
        // ----------------------------------------------------

        if (
            file.size >
            MAX_FILE_SIZE
        ) {
            setSelectedFile(null);

            setErrorMessage(
                "File size exceeds the allowed limit."
            );

            event.target.value = "";

            return;
        }

        setSelectedFile(file);
    };

    // ========================================================
    // OPEN FILE SELECTOR
    // ========================================================

    const handleChooseFile = () => {
        if (isUploading) {
            return;
        }

        fileInputRef.current?.click();
    };

    // ========================================================
    // REMOVE SELECTED FILE
    // ========================================================

    const handleRemoveFile = () => {
        if (isUploading) {
            return;
        }

        setSelectedFile(null);
        setSuccessMessage("");
        setErrorMessage("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ========================================================
    // UPLOAD FILE
    // ========================================================

    const handleUpload = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        // ----------------------------------------------------
        // No file selected
        // ----------------------------------------------------

        if (!selectedFile) {
            setErrorMessage(
                "Please select a file to upload."
            );

            return;
        }

        // ----------------------------------------------------
        // Task validation
        // ----------------------------------------------------

        if (!taskId) {
            setErrorMessage(
                "Task information is required to upload a file."
            );

            return;
        }

        setIsUploading(true);

        try {
            // ==================================================
            // BACKEND CONNECTION PLACEHOLDER
            // ==================================================
            //
            // We will connect this to your .NET API after
            // confirming the backend endpoint.
            //
            // Expected backend flow:
            //
            // POST /Tasks/{taskId}/attachments
            //
            // FormData:
            // file
            //
            // ==================================================

            const formData =
                new FormData();

            formData.append(
                "file",
                selectedFile
            );

            /*
             * TODO:
             *
             * Connect to your API service here.
             *
             * Example:
             *
             * const response = await api.post(
             *     `/Tasks/${taskId}/attachments`,
             *     formData,
             *     {
             *         headers: {
             *             "Content-Type":
             *                 "multipart/form-data",
             *         },
             *     }
             * );
             *
             */

            // ------------------------------------------------
            // Temporary successful UI behavior
            // ------------------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        700
                    )
            );

            setSuccessMessage(
                "File uploaded successfully."
            );

            if (onUploadSuccess) {
                onUploadSuccess(
                    selectedFile
                );
            }

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value =
                    "";
            }
        } catch (error) {
            console.error(
                "UPLOAD WORK FILE ERROR:",
                error
            );

            setErrorMessage(
                "Unable to upload file. Please try again."
            );
        } finally {
            setIsUploading(false);
        }
    };

    // ========================================================
    // FORMAT FILE SIZE
    // ========================================================

    const formatFileSize = (
        bytes
    ) => {
        if (bytes === 0) {
            return "0 Bytes";
        }

        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB",
        ];

        const index =
            Math.floor(
                Math.log(bytes) /
                    Math.log(1024)
            );

        return `${(
            bytes /
            Math.pow(
                1024,
                index
            )
        ).toFixed(2)} ${
            units[index]
        }`;
    };

    // ========================================================
    // FILE ICON
    // ========================================================

    const getFileIcon = (
        file
    ) => {
        if (!file) {
            return (
                <File className="h-7 w-7" />
            );
        }

        if (
            file.type.startsWith(
                "image/"
            )
        ) {
            return (
                <Image className="h-7 w-7" />
            );
        }

        if (
            file.type ===
            "application/pdf"
        ) {
            return (
                <FileText className="h-7 w-7" />
            );
        }

        if (
            file.type.includes(
                "spreadsheet"
            ) ||
            file.type.includes(
                "excel"
            )
        ) {
            return (
                <FileSpreadsheet className="h-7 w-7" />
            );
        }

        return (
            <File className="h-7 w-7" />
        );
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                dark:border-slate-700
                dark:bg-[#0d2745]
            "
        >
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-5 flex items-start gap-3">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                        dark:bg-blue-950/60
                        dark:text-blue-400
                    "
                >
                    <Upload className="h-5 w-5" />
                </div>

                <div>
                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Upload Work Files
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Attach documents, images,
                        reports, or other work-related
                        files to your assigned task.
                    </p>
                </div>
            </div>

            {/* ==================================================
                FILE INPUT
            ================================================== */}

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={
                    handleFileSelect
                }
                disabled={isUploading}
            />

            {/* ==================================================
                UPLOAD AREA
            ================================================== */}

            {!selectedFile && (
                <button
                    type="button"
                    onClick={
                        handleChooseFile
                    }
                    disabled={isUploading}
                    className="
                        w-full
                        rounded-xl
                        border-2
                        border-dashed
                        border-slate-300
                        bg-slate-50
                        px-6
                        py-10
                        text-center
                        transition
                        hover:border-blue-400
                        hover:bg-blue-50
                        dark:border-slate-600
                        dark:bg-[#081b33]
                        dark:hover:border-blue-500
                        dark:hover:bg-blue-950/20
                    "
                >
                    <div className="flex flex-col items-center">
                        <div
                            className="
                                mb-3
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            <Upload className="h-6 w-6" />
                        </div>

                        <p
                            className="
                                font-medium
                                text-slate-800
                                dark:text-white
                            "
                        >
                            Click to upload a file
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Maximum file size: 10 MB
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            PDF, Word, Excel,
                            images, text, ZIP
                        </p>
                    </div>
                </button>
            )}

            {/* ==================================================
                SELECTED FILE
            ================================================== */}

            {selectedFile && (
                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                        dark:border-slate-700
                        dark:bg-[#081b33]
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-950/60
                                dark:text-blue-400
                            "
                        >
                            {getFileIcon(
                                selectedFile
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    font-medium
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {
                                    selectedFile.name
                                }
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {formatFileSize(
                                    selectedFile.size
                                )}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleRemoveFile
                            }
                            disabled={
                                isUploading
                            }
                            className="
                                rounded-lg
                                p-2
                                text-slate-400
                                transition
                                hover:bg-slate-200
                                hover:text-red-500
                                dark:hover:bg-slate-700
                            "
                            title="Remove file"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* ==========================================
                        UPLOAD BUTTON
                    ========================================== */}

                    <div className="mt-4 flex gap-3">
                        <Button
                            type="button"
                            onClick={
                                handleUpload
                            }
                            disabled={
                                isUploading
                            }
                            className="
                                flex-1
                            "
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />

                                    Upload File
                                </>
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleRemoveFile
                            }
                            disabled={
                                isUploading
                            }
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        text-green-700
                        dark:border-green-900
                        dark:bg-green-950/30
                        dark:text-green-400
                    "
                >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />

                    <span>
                        {successMessage}
                    </span>
                </div>
            )}

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (
                <div
                    className="
                        mt-4
                        flex
                        items-start
                        gap-2
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                        dark:border-red-900
                        dark:bg-red-950/30
                        dark:text-red-400
                    "
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                        {errorMessage}
                    </span>
                </div>
            )}
        </div>
    );
}

export default UploadWorkFiles;