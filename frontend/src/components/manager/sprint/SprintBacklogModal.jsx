
// ============================================================
// AIPMS — SPRINT BACKLOG MODAL
//
// Handles:
// SP-006 — View Sprint Backlog
// ============================================================

import React, { useEffect, useState } from "react";
import {
    X,
    Plus,
    Trash2,
    ListChecks,
} from "lucide-react";

function SprintBacklogModal({
    isOpen,
    onClose,
    sprint,
    onUpdated,
}) {
    const [backlog, setBacklog] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");

    useEffect(() => {
        if (!sprint) {
            setBacklog([]);
            return;
        }

        setBacklog(
            Array.isArray(sprint.backlog)
                ? sprint.backlog
                : []
        );
    }, [sprint]);

    if (!isOpen || !sprint) {
        return null;
    }

    const handleAddTask = () => {
        const title = taskTitle.trim();

        if (!title) {
            return;
        }

        const newTask = {
            id: `backlog-${Date.now()}`,
            title,
            status: "Todo",
        };

        const updatedBacklog = [
            ...backlog,
            newTask,
        ];

        setBacklog(updatedBacklog);
        setTaskTitle("");

        if (typeof onUpdated === "function") {
            onUpdated({
                ...sprint,
                backlog: updatedBacklog,
            });
        }
    };

    const handleRemoveTask = (taskId) => {
        const updatedBacklog = backlog.filter(
            (task) => task.id !== taskId
        );

        setBacklog(updatedBacklog);

        if (typeof onUpdated === "function") {
            onUpdated({
                ...sprint,
                backlog: updatedBacklog,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
                className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ListChecks
                                size={20}
                                className="text-slate-700"
                            />

                            <h2 className="text-lg font-semibold text-slate-900">
                                Sprint Backlog
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            {sprint.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-6">
                    <div className="mb-6 flex gap-2">
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(event) =>
                                setTaskTitle(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleAddTask();
                                }
                            }}
                            placeholder="Add backlog item..."
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        />

                        <button
                            type="button"
                            onClick={handleAddTask}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            <Plus size={17} />
                            Add
                        </button>
                    </div>

                    {backlog.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <ListChecks
                                size={36}
                                className="mx-auto mb-3 text-slate-400"
                            />

                            <h3 className="text-sm font-semibold text-slate-800">
                                No backlog items
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add tasks or work items to this
                                sprint backlog.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {backlog.map((task, index) => (
                                <div
                                    key={task.id || index}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {task.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {task.status || "Todo"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveTask(
                                                task.id
                                            )
                                        }
                                        className="ml-4 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        title="Remove backlog item"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SprintBacklogModal;

