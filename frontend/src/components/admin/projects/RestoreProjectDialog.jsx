import { ArchiveRestore } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

function RestoreProjectDialog({
    open,
    project,
    onClose,
    onConfirm,
}) {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose?.();
                }
            }}
        >
            <DialogContent className="border-border bg-card sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <ArchiveRestore
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                        />

                        Restore Project
                    </DialogTitle>

                    <DialogDescription className="text-muted-foreground">
                        Restore{" "}
                        <strong className="text-foreground">
                            {project?.name}
                        </strong>{" "}
                        to the active project list?

                        <br />

                        The project will become visible in the active project
                        list again.
                    </DialogDescription>
                </DialogHeader>

                {project && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Current Status
                            </span>

                            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                                {project.status}
                            </span>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-border bg-background text-foreground hover:bg-muted"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Restore Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RestoreProjectDialog;