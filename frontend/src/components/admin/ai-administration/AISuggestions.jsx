import { useMemo, useState } from "react";

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    Lightbulb,
    RefreshCw,
    Search,
    ShieldAlert,
    Sparkles,
    XCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



function AISuggestions({
    suggestions = [],
    users = [],
    projects = [],
    teams = [],
    loading = false,
    error = "",
    serviceAvailable = true,

    

    hasPermission = true,

   

    onAccessLog,
}) {
    

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        projectId: "all",
        type: "all",
        priority: "all",
        dateFrom: "",
        dateTo: "",
    });

    const [selectedSuggestion, setSelectedSuggestion] =
        useState(null);

    const [detailError, setDetailError] = useState("");


    const getId = (item) =>
        item?.id ??
        item?._id ??
        item?.suggestionId ??
        null;

    const getProjectId = (item) =>
        item?.projectId ??
        item?.project?.id ??
        item?.project?._id ??
        null;

    const getUserId = (item) =>
        item?.userId ??
        item?.actorId ??
        item?.createdBy ??
        item?.user?.id ??
        item?.user?._id ??
        null;

    const getTeamId = (item) =>
        item?.teamId ??
        item?.team?.id ??
        item?.team?._id ??
        null;

    const getSuggestionTitle = (suggestion) =>
        suggestion?.title ||
        suggestion?.name ||
        suggestion?.summary ||
        suggestion?.recommendation ||
        "AI Suggestion";

    const getSuggestionDescription = (suggestion) =>
        suggestion?.description ||
        suggestion?.details ||
        suggestion?.message ||
        suggestion?.recommendation ||
        "No additional description is available.";

    const getSuggestionType = (suggestion) =>
        suggestion?.type ||
        suggestion?.suggestionType ||
        suggestion?.category ||
        suggestion?.featureType ||
        "Unspecified";

    const getPriority = (suggestion) =>
        suggestion?.priority ||
        suggestion?.severity ||
        suggestion?.level ||
        "Unspecified";

    const getStatus = (suggestion) =>
        suggestion?.status ||
        "Available";

    const getDate = (suggestion) =>
        suggestion?.createdAt ||
        suggestion?.updatedAt ||
        suggestion?.date ||
        suggestion?.timestamp ||
        null;

   

    const isValidSuggestion = (suggestion) => {
        if (!suggestion) {
            return false;
        }

        const id = getId(suggestion);

        if (id == null) {
            return false;
        }

        const title = getSuggestionTitle(suggestion);

        const description =
            getSuggestionDescription(suggestion);

        if (!title || !description) {
            return false;
        }

     
        const projectId = getProjectId(suggestion);

        if (projectId != null) {
            const projectExists = projects.some(
                (project) =>
                    String(getId(project)) ===
                    String(projectId)
            );

            if (!projectExists) {
                return false;
            }
        }

      
        const teamId = getTeamId(suggestion);

        if (teamId != null) {
            const teamExists = teams.some(
                (team) =>
                    String(getId(team)) ===
                    String(teamId)
            );

            if (!teamExists) {
                return false;
            }
        }

        return true;
    };

   

    const validSuggestions = useMemo(() => {
        return suggestions.filter((suggestion) =>
            isValidSuggestion(suggestion)
        );
    }, [suggestions, projects, teams]);

   
const getProjectName = (
    suggestion,
    projects
) => {
        if (suggestion?.project?.name) {
            return suggestion.project.name;
        }

        const projectId = getProjectId(suggestion);

        const project = projects.find(
            (item) =>
                String(getId(item)) ===
                String(projectId)
        );

        return (
            project?.name ||
            project?.title ||
            "No project associated"
        );
    };



    const getUserName = (suggestion) => {
        if (suggestion?.user?.name) {
            return suggestion.user.name;
        }

        if (suggestion?.user?.fullName) {
            return suggestion.user.fullName;
        }

        const userId = getUserId(suggestion);

        const user = users.find(
            (item) =>
                String(getId(item)) ===
                String(userId)
        );

        return (
            user?.fullName ||
            user?.name ||
            user?.username ||
            user?.email ||
            "System AI"
        );
    };

  

    const getTeamName = (suggestion) => {
        if (suggestion?.team?.name) {
            return suggestion.team.name;
        }

        const teamId = getTeamId(suggestion);

        const team = teams.find(
            (item) =>
                String(getId(item)) ===
                String(teamId)
        );

        return (
            team?.name ||
            team?.title ||
            "No team associated"
        );
    };

   

    const filterOptions = useMemo(() => {
        const types = [
            ...new Set(
                validSuggestions
                    .map((item) =>
                        getSuggestionType(item)
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "Unspecified"
                    )
            ),
        ];

        const priorities = [
            ...new Set(
                validSuggestions
                    .map((item) =>
                        getPriority(item)
                    )
                    .filter(
                        (value) =>
                            value &&
                            value !== "Unspecified"
                    )
            ),
        ];

        return {
            types,
            priorities,
        };
    }, [validSuggestions]);

    

    const projectOptions = useMemo(() => {
        const availableProjectIds = new Set(
            validSuggestions
                .map((item) =>
                    getProjectId(item)
                )
                .filter((id) => id != null)
                .map((id) => String(id))
        );

        return projects.filter((project) =>
            availableProjectIds.has(
                String(getId(project))
            )
        );
    }, [projects, validSuggestions]);

    // ============================================================
    // DATE MATCHING
    // ============================================================

    const matchesDate = (suggestion) => {
        const dateValue = getDate(suggestion);

        if (
            !filters.dateFrom &&
            !filters.dateTo
        ) {
            return true;
        }

        if (!dateValue) {
            return false;
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return false;
        }

        if (filters.dateFrom) {
            const from = new Date(
                `${filters.dateFrom}T00:00:00`
            );

            if (date < from) {
                return false;
            }
        }

        if (filters.dateTo) {
            const to = new Date(
                `${filters.dateTo}T23:59:59.999`
            );

            if (date > to) {
                return false;
            }
        }

        return true;
    };

    // ============================================================
    // FILTERED SUGGESTIONS
    // ============================================================

    const filteredSuggestions = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return validSuggestions.filter(
            (suggestion) => {
                const title =
                    getSuggestionTitle(
                        suggestion
                    ).toLowerCase();

                const description =
                    getSuggestionDescription(
                        suggestion
                    ).toLowerCase();

                const type =
                    getSuggestionType(
                        suggestion
                    ).toLowerCase();

                const priority =
                    getPriority(
                        suggestion
                    ).toLowerCase();

                const project =
                    getProjectName(
                        suggestion
                    ).toLowerCase();

                // Search
                if (
                    normalizedSearch &&
                    ![
                        title,
                        description,
                        type,
                        priority,
                        project,
                    ].some((value) =>
                        value.includes(
                            normalizedSearch
                        )
                    )
                ) {
                    return false;
                }

                // Project
                if (
                    filters.projectId !== "all"
                ) {
                    const projectId =
                        getProjectId(
                            suggestion
                        );

                    if (
                        projectId == null ||
                        String(projectId) !==
                            String(
                                filters.projectId
                            )
                    ) {
                        return false;
                    }
                }

                // Type
                if (
                    filters.type !== "all" &&
                    String(
                        getSuggestionType(
                            suggestion
                        )
                    ) !==
                        String(
                            filters.type
                        )
                ) {
                    return false;
                }

                // Priority
                if (
                    filters.priority !==
                        "all" &&
                    String(
                        getPriority(
                            suggestion
                        )
                    ) !==
                        String(
                            filters.priority
                        )
                ) {
                    return false;
                }

                // Date
                if (
                    !matchesDate(
                        suggestion
                    )
                ) {
                    return false;
                }

                return true;
            }
        );
    }, [
        validSuggestions,
        search,
        filters,
        projects,
    ]);

    // ============================================================
    // RESET FILTERS
    // ============================================================

    const resetFilters = () => {
        setSearch("");

        setFilters({
            projectId: "all",
            type: "all",
            priority: "all",
            dateFrom: "",
            dateTo: "",
        });
    };

    // ============================================================
    // PRIORITY DISPLAY
    //
    // Does NOT create priority values.
    // It only determines visual presentation.
    // ============================================================

    const getPriorityClass = (priority) => {
        const value =
            String(priority).toLowerCase();

        if (
            value === "critical" ||
            value === "high"
        ) {
            return "border-destructive/30 text-destructive";
        }

        if (
            value === "medium" ||
            value === "moderate"
        ) {
            return "border-amber-500/30 text-amber-600 dark:text-amber-400";
        }

        if (value === "low") {
            return "border-green-500/30 text-green-600 dark:text-green-400";
        }

        return "border-border text-muted-foreground";
    };

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (value) => {
        if (!value) {
            return "Date unavailable";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString();
    };

    // ============================================================
    // RECORD ACCESS ACTIVITY
    //
    // BR7:
    // Viewing an AI suggestion must be recorded.
    //
    // Prefer the parent's activity logger when available.
    // Otherwise use localStorage as the current local data
    // implementation.
    // ============================================================

    const recordAccessActivity = (
        suggestion
    ) => {
        const activity = {
          id: new Date().toISOString(),

            action: "VIEW_AI_SUGGESTION",

            type: "AI_SUGGESTION_ACCESS",

            message: `Admin viewed AI suggestion "${getSuggestionTitle(
                suggestion
            )}".`,

            suggestionId: getId(
                suggestion
            ),

            suggestionTitle:
                getSuggestionTitle(
                    suggestion
                ),

            projectId:
                getProjectId(
                    suggestion
                ),

            projectName:
                getProjectName(
                    suggestion
                ),

            timestamp:
                new Date().toISOString(),

            readOnly: true,
        };

        // Parent-provided logger
        if (typeof onAccessLog === "function") {
            onAccessLog(activity);
            return;
        }

        // Local implementation
        try {
            const existingLogs =
                JSON.parse(
                    localStorage.getItem(
                        "activityLogs"
                    ) || "[]"
                );

            localStorage.setItem(
                "activityLogs",
                JSON.stringify([
                    activity,
                    ...existingLogs,
                ])
            );
        } catch (storageError) {
            console.error(
                "Failed to record AI suggestion access:",
                storageError
            );
        }
    };

    // ============================================================
    // VIEW SUGGESTION
    //
    // Main Success Scenario:
    // Admin selects a suggestion
    // → validate it
    // → display details
    // → record access
    // ============================================================

    const handleViewSuggestion = (
        suggestion
    ) => {
        setDetailError("");

        // A4:
        // Selected suggestion does not exist.
        if (!suggestion) {
            setSelectedSuggestion(null);

            setDetailError(
                "AI suggestion not found."
            );

            return;
        }

        const suggestionId =
            getId(suggestion);

        // A4:
        // Selected suggestion has no valid ID.
        if (suggestionId == null) {
            setSelectedSuggestion(null);

            setDetailError(
                "AI suggestion not found."
            );

            return;
        }

        // BR4:
        // Invalid AI response must not be presented as valid.
        if (!isValidSuggestion(suggestion)) {
            setSelectedSuggestion(null);

            setDetailError(
                "AI suggestion not found."
            );

            return;
        }

        // Display details.
        setSelectedSuggestion(
            suggestion
        );

        // BR7:
        // Record access.
        recordAccessActivity(
            suggestion
        );
    };

    // ============================================================
    // A3 — ACCESS DENIED
    //
    // BR1:
    // Only users with AI permission can access suggestions.
    // ============================================================

    if (!hasPermission) {
        return (
            <Card className="
                border-destructive/30
                bg-card
            ">
                <CardContent className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    p-10
                    text-center
                ">

                    <div className="
                        rounded-full
                        bg-destructive/10
                        p-3
                    ">
                        <ShieldAlert
                            className="
                                h-6
                                w-6
                                text-destructive
                            "
                        />
                    </div>

                    <div>

                        <h3 className="
                            font-semibold
                            text-foreground
                        ">
                            Access denied.
                        </h3>

                        <p className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        ">
                            You do not have permission
                            to access AI suggestions.
                        </p>

                    </div>

                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // A2 — AI SERVICE UNAVAILABLE
    // ============================================================

    if (!serviceAvailable) {
        return (
            <Card className="
                border-destructive/30
                bg-card
            ">
                <CardContent className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    p-10
                    text-center
                ">

                    <div className="
                        rounded-full
                        bg-destructive/10
                        p-3
                    ">
                        <XCircle
                            className="
                                h-6
                                w-6
                                text-destructive
                            "
                        />
                    </div>

                    <div>

                        <h3 className="
                            font-semibold
                            text-foreground
                        ">
                            AI service is currently
                            unavailable.
                        </h3>

                        <p className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        ">
                            Please try again later.
                        </p>

                    </div>

                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // SERVICE / RETRIEVAL ERROR
    // ============================================================

    if (error) {
        return (
            <Card className="
                border-destructive/30
                bg-card
            ">
                <CardContent className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    p-10
                    text-center
                ">

                    <div className="
                        rounded-full
                        bg-destructive/10
                        p-3
                    ">
                        <AlertCircle
                            className="
                                h-6
                                w-6
                                text-destructive
                            "
                        />
                    </div>

                    <div>

                        <h3 className="
                            font-semibold
                            text-foreground
                        ">
                            Unable to load AI suggestions
                        </h3>

                        <p className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        ">
                            {error}
                        </p>

                    </div>

                </CardContent>
            </Card>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                SECTION HEADER
            ================================================== */}

            <Card className="
                border-border
                bg-card
            ">

                <CardHeader>

                    <div className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    ">

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <div className="
                                rounded-xl
                                border
                                border-border
                                bg-muted
                                p-3
                            ">

                                <Sparkles
                                    className="
                                        h-5
                                        w-5
                                        text-foreground
                                    "
                                />

                            </div>

                            <div>

                                <CardTitle className="
                                    text-lg
                                    text-foreground
                                ">
                                    AI Suggestions
                                </CardTitle>

                                <CardDescription className="
                                    mt-1
                                ">
                                    Review AI-generated
                                    recommendations,
                                    predictions,
                                    warnings, and
                                    insights.
                                </CardDescription>

                            </div>

                        </div>

                        <Badge variant="outline">
                            AI-001
                        </Badge>

                    </div>

                </CardHeader>

            </Card>


            {/* ==================================================
                DETAIL ERROR — A4
            ================================================== */}

            {detailError && (
                <Card className="
                    border-destructive/30
                    bg-card
                ">

                    <CardContent className="
                        flex
                        items-center
                        gap-3
                        p-4
                    ">

                        <AlertCircle className="
                            h-5
                            w-5
                            shrink-0
                            text-destructive
                        " />

                        <p className="
                            text-sm
                            font-medium
                            text-destructive
                        ">
                            {detailError}
                        </p>

                    </CardContent>

                </Card>
            )}


            {/* ==================================================
                FILTERS
            ================================================== */}

            <Card className="
                border-border
                bg-card
            ">

                <CardHeader>

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <Filter className="
                            h-4
                            w-4
                            text-muted-foreground
                        " />

                        <div>

                            <CardTitle className="
                                text-base
                            ">
                                Filter Suggestions
                            </CardTitle>

                            <CardDescription>
                                Filter AI suggestions by
                                project, date, type,
                                and priority.
                            </CardDescription>

                        </div>

                    </div>

                </CardHeader>

                <CardContent className="
                    space-y-4
                ">

                    {/* Search */}

                    <div className="relative">

                        <Search className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-muted-foreground
                        " />

                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="
                                Search suggestions...
                            "
                            className="pl-9"
                        />

                    </div>


                    {/* Filter Controls */}

                    <div className="
                        grid
                        gap-4
                        md:grid-cols-2
                        lg:grid-cols-5
                    ">

                        {/* Project */}

                        <Select
                            value={
                                filters.projectId
                            }
                            onValueChange={(value) =>
                                setFilters(
                                    (current) => ({
                                        ...current,
                                        projectId:
                                            value,
                                    })
                                )
                            }
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Project" />
                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="all">
                                    All Projects
                                </SelectItem>

                                {projectOptions.map(
                                    (project) => (
                                        <SelectItem
                                            key={String(
                                                getId(
                                                    project
                                                )
                                            )}
                                            value={String(
                                                getId(
                                                    project
                                                )
                                            )}
                                        >
                                            {project?.name ||
                                                project?.title ||
                                                "Unnamed Project"}
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>


                        {/* Type */}

                        <Select
                            value={
                                filters.type
                            }
                            onValueChange={(value) =>
                                setFilters(
                                    (current) => ({
                                        ...current,
                                        type: value,
                                    })
                                )
                            }
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Suggestion Type" />
                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="all">
                                    All Types
                                </SelectItem>

                                {filterOptions.types.map(
                                    (type) => (
                                        <SelectItem
                                            key={String(
                                                type
                                            )}
                                            value={String(
                                                type
                                            )}
                                        >
                                            {String(type)}
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>


                        {/* Priority */}

                        <Select
                            value={
                                filters.priority
                            }
                            onValueChange={(value) =>
                                setFilters(
                                    (current) => ({
                                        ...current,
                                        priority:
                                            value,
                                    })
                                )
                            }
                        >

                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="all">
                                    All Priorities
                                </SelectItem>

                                {filterOptions.priorities.map(
                                    (priority) => (
                                        <SelectItem
                                            key={String(
                                                priority
                                            )}
                                            value={String(
                                                priority
                                            )}
                                        >
                                            {String(
                                                priority
                                            )}
                                        </SelectItem>
                                    )
                                )}

                            </SelectContent>

                        </Select>


                        {/* Date From */}

                        <div className="relative">

                            <CalendarDays className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted-foreground
                            " />

                            <Input
                                type="date"
                                value={
                                    filters.dateFrom
                                }
                                onChange={(event) =>
                                    setFilters(
                                        (current) => ({
                                            ...current,
                                            dateFrom:
                                                event
                                                    .target
                                                    .value,
                                        })
                                    )
                                }
                                className="pl-9"
                                aria-label="Date from"
                            />

                        </div>


                        {/* Date To */}

                        <div className="relative">

                            <CalendarDays className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-muted-foreground
                            " />

                            <Input
                                type="date"
                                value={
                                    filters.dateTo
                                }
                                onChange={(event) =>
                                    setFilters(
                                        (current) => ({
                                            ...current,
                                            dateTo:
                                                event
                                                    .target
                                                    .value,
                                        })
                                    )
                                }
                                className="pl-9"
                                aria-label="Date to"
                            />

                        </div>

                    </div>


                    {/* Reset */}

                    <div className="
                        flex
                        justify-end
                    ">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                resetFilters
                            }
                        >
                            Reset Filters
                        </Button>

                    </div>

                </CardContent>

            </Card>


            {/* ==================================================
                RESULT COUNT
            ================================================== */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <p className="
                        text-sm
                        font-medium
                        text-foreground
                    ">
                        {filteredSuggestions.length}{" "}
                        {filteredSuggestions.length === 1
                            ? "suggestion"
                            : "suggestions"}
                    </p>

                    <p className="
                        text-xs
                        text-muted-foreground
                    ">
                        Showing valid AI-generated
                        records matching the
                        selected filters.
                    </p>

                </div>

                {loading && (
                    <RefreshCw className="
                        h-4
                        w-4
                        animate-spin
                        text-muted-foreground
                    " />
                )}

            </div>


            {/* ==================================================
                A1 — NO AI SUGGESTIONS
            ================================================== */}

            {!loading &&
                validSuggestions.length === 0 && (
                    <Card className="
                        border-border
                        bg-card
                    ">

                        <CardContent className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            p-10
                            text-center
                        ">

                            <div className="
                                rounded-full
                                bg-muted
                                p-4
                            ">

                                <Lightbulb className="
                                    h-7
                                    w-7
                                    text-muted-foreground
                                " />

                            </div>

                            <h3 className="
                                mt-4
                                font-semibold
                                text-foreground
                            ">
                                No AI suggestions available.
                            </h3>

                            <p className="
                                mt-1
                                max-w-md
                                text-sm
                                text-muted-foreground
                            ">
                                No valid AI-generated
                                suggestions are currently
                                available.
                            </p>

                        </CardContent>

                    </Card>
                )}


            {/* ==================================================
                NO FILTER RESULTS
            ================================================== */}

            {!loading &&
                validSuggestions.length > 0 &&
                filteredSuggestions.length === 0 && (
                    <Card className="
                        border-border
                        bg-card
                    ">

                        <CardContent className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            p-10
                            text-center
                        ">

                            <div className="
                                rounded-full
                                bg-muted
                                p-4
                            ">

                                <Search className="
                                    h-7
                                    w-7
                                    text-muted-foreground
                                " />

                            </div>

                            <h3 className="
                                mt-4
                                font-semibold
                                text-foreground
                            ">
                                No AI suggestions found
                            </h3>

                            <p className="
                                mt-1
                                max-w-md
                                text-sm
                                text-muted-foreground
                            ">
                                No suggestions match
                                the selected filters.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={
                                    resetFilters
                                }
                            >
                                Reset Filters
                            </Button>

                        </CardContent>

                    </Card>
                )}


            {/* ==================================================
                SUGGESTION LIST
            ================================================== */}

            <div className="
                grid
                gap-4
            ">

                {filteredSuggestions.map(
                    (suggestion, index) => {

                        const suggestionId =
                            getId(
                                suggestion
                            ) ??
                            `suggestion-${index}`;

                        const title =
                            getSuggestionTitle(
                                suggestion
                            );

                        const description =
                            getSuggestionDescription(
                                suggestion
                            );

                        const type =
                            getSuggestionType(
                                suggestion
                            );

                        const priority =
                            getPriority(
                                suggestion
                            );

                        const status =
                            getStatus(
                                suggestion
                            );

                        return (
                            <Card
                                key={String(
                                    suggestionId
                                )}
                                className="
                                    border-border
                                    bg-card
                                    transition-shadow
                                    hover:shadow-md
                                "
                            >

                                <CardContent className="
                                    p-5
                                ">

                                    <div className="
                                        flex
                                        flex-col
                                        gap-4
                                        lg:flex-row
                                        lg:items-start
                                        lg:justify-between
                                    ">

                                        {/* LEFT */}

                                        <div className="
                                            flex
                                            min-w-0
                                            gap-4
                                        ">

                                            <div className="
                                                mt-1
                                                rounded-lg
                                                border
                                                border-border
                                                bg-muted
                                                p-2.5
                                            ">

                                                <Lightbulb className="
                                                    h-5
                                                    w-5
                                                    text-foreground
                                                " />

                                            </div>

                                            <div className="
                                                min-w-0
                                            ">

                                                <div className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                ">

                                                    <h3 className="
                                                        font-semibold
                                                        text-foreground
                                                    ">
                                                        {title}
                                                    </h3>

                                                    <Badge variant="outline">
                                                        {type}
                                                    </Badge>

                                                    <Badge
                                                        variant="outline"
                                                        className={getPriorityClass(
                                                            priority
                                                        )}
                                                    >
                                                        {priority}
                                                    </Badge>

                                                </div>

                                                <p className="
                                                    mt-2
                                                    line-clamp-2
                                                    text-sm
                                                    text-muted-foreground
                                                ">
                                                    {description}
                                                </p>

                                                <div className="
                                                    mt-3
                                                    flex
                                                    flex-wrap
                                                    gap-x-4
                                                    gap-y-2
                                                    text-xs
                                                    text-muted-foreground
                                                ">

                                                    <span>
                                                        Project:{" "}
                                                        <span className="
                                                            font-medium
                                                            text-foreground
                                                        ">
                                                            {getProjectName(
                                                                suggestion
                                                            )}
                                                        </span>
                                                    </span>

                                                    <span>
                                                        Team:{" "}
                                                        <span className="
                                                            font-medium
                                                            text-foreground
                                                        ">
                                                            {getTeamName(
                                                                suggestion
                                                            )}
                                                        </span>
                                                    </span>

                                                    <span>
                                                        Source:{" "}
                                                        <span className="
                                                            font-medium
                                                            text-foreground
                                                        ">
                                                            {getUserName(
                                                                suggestion
                                                            )}
                                                        </span>
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* RIGHT */}

                                        <div className="
                                            flex
                                            shrink-0
                                            flex-col
                                            gap-3
                                            lg:items-end
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <Clock3 className="
                                                    h-3.5
                                                    w-3.5
                                                    text-muted-foreground
                                                " />

                                                <span className="
                                                    text-xs
                                                    text-muted-foreground
                                                ">
                                                    {formatDate(
                                                        getDate(
                                                            suggestion
                                                        )
                                                    )}
                                                </span>

                                            </div>

                                            <Badge variant="secondary">
                                                {status}
                                            </Badge>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleViewSuggestion(
                                                        suggestion
                                                    )
                                                }
                                            >

                                                <Eye className="
                                                    mr-2
                                                    h-4
                                                    w-4
                                                " />

                                                View Details

                                            </Button>

                                        </div>

                                    </div>

                                </CardContent>

                            </Card>
                        );
                    }
                )}

            </div>


            {/* ==================================================
                SUGGESTION DETAILS
                BR6 — READ ONLY
            ================================================== */}

            <Dialog
                open={Boolean(
                    selectedSuggestion
                )}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedSuggestion(
                            null
                        );
                        setDetailError("");
                    }
                }}
            >

                <DialogContent className="
                    max-h-[85vh]
                    overflow-y-auto
                    sm:max-w-2xl
                ">

                    {selectedSuggestion && (
                        <>
                            <DialogHeader>

                                <div className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                ">

                                    <DialogTitle>
                                        {getSuggestionTitle(
                                            selectedSuggestion
                                        )}
                                    </DialogTitle>

                                    <Badge variant="outline">
                                        {getSuggestionType(
                                            selectedSuggestion
                                        )}
                                    </Badge>

                                </div>

                                <DialogDescription>
                                    AI-generated suggestion
                                    details.
                                </DialogDescription>

                            </DialogHeader>


                            <div className="
                                space-y-5
                            ">

                                {/* Recommendation */}

                                <div className="
                                    rounded-lg
                                    border
                                    border-border
                                    bg-muted/30
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                    ">

                                        <Lightbulb className="
                                            h-4
                                            w-4
                                            text-muted-foreground
                                        " />

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-foreground
                                        ">
                                            Recommendation
                                        </p>

                                    </div>

                                    <p className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-muted-foreground
                                    ">
                                        {getSuggestionDescription(
                                            selectedSuggestion
                                        )}
                                    </p>

                                </div>


                                {/* Priority / Status */}

                                <div className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                ">

                                    <div className="
                                        rounded-lg
                                        border
                                        border-border
                                        p-4
                                    ">

                                        <p className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            Priority
                                        </p>

                                        <Badge
                                            variant="outline"
                                            className={`
                                                mt-2
                                                ${getPriorityClass(
                                                    getPriority(
                                                        selectedSuggestion
                                                    )
                                                )}
                                            `}
                                        >
                                            {getPriority(
                                                selectedSuggestion
                                            )}
                                        </Badge>

                                    </div>


                                    <div className="
                                        rounded-lg
                                        border
                                        border-border
                                        p-4
                                    ">

                                        <p className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            Status
                                        </p>

                                        <Badge
                                            variant="secondary"
                                            className="mt-2"
                                        >
                                            {getStatus(
                                                selectedSuggestion
                                            )}
                                        </Badge>

                                    </div>

                                </div>


                                {/* Related Information */}

                                <div className="
                                    rounded-lg
                                    border
                                    border-border
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                    ">

                                        <ShieldAlert className="
                                            h-4
                                            w-4
                                            text-muted-foreground
                                        " />

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-foreground
                                        ">
                                            Related Information
                                        </p>

                                    </div>

                                    <div className="
                                        mt-4
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    ">

                                        <div>

                                            <p className="
                                                text-xs
                                                text-muted-foreground
                                            ">
                                                Project
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-foreground
                                            ">
                                                {getProjectName(
                                                    selectedSuggestion
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-muted-foreground
                                            ">
                                                Team
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-foreground
                                            ">
                                                {getTeamName(
                                                    selectedSuggestion
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-muted-foreground
                                            ">
                                                Related User
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-foreground
                                            ">
                                                {getUserName(
                                                    selectedSuggestion
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <p className="
                                                text-xs
                                                text-muted-foreground
                                            ">
                                                Generated
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-foreground
                                            ">
                                                {formatDate(
                                                    getDate(
                                                        selectedSuggestion
                                                    )
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* AI Reason */}

                                {selectedSuggestion?.reason && (
                                    <div className="
                                        rounded-lg
                                        border
                                        border-border
                                        p-4
                                    ">

                                        <p className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            AI Reason
                                        </p>

                                        <p className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-foreground
                                        ">
                                            {
                                                selectedSuggestion.reason
                                            }
                                        </p>

                                    </div>
                                )}


                                {/* Additional AI Data */}

                                {selectedSuggestion?.confidence !=
                                    null && (
                                    <div className="
                                        rounded-lg
                                        border
                                        border-border
                                        p-4
                                    ">

                                        <p className="
                                            text-xs
                                            text-muted-foreground
                                        ">
                                            AI Confidence
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-foreground
                                        ">
                                            {
                                                selectedSuggestion.confidence
                                            }
                                        </p>

                                    </div>
                                )}


                                {/* Read-only notice */}

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-lg
                                    border
                                    border-border
                                    bg-muted/30
                                    p-4
                                ">

                                    <CheckCircle2 className="
                                        mt-0.5
                                        h-4
                                        w-4
                                        shrink-0
                                        text-green-500
                                    " />

                                    <p className="
                                        text-xs
                                        leading-5
                                        text-muted-foreground
                                    ">
                                        Viewing this AI
                                        suggestion is
                                        read-only. This
                                        screen does not
                                        modify the suggestion
                                        or its related
                                        project, task, or
                                        team data.
                                    </p>

                                </div>

                            </div>
                        </>
                    )}

                </DialogContent>

            </Dialog>

        </div>
    );
}

export default AISuggestions;