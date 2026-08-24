import { Archive } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";


function ArchiveProjectDialog({
    open,
    project,
    onClose,
    onConfirm,
}) {

    const hasActiveTasks =
        project?.activeTasks > 0;


    return (

        <Dialog
            open={open}
            onOpenChange={(isOpen) => {

                if (!isOpen) {
                    onClose?.();
                }

            }}
        >

            <DialogContent className="sm:max-w-md">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <DialogHeader>

                    <DialogTitle
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Archive
                            size={20}
                            className="text-amber-500"
                        />

                        Archive Project

                    </DialogTitle>


                    <DialogDescription>

                        Are you sure you want to archive{" "}

                        <strong>
                            {project?.name}
                        </strong>
                        ?

                        <br />

                        The project will remain stored
                        and can be restored later.


                        {/* ==================================================
                            ACTIVE TASK WARNING
                        ================================================== */}

                        {hasActiveTasks && (

                            <span
                                className="
                                    mt-3
                                    block
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-3
                                    py-2
                                    font-medium
                                    text-red-600
                                    dark:border-red-900
                                    dark:bg-red-950/30
                                    dark:text-red-400
                                "
                            >
                                This project has{" "}
                                {project.activeTasks}{" "}
                                active tasks and cannot
                                be archived.
                            </span>

                        )}

                    </DialogDescription>

                </DialogHeader>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <DialogFooter>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={hasActiveTasks}
                        className="
                            bg-amber-600
                            text-white
                            hover:bg-amber-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Archive Project
                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    );
}

export default ArchiveProjectDialog;