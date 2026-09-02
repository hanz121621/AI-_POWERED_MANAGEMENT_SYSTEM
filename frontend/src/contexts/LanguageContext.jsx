
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "@/services/api";
import AuthContext from "./AuthContext";

// ============================================================
// SUPPORTED LANGUAGES
// Must remain aligned with the backend System Settings.
// ============================================================

export const SUPPORTED_LANGUAGES = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
    },
    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
    },
    {
        code: "fr",
        name: "French",
        nativeName: "Français",
    },
    {
        code: "zh",
        name: "Chinese",
        nativeName: "中文",
    },
    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
    },
    {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
    },
    {
        code: "pt",
        name: "Portuguese",
        nativeName: "Português",
    },
    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
    },
];

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
    // ========================================================
    // ENGLISH
    // ========================================================

    en: {
        common: {
            save: "Save",
            saveChanges: "Save Changes",
            cancel: "Cancel",
            close: "Close",
            loading: "Loading...",
            saving: "Saving...",
            restoreDefaults: "Restore Default Settings",
            yes: "Yes",
            no: "No",
            enabled: "Enabled",
            disabled: "Disabled",
            search: "Search",
            view: "View",
            edit: "Edit",
            delete: "Delete",
            create: "Create",
            update: "Update",
            back: "Back",
            next: "Next",
            previous: "Previous",
            submit: "Submit",
            confirm: "Confirm",
        },

        navigation: {
            dashboard: "Dashboard",
            projects: "Projects",
            sprints: "Sprint",
            team: "Team",
            aiFeatures: "AI Features",
            reports: "Reports",
            profile: "Profile Management",
            settings: "Settings",
            help: "Help",
            logout: "Logout",
        },

        application: {
            name: "AIPMS",
            fullName: "AI-Powered Project Management System",
        },

        manager: {
            title: "Manager",
            signedInAs: "Signed in as",
            account: "Manager Account",
        },

        dashboard: {
            title: "Manager Dashboard",
            description:
                "Monitor projects, team performance, and overall project progress.",
            totalProjects: "Total Projects",
            activeProjects: "Active Projects",
            completedProjects: "Completed Projects",
            totalTasks: "Total Tasks",
            completedTasks: "Completed Tasks",
            teamMembers: "Team Members",
            activeSprints: "Active Sprints",
            projectProgress: "Project Progress",
            sprintProgress: "Sprint Progress",
            recentActivity: "Recent Activity",
            upcomingDeadlines: "Upcoming Deadlines",
            risksAndIssues: "Risks & Issues",
            aiRecommendations: "AI Recommendations",
            noRecentActivity: "No recent activity is available.",
        },

        projects: {
            title: "Project Management",
            description:
                "Manage projects, monitor progress, and coordinate project activities.",
            projects: "Projects",
            totalProjects: "Total Projects",
            activeProjects: "Active Projects",
            completedProjects: "Completed Projects",
            planningProjects: "Planning Projects",
            projectName: "Project Name",
            projectDescription: "Project Description",
            projectStatus: "Project Status",
            projectManager: "Project Manager",
            startDate: "Start Date",
            endDate: "End Date",
            progress: "Progress",
            createProject: "Create Project",
            editProject: "Edit Project",
            deleteProject: "Delete Project",
            viewProject: "View Project",
            active: "Active",
            completed: "Completed",
            planning: "Planning",
            delayed: "Delayed",
            noProjects: "No projects are available.",
        },

        sprints: {
            title: "Sprint Management",
            description:
                "Plan, monitor, and manage project sprints and their schedules.",
            totalSprints: "Total Sprints",
            activeSprints: "Active Sprints",
            completedSprints: "Completed Sprints",
            planningSprints: "Planning Sprints",
            sprintName: "Sprint Name",
            sprintGoal: "Sprint Goal",
            startDate: "Start Date",
            endDate: "End Date",
            status: "Status",
            progress: "Progress",
            createSprint: "Create Sprint",
            updateSprint: "Update Sprint",
            completeSprint: "Complete Sprint",
            deleteSprint: "Delete Sprint",
            active: "Active",
            completed: "Completed",
            planning: "Planning",
            noSprints: "No sprints are available.",
        },

        team: {
            title: "Team Management",
            description:
                "Manage team members, assignments, responsibilities, and performance.",
            teamMembers: "Team Members",
            memberName: "Member Name",
            email: "Email",
            role: "Role",
            status: "Status",
            active: "Active",
            inactive: "Inactive",
            assignProject: "Assign Project",
            viewProfile: "View Profile",
            noMembers: "No team members are available.",
        },

        ai: {
            title: "AI Features",
            description:
                "Review AI-powered project insights, recommendations, risks, and predictions.",
            recommendations: "AI Recommendations",
            riskPrediction: "AI Risk Prediction",
            insights: "AI Insights",
            alerts: "AI Alerts",
            conflicts: "Conflict Detection",
            decomposition: "Task Decomposition",
            projectRisk: "Project Risk",
            recommendation: "Recommendation",
            confidence: "Confidence",
            noInsights: "No AI insights are currently available.",
        },

        reports: {
            title: "Reports",
            description:
                "Review project, team, activity, and performance reports.",
            projectReports: "Project Reports",
            teamReports: "Team Reports",
            activityReports: "Activity Reports",
            performanceReports: "Performance Reports",
            generateReport: "Generate Report",
            reportType: "Report Type",
            dateRange: "Date Range",
            noReports: "No reports are available.",
        },

        profile: {
            title: "Profile Management",
            description:
                "Review and manage your manager account information.",
            personalInformation: "Personal Information",
            fullName: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            role: "Role",
            organization: "Organization",
            department: "Department",
            saveProfile: "Save Profile",
            profileUpdated:
                "Your profile information has been updated successfully.",
        },

        help: {
            title: "Help",
            description:
                "Access assistance and information about using AIPMS.",
            frequentlyAskedQuestions: "Frequently Asked Questions",
            documentation: "Documentation",
            contactSupport: "Contact Support",
        },

        settings: {
            title: "Manager Settings",
            description:
                "Manage your personal application preferences and configuration.",
            signedInAs: "Signed in as",
            restoreDefaults: "Restore Default Settings",

            preferencesSaved:
                "Your language and theme preferences have been saved successfully.",

            languageTheme: "Language & Theme",
            notifications: "Notifications",
            dashboard: "Dashboard",
            aiPreferences: "AI Preferences",

            languagePreference: "Language Preference",
            languageDescription:
                "Select the language to be used throughout the application.",

            applicationLanguage: "Application Language",
            languageSavedDescription:
                "Your selected language is securely saved with your account and synchronized across sessions and devices.",

            saveLanguageTheme: "Save Language & Theme",

            themePreference: "Theme Preference",
            themeDescription:
                "Select the appearance you would like AIPMS to use.",

            light: "Light",
            lightDescription:
                "Use a light appearance throughout the application.",

            dark: "Dark",
            darkDescription:
                "Use a dark appearance throughout the application.",

            system: "System",
            systemDescription:
                "Follow your operating system's appearance preference.",

            saveTheme: "Save Theme",

            storageDescription:
                "Your language and theme preferences are synchronized with your AIPMS account and are not used as browser preference storage.",

            preferenceStorage: "Preference Storage",
            preferenceStorageDescription:
                "Manager preferences are stored in the AIPMS account database and synchronized through the backend API.",

            loading: "Loading manager settings...",

            unableLoad:
                "Unable to load manager settings. Please try again.",

            errorManagerAccess:
                "Manager access is required to view these settings.",

            saving: "Saving...",

            saveError:
                "Failed to save language and theme preferences.",

            restoreSuccess:
                "Manager settings have been restored to their default values.",

            restoreError:
                "Failed to restore the default manager settings.",

            notificationsTitle: "Notification Preferences",
            notificationsDescription:
                "Configure which notifications you would like to receive.",

            emailNotifications: "Email Notifications",
            emailNotificationsDescription:
                "Receive important AIPMS notifications by email.",

            sprintUpdates: "Sprint Updates",
            sprintUpdatesDescription:
                "Receive notifications regarding sprint changes and progress.",

            taskUpdates: "Task Updates",
            taskUpdatesDescription:
                "Receive notifications when assigned tasks are updated.",

            aiAlerts: "AI Alerts",
            aiAlertsDescription:
                "Receive important project alerts generated by AIPMS AI.",

            systemNotifications: "System Notifications",
            systemNotificationsDescription:
                "Receive important system notifications.",

            emailChannel: "Email Channel",
            emailChannelDescription:
                "Allow notifications to be delivered through email.",

            inAppChannel: "In-App Channel",
            inAppChannelDescription:
                "Display notifications within the AIPMS application.",

            notificationsSaved:
                "Notification settings have been saved successfully.",

            dashboardTitle: "Dashboard Preferences",
            dashboardDescription:
                "Select the information you would like to display on your manager dashboard.",

            projectProgress: "Project Progress",
            projectProgressDescription:
                "Display project progress information.",

            sprintProgress: "Sprint Progress",
            sprintProgressDescription:
                "Display sprint progress information.",

            projectTimeline: "Project Timeline",
            projectTimelineDescription:
                "Display project timeline information.",

            risksIssues: "Risks & Issues",
            risksIssuesDescription:
                "Display identified project risks and issues.",

            teamProgress: "Team Progress",
            teamProgressDescription:
                "Display team progress information.",

            deadlineInformation: "Deadline Information",
            deadlineInformationDescription:
                "Display upcoming project deadlines.",

            aiRecommendations: "AI Recommendations",
            aiRecommendationsDescription:
                "Display AI-generated recommendations on the dashboard.",

            aiRiskPrediction: "AI Risk Prediction",
            aiRiskPredictionDescription:
                "Display AI-powered project risk predictions.",

            recentActivity: "Recent Activity",
            recentActivityDescription:
                "Display recent project activity.",

            notificationsDashboard: "Notifications",
            notificationsDashboardDescription:
                "Display notifications on the dashboard.",

            dashboardSaved:
                "Dashboard preferences have been saved successfully.",

            aiTitle: "AI Preferences",
            aiDescription:
                "Configure how AIPMS AI recommendations, alerts, and insights are presented.",

            aiNotifications: "AI Notifications",
            aiNotificationsDescription:
                "Allow notifications generated by AIPMS AI.",

            delayWarnings: "Delay Warnings",
            delayWarningsDescription:
                "Receive AI-generated warnings about potential project delays.",

            aiInsightVisibility: "AI Insight Visibility",
            aiInsightVisibilityDescription:
                "Display AI-generated insights throughout the application.",

            summaryFrequency: "Summary Frequency",
            summaryFrequencyDescription:
                "Select how frequently AI summaries should be generated.",

            recommendationDisplay: "Recommendation Display",
            recommendationDisplayDescription:
                "Select the level of detail shown in AI recommendations.",

            notificationPriority: "Notification Priority",
            notificationPriorityDescription:
                "Select the priority level of AI notifications to display.",

            realtime: "Real-time",
            daily: "Daily",
            weekly: "Weekly",
            never: "Never",

            compact: "Compact",
            detailed: "Detailed",

            all: "All",
            important: "Important",
            critical: "Critical",

            aiSaved:
                "AI preferences have been saved successfully.",
        },
    },

    // ========================================================
    // AMHARIC
    // ========================================================

    am: {
        common: {
            save: "አስቀምጥ",
            saveChanges: "ለውጦችን አስቀምጥ",
            cancel: "ሰርዝ",
            close: "ዝጋ",
            loading: "በመጫን ላይ...",
            saving: "በማስቀመጥ ላይ...",
            restoreDefaults: "ነባሪ ቅንብሮችን መልስ",
            yes: "አዎ",
            no: "አይ",
            enabled: "ነቅቷል",
            disabled: "ቦዝኗል",
            search: "ፈልግ",
            view: "ይመልከቱ",
            edit: "አርም",
            delete: "ሰርዝ",
            create: "ፍጠር",
            update: "አዘምን",
            back: "ተመለስ",
            next: "ቀጣይ",
            previous: "ቀዳሚ",
            submit: "አስገባ",
            confirm: "አረጋግጥ",
        },

        navigation: {
            dashboard: "ዳሽቦርድ",
            projects: "ፕሮጀክቶች",
            sprints: "ስፕሪንት",
            team: "ቡድን",
            aiFeatures: "የAI ባህሪያት",
            reports: "ሪፖርቶች",
            profile: "የመገለጫ አስተዳደር",
            settings: "ቅንብሮች",
            help: "እገዛ",
            logout: "ውጣ",
        },

        application: {
            name: "AIPMS",
            fullName: "በሰው ሰራሽ እውቀት የሚመራ የፕሮጀክት አስተዳደር ሥርዓት",
        },

        manager: {
            title: "ማኔጀር",
            signedInAs: "የገቡት እንደ",
            account: "የማኔጀር መለያ",
        },

        dashboard: {
            title: "የማኔጀር ዳሽቦርድ",
            description:
                "ፕሮጀክቶችን፣ የቡድን አፈጻጸምን እና አጠቃላይ የፕሮጀክት እድገትን ይከታተሉ።",
            totalProjects: "ጠቅላላ ፕሮጀክቶች",
            activeProjects: "ንቁ ፕሮጀክቶች",
            completedProjects: "የተጠናቀቁ ፕሮጀክቶች",
            totalTasks: "ጠቅላላ ተግባራት",
            completedTasks: "የተጠናቀቁ ተግባራት",
            teamMembers: "የቡድን አባላት",
            activeSprints: "ንቁ ስፕሪንቶች",
            projectProgress: "የፕሮጀክት እድገት",
            sprintProgress: "የስፕሪንት እድገት",
            recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
            upcomingDeadlines: "በቅርቡ የሚደርሱ የመጨረሻ ቀናት",
            risksAndIssues: "አደጋዎች እና ጉዳዮች",
            aiRecommendations: "የAI ምክረ ሀሳቦች",
            noRecentActivity: "ምንም የቅርብ ጊዜ እንቅስቃሴ የለም።",
        },

        projects: {
            title: "የፕሮጀክት አስተዳደር",
            description:
                "ፕሮጀክቶችን ያስተዳድሩ፣ እድገታቸውን ይከታተሉ እና የፕሮጀክት እንቅስቃሴዎችን ያስተባብሩ።",
            projects: "ፕሮጀክቶች",
            totalProjects: "ጠቅላላ ፕሮጀክቶች",
            activeProjects: "ንቁ ፕሮጀክቶች",
            completedProjects: "የተጠናቀቁ ፕሮጀክቶች",
            planningProjects: "በእቅድ ላይ ያሉ ፕሮጀክቶች",
            projectName: "የፕሮጀክት ስም",
            projectDescription: "የፕሮጀክት መግለጫ",
            projectStatus: "የፕሮጀክት ሁኔታ",
            projectManager: "የፕሮጀክት ማኔጀር",
            startDate: "የመጀመሪያ ቀን",
            endDate: "የመጨረሻ ቀን",
            progress: "እድገት",
            createProject: "ፕሮጀክት ፍጠር",
            editProject: "ፕሮጀክት አርም",
            deleteProject: "ፕሮጀክት ሰርዝ",
            viewProject: "ፕሮጀክት ይመልከቱ",
            active: "ንቁ",
            completed: "ተጠናቋል",
            planning: "በእቅድ ላይ",
            delayed: "ዘግይቷል",
            noProjects: "ምንም ፕሮጀክት የለም።",
        },

        sprints: {
            title: "የስፕሪንት አስተዳደር",
            description:
                "የፕሮጀክት ስፕሪንቶችን እና የሥራ መርሃ ግብራቸውን ያቅዱ፣ ይከታተሉ እና ያስተዳድሩ።",
            totalSprints: "ጠቅላላ ስፕሪንቶች",
            activeSprints: "ንቁ ስፕሪንቶች",
            completedSprints: "የተጠናቀቁ ስፕሪንቶች",
            planningSprints: "በእቅድ ላይ ያሉ ስፕሪንቶች",
            sprintName: "የስፕሪንት ስም",
            sprintGoal: "የስፕሪንት ዓላማ",
            startDate: "የመጀመሪያ ቀን",
            endDate: "የመጨረሻ ቀን",
            status: "ሁኔታ",
            progress: "እድገት",
            createSprint: "ስፕሪንት ፍጠር",
            updateSprint: "ስፕሪንት አዘምን",
            completeSprint: "ስፕሪንት አጠናቅቅ",
            deleteSprint: "ስፕሪንት ሰርዝ",
            active: "ንቁ",
            completed: "ተጠናቋል",
            planning: "በእቅድ ላይ",
            noSprints: "ምንም ስፕሪንት የለም።",
        },

        team: {
            title: "የቡድን አስተዳደር",
            description:
                "የቡድን አባላትን፣ ምደባዎችን፣ ኃላፊነቶችን እና አፈጻጸምን ያስተዳድሩ።",
            teamMembers: "የቡድን አባላት",
            memberName: "የአባል ስም",
            email: "ኢሜይል",
            role: "ሚና",
            status: "ሁኔታ",
            active: "ንቁ",
            inactive: "የቦዘነ",
            assignProject: "ፕሮጀክት መድብ",
            viewProfile: "መገለጫ ይመልከቱ",
            noMembers: "ምንም የቡድን አባል የለም።",
        },

        ai: {
            title: "የAI ባህሪያት",
            description:
                "በAI የተደገፉ የፕሮጀክት ግንዛቤዎችን፣ ምክረ ሀሳቦችን፣ አደጋዎችን እና ትንበያዎችን ይገምግሙ።",
            recommendations: "የAI ምክረ ሀሳቦች",
            riskPrediction: "የAI አደጋ ትንበያ",
            insights: "የAI ግንዛቤዎች",
            alerts: "የAI ማሳወቂያዎች",
            conflicts: "የግጭት ማወቂያ",
            decomposition: "የተግባር ክፍፍል",
            projectRisk: "የፕሮጀክት አደጋ",
            recommendation: "ምክረ ሀሳብ",
            confidence: "የመተማመን ደረጃ",
            noInsights: "በአሁኑ ጊዜ ምንም የAI ግንዛቤ የለም።",
        },

        reports: {
            title: "ሪፖርቶች",
            description:
                "የፕሮጀክት፣ የቡድን፣ የእንቅስቃሴ እና የአፈጻጸም ሪፖርቶችን ይመልከቱ።",
            projectReports: "የፕሮጀክት ሪፖርቶች",
            teamReports: "የቡድን ሪፖርቶች",
            activityReports: "የእንቅስቃሴ ሪፖርቶች",
            performanceReports: "የአፈጻጸም ሪፖርቶች",
            generateReport: "ሪፖርት ፍጠር",
            reportType: "የሪፖርት ዓይነት",
            dateRange: "የቀን ክልል",
            noReports: "ምንም ሪፖርት የለም።",
        },

        profile: {
            title: "የመገለጫ አስተዳደር",
            description:
                "የማኔጀር መለያዎን መረጃ ይመልከቱ እና ያስተዳድሩ።",
            personalInformation: "የግል መረጃ",
            fullName: "ሙሉ ስም",
            email: "የኢሜይል አድራሻ",
            phone: "ስልክ ቁጥር",
            role: "ሚና",
            organization: "ድርጅት",
            department: "ዲፓርትመንት",
            saveProfile: "መገለጫን አስቀምጥ",
            profileUpdated:
                "የመገለጫ መረጃዎ በተሳካ ሁኔታ ተዘምኗል።",
        },

        help: {
            title: "እገዛ",
            description:
                "AIPMSን ስለመጠቀም እርዳታ እና መረጃ ያግኙ።",
            frequentlyAskedQuestions: "በተደጋጋሚ የሚጠየቁ ጥያቄዎች",
            documentation: "ሰነዶች",
            contactSupport: "የድጋፍ አገልግሎትን ያግኙ",
        },

        settings: {
            title: "የማኔጀር ቅንብሮች",
            description:
                "የግል መተግበሪያ ምርጫዎችዎን እና ቅንብሮችዎን ያስተዳድሩ።",
            signedInAs: "የገቡት እንደ",
            restoreDefaults: "ነባሪ ቅንብሮችን መልስ",

            preferencesSaved:
                "የቋንቋ እና የገጽታ ምርጫዎችዎ በተሳካ ሁኔታ ተቀምጠዋል።",

            languageTheme: "ቋንቋ እና ገጽታ",
            notifications: "ማሳወቂያዎች",
            dashboard: "ዳሽቦርድ",
            aiPreferences: "የAI ምርጫዎች",

            languagePreference: "የቋንቋ ምርጫ",
            languageDescription:
                "በመተግበሪያው ውስጥ በሙሉ የሚጠቀሙበትን ቋንቋ ይምረጡ።",

            applicationLanguage: "የመተግበሪያ ቋንቋ",
            languageSavedDescription:
                "የመረጡት ቋንቋ ከመለያዎ ጋር በደህንነት ይቀመጣል እና በተለያዩ መሣሪያዎችና የመግቢያ ክፍለ ጊዜዎች ውስጥ ይመለሳል።",

            saveLanguageTheme: "ቋንቋ እና ገጽታ አስቀምጥ",

            themePreference: "የገጽታ ምርጫ",
            themeDescription:
                "AIPMS እንዲጠቀምበት የሚፈልጉትን የመተግበሪያ ገጽታ ይምረጡ።",

            light: "ብርሃናማ",
            lightDescription:
                "በመተግበሪያው ውስጥ ብርሃናማ ገጽታን ይጠቀሙ።",

            dark: "ጨለማ",
            darkDescription:
                "በመተግበሪያው ውስጥ ጨለማ ገጽታን ይጠቀሙ።",

            system: "የሥርዓት ገጽታ",
            systemDescription:
                "የኮምፒዩተርዎን የገጽታ ምርጫ ይከተላል።",

            saveTheme: "ገጽታን አስቀምጥ",

            storageDescription:
                "የቋንቋ እና የገጽታ ምርጫዎችዎ ከAIPMS መለያዎ ጋር ይመሳሰላሉ እና እንደ የአሳሽ ማከማቻ ምርጫ አይጠቀሙም።",

            preferenceStorage: "የምርጫ ማከማቻ",
            preferenceStorageDescription:
                "የማኔጀር ምርጫዎች በAIPMS መለያ ዳታቤዝ ውስጥ ይቀመጣሉ እና በBackend API በኩል ይመሳሰላሉ።",

            loading: "የማኔጀር ቅንብሮችን በመጫን ላይ...",

            unableLoad:
                "የማኔጀር ቅንብሮችን መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።",

            errorManagerAccess:
                "እነዚህን ቅንብሮች ለማየት የማኔጀር ፈቃድ ያስፈልጋል።",

            saving: "በማስቀመጥ ላይ...",

            saveError:
                "የቋንቋ እና የገጽታ ምርጫዎችን ማስቀመጥ አልተቻለም።",

            restoreSuccess:
                "የማኔጀር ቅንብሮች ወደ ነባሪ ሁኔታቸው ተመልሰዋል።",

            restoreError:
                "የማኔጀር ነባሪ ቅንብሮችን መመለስ አልተቻለም።",

            notificationsTitle: "የማሳወቂያ ምርጫዎች",
            notificationsDescription:
                "ማግኘት የሚፈልጓቸውን ማሳወቂያዎች ያዋቅሩ።",

            emailNotifications: "የኢሜይል ማሳወቂያዎች",
            emailNotificationsDescription:
                "አስፈላጊ የAIPMS ማሳወቂያዎችን በኢሜይል ይቀበሉ።",

            sprintUpdates: "የስፕሪንት ማሻሻያዎች",
            sprintUpdatesDescription:
                "ስለ ስፕሪንት ለውጦች እና እድገት ማሳወቂያዎችን ይቀበሉ።",

            taskUpdates: "የተግባር ማሻሻያዎች",
            taskUpdatesDescription:
                "የተመደቡልዎት ተግባራት ሲዘመኑ ማሳወቂያ ይቀበሉ።",

            aiAlerts: "የAI ማሳወቂያዎች",
            aiAlertsDescription:
                "በAIPMS AI የተፈጠሩ አስፈላጊ የፕሮጀክት ማሳወቂያዎችን ይቀበሉ።",

            systemNotifications: "የሥርዓት ማሳወቂያዎች",
            systemNotificationsDescription:
                "አስፈላጊ የሥርዓት ማሳወቂያዎችን ይቀበሉ።",

            emailChannel: "የኢሜይል መስመር",
            emailChannelDescription:
                "ማሳወቂያዎች በኢሜይል እንዲደርሱ ይፍቀዱ።",

            inAppChannel: "የመተግበሪያ ውስጥ ማሳወቂያ",
            inAppChannelDescription:
                "ማሳወቂያዎችን በAIPMS መተግበሪያ ውስጥ ያሳዩ።",

            notificationsSaved:
                "የማሳወቂያ ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል።",

            dashboardTitle: "የዳሽቦርድ ምርጫዎች",
            dashboardDescription:
                "በማኔጀር ዳሽቦርድዎ ላይ እንዲታዩ የሚፈልጓቸውን መረጃዎች ይምረጡ።",

            projectProgress: "የፕሮጀክት እድገት",
            projectProgressDescription:
                "የፕሮጀክት እድገት መረጃን ያሳዩ።",

            sprintProgress: "የስፕሪንት እድገት",
            sprintProgressDescription:
                "የስፕሪንት እድገት መረጃን ያሳዩ።",

            projectTimeline: "የፕሮጀክት የጊዜ ሰሌዳ",
            projectTimelineDescription:
                "የፕሮጀክት የጊዜ ሰሌዳ መረጃን ያሳዩ።",

            risksIssues: "አደጋዎች እና ጉዳዮች",
            risksIssuesDescription:
                "የተለዩ የፕሮጀክት አደጋዎችን እና ጉዳዮችን ያሳዩ።",

            teamProgress: "የቡድን እድገት",
            teamProgressDescription:
                "የቡድን እድገት መረጃን ያሳዩ።",

            deadlineInformation: "የመጨረሻ ቀን መረጃ",
            deadlineInformationDescription:
                "በቅርቡ የሚደርሱ የፕሮጀክት የመጨረሻ ቀናትን ያሳዩ።",

            aiRecommendations: "የAI ምክረ ሀሳቦች",
            aiRecommendationsDescription:
                "በAI የተፈጠሩ ምክረ ሀሳቦችን በዳሽቦርዱ ላይ ያሳዩ።",

            aiRiskPrediction: "የAI አደጋ ትንበያ",
            aiRiskPredictionDescription:
                "በAI የተደገፉ የፕሮጀክት አደጋ ትንበያዎችን ያሳዩ።",

            recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
            recentActivityDescription:
                "የቅርብ ጊዜ የፕሮጀክት እንቅስቃሴን ያሳዩ።",

            notificationsDashboard: "ማሳወቂያዎች",
            notificationsDashboardDescription:
                "ማሳወቂያዎችን በዳሽቦርዱ ላይ ያሳዩ።",

            dashboardSaved:
                "የዳሽቦርድ ምርጫዎች በተሳካ ሁኔታ ተቀምጠዋል።",

            aiTitle: "የAI ምርጫዎች",
            aiDescription:
                "የAIPMS AI ምክረ ሀሳቦች፣ ማሳወቂያዎች እና ግንዛቤዎች እንዴት እንደሚቀርቡ ያዋቅሩ።",

            aiNotifications: "የAI ማሳወቂያዎች",
            aiNotificationsDescription:
                "በAIPMS AI የሚፈጠሩ ማሳወቂያዎችን ይፍቀዱ።",

            delayWarnings: "የመዘግየት ማስጠንቀቂያዎች",
            delayWarningsDescription:
                "ስለሚከሰቱ የፕሮጀክት መዘግየቶች በAI የተፈጠሩ ማስጠንቀቂያዎችን ይቀበሉ።",

            aiInsightVisibility: "የAI ግንዛቤ ታይነት",
            aiInsightVisibilityDescription:
                "በAI የተፈጠሩ ግንዛቤዎችን በመተግበሪያው ውስጥ ያሳዩ።",

            summaryFrequency: "የማጠቃለያ ድግግሞሽ",
            summaryFrequencyDescription:
                "የAI ማጠቃለያዎች ምን ያህል ጊዜ እንዲፈጠሩ ይምረጡ።",

            recommendationDisplay: "የምክረ ሀሳብ አቀራረብ",
            recommendationDisplayDescription:
                "በAI ምክረ ሀሳቦች ውስጥ የሚታየውን የዝርዝር ደረጃ ይምረጡ።",

            notificationPriority: "የማሳወቂያ ቅድሚያ",
            notificationPriorityDescription:
                "ለሚታዩ የAI ማሳወቂያዎች የቅድሚያ ደረጃን ይምረጡ።",

            realtime: "በቅጽበት",
            daily: "በየቀኑ",
            weekly: "በየሳምንቱ",
            never: "በፍጹም",

            compact: "አጭር",
            detailed: "ዝርዝር",

            all: "ሁሉም",
            important: "አስፈላጊ",
            critical: "እጅግ አስፈላጊ",

            aiSaved:
                "የAI ምርጫዎች በተሳካ ሁኔታ ተቀምጠዋል።",
        },
    },

    // ========================================================
    // FRENCH
    // ========================================================

    fr: {
        common: {
            save: "Enregistrer",
            saveChanges: "Enregistrer les modifications",
            cancel: "Annuler",
            close: "Fermer",
            loading: "Chargement...",
            saving: "Enregistrement...",
            restoreDefaults: "Restaurer les paramètres par défaut",
            yes: "Oui",
            no: "Non",
            enabled: "Activé",
            disabled: "Désactivé",
            search: "Rechercher",
            view: "Afficher",
            edit: "Modifier",
            delete: "Supprimer",
            create: "Créer",
            update: "Mettre à jour",
            back: "Retour",
            next: "Suivant",
            previous: "Précédent",
            submit: "Soumettre",
            confirm: "Confirmer",
        },

        navigation: {
            dashboard: "Tableau de bord",
            projects: "Projets",
            sprints: "Sprint",
            team: "Équipe",
            aiFeatures: "Fonctionnalités IA",
            reports: "Rapports",
            profile: "Gestion du profil",
            settings: "Paramètres",
            help: "Aide",
            logout: "Déconnexion",
        },

        application: {
            name: "AIPMS",
            fullName: "Système de gestion de projets alimenté par l'IA",
        },

        manager: {
            title: "Responsable",
            signedInAs: "Connecté en tant que",
            account: "Compte du responsable",
        },

        dashboard: {
            title: "Tableau de bord du responsable",
            description:
                "Surveillez les projets, les performances de l'équipe et l'avancement global des projets.",
            totalProjects: "Total des projets",
            activeProjects: "Projets actifs",
            completedProjects: "Projets terminés",
            totalTasks: "Total des tâches",
            completedTasks: "Tâches terminées",
            teamMembers: "Membres de l'équipe",
            activeSprints: "Sprints actifs",
            projectProgress: "Avancement du projet",
            sprintProgress: "Avancement du sprint",
            recentActivity: "Activité récente",
            upcomingDeadlines: "Échéances à venir",
            risksAndIssues: "Risques et problèmes",
            aiRecommendations: "Recommandations IA",
            noRecentActivity: "Aucune activité récente n'est disponible.",
        },

        settings: {
            title: "Paramètres du responsable",
            description:
                "Gérez vos préférences personnelles et la configuration de l'application.",
            signedInAs: "Connecté en tant que",
            restoreDefaults: "Restaurer les paramètres par défaut",
            preferencesSaved:
                "Vos préférences de langue et de thème ont été enregistrées avec succès.",
            languageTheme: "Langue et thème",
            notifications: "Notifications",
            dashboard: "Tableau de bord",
            aiPreferences: "Préférences IA",
            languagePreference: "Préférence linguistique",
            languageDescription:
                "Sélectionnez la langue à utiliser dans l'ensemble de l'application.",
            applicationLanguage: "Langue de l'application",
            languageSavedDescription:
                "La langue sélectionnée est enregistrée avec votre compte et synchronisée entre vos sessions et appareils.",
            saveLanguageTheme: "Enregistrer la langue et le thème",
            themePreference: "Préférence de thème",
            themeDescription:
                "Sélectionnez l'apparence que vous souhaitez utiliser dans AIPMS.",
            light: "Clair",
            lightDescription:
                "Utiliser une apparence claire dans toute l'application.",
            dark: "Sombre",
            darkDescription:
                "Utiliser une apparence sombre dans toute l'application.",
            system: "Système",
            systemDescription:
                "Suivre les préférences d'apparence de votre système d'exploitation.",
            saveTheme: "Enregistrer le thème",
            storageDescription:
                "Vos préférences de langue et de thème sont synchronisées avec votre compte AIPMS et ne sont pas utilisées comme stockage des préférences du navigateur.",
            preferenceStorage: "Stockage des préférences",
            preferenceStorageDescription:
                "Les préférences du responsable sont enregistrées dans la base de données du compte AIPMS et synchronisées via l'API backend.",
            loading: "Chargement des paramètres du responsable...",
            unableLoad:
                "Impossible de charger les paramètres du responsable. Veuillez réessayer.",
            errorManagerAccess:
                "Un accès responsable est requis pour consulter ces paramètres.",
            saving: "Enregistrement...",
            saveError:
                "Impossible d'enregistrer les préférences de langue et de thème.",
            restoreSuccess:
                "Les paramètres du responsable ont été restaurés à leurs valeurs par défaut.",
            restoreError:
                "Impossible de restaurer les paramètres par défaut du responsable.",
            notificationsTitle: "Préférences de notification",
            notificationsDescription:
                "Configurez les notifications que vous souhaitez recevoir.",
            emailNotifications: "Notifications par e-mail",
            emailNotificationsDescription:
                "Recevez les notifications importantes d'AIPMS par e-mail.",
            sprintUpdates: "Mises à jour des sprints",
            sprintUpdatesDescription:
                "Recevez des notifications concernant les modifications et l'avancement des sprints.",
            taskUpdates: "Mises à jour des tâches",
            taskUpdatesDescription:
                "Recevez des notifications lorsque les tâches qui vous sont attribuées sont mises à jour.",
            aiAlerts: "Alertes IA",
            aiAlertsDescription:
                "Recevez les alertes importantes relatives aux projets générées par l'IA d'AIPMS.",
            systemNotifications: "Notifications système",
            systemNotificationsDescription:
                "Recevez les notifications système importantes.",
            emailChannel: "Canal e-mail",
            emailChannelDescription:
                "Autoriser l'envoi des notifications par e-mail.",
            inAppChannel: "Canal intégré à l'application",
            inAppChannelDescription:
                "Afficher les notifications dans l'application AIPMS.",
            notificationsSaved:
                "Les paramètres de notification ont été enregistrés avec succès.",
            dashboardTitle: "Préférences du tableau de bord",
            dashboardDescription:
                "Sélectionnez les informations à afficher sur votre tableau de bord de responsable.",
            projectProgress: "Avancement du projet",
            projectProgressDescription:
                "Afficher les informations relatives à l'avancement des projets.",
            sprintProgress: "Avancement du sprint",
            sprintProgressDescription:
                "Afficher les informations relatives à l'avancement des sprints.",
            projectTimeline: "Calendrier du projet",
            projectTimelineDescription:
                "Afficher les informations relatives au calendrier du projet.",
            risksIssues: "Risques et problèmes",
            risksIssuesDescription:
                "Afficher les risques et problèmes de projet identifiés.",
            teamProgress: "Avancement de l'équipe",
            teamProgressDescription:
                "Afficher les informations relatives à l'avancement de l'équipe.",
            deadlineInformation: "Informations sur les échéances",
            deadlineInformationDescription:
                "Afficher les prochaines échéances des projets.",
            aiRecommendations: "Recommandations IA",
            aiRecommendationsDescription:
                "Afficher les recommandations générées par l'IA sur le tableau de bord.",
            aiRiskPrediction: "Prédiction des risques par IA",
            aiRiskPredictionDescription:
                "Afficher les prédictions de risques de projet alimentées par l'IA.",
            recentActivity: "Activité récente",
            recentActivityDescription:
                "Afficher les activités récentes des projets.",
            notificationsDashboard: "Notifications",
            notificationsDashboardDescription:
                "Afficher les notifications sur le tableau de bord.",
            dashboardSaved:
                "Les préférences du tableau de bord ont été enregistrées avec succès.",
            aiTitle: "Préférences IA",
            aiDescription:
                "Configurez la manière dont les recommandations, alertes et analyses de l'IA d'AIPMS sont présentées.",
            aiNotifications: "Notifications IA",
            aiNotificationsDescription:
                "Autoriser les notifications générées par l'IA d'AIPMS.",
            delayWarnings: "Alertes de retard",
            delayWarningsDescription:
                "Recevez des alertes générées par l'IA concernant les retards potentiels des projets.",
            aiInsightVisibility: "Visibilité des analyses IA",
            aiInsightVisibilityDescription:
                "Afficher les analyses générées par l'IA dans l'ensemble de l'application.",
            summaryFrequency: "Fréquence des synthèses",
            summaryFrequencyDescription:
                "Sélectionnez la fréquence de génération des synthèses IA.",
            recommendationDisplay: "Affichage des recommandations",
            recommendationDisplayDescription:
                "Sélectionnez le niveau de détail des recommandations IA.",
            notificationPriority: "Priorité des notifications",
            notificationPriorityDescription:
                "Sélectionnez le niveau de priorité des notifications IA à afficher.",
            realtime: "Temps réel",
            daily: "Quotidien",
            weekly: "Hebdomadaire",
            never: "Jamais",
            compact: "Compact",
            detailed: "Détaillé",
            all: "Toutes",
            important: "Important",
            critical: "Critique",
            aiSaved:
                "Les préférences IA ont été enregistrées avec succès.",
        },
    },

    // ========================================================
    // SPANISH
    // ========================================================

    es: {
        common: {
            save: "Guardar",
            saveChanges: "Guardar cambios",
            cancel: "Cancelar",
            close: "Cerrar",
            loading: "Cargando...",
            saving: "Guardando...",
            restoreDefaults: "Restaurar configuración predeterminada",
            yes: "Sí",
            no: "No",
            enabled: "Activado",
            disabled: "Desactivado",
            search: "Buscar",
            view: "Ver",
            edit: "Editar",
            delete: "Eliminar",
            create: "Crear",
            update: "Actualizar",
            back: "Atrás",
            next: "Siguiente",
            previous: "Anterior",
            submit: "Enviar",
            confirm: "Confirmar",
        },

        navigation: {
            dashboard: "Panel",
            projects: "Proyectos",
            sprints: "Sprint",
            team: "Equipo",
            aiFeatures: "Funciones de IA",
            reports: "Informes",
            profile: "Gestión del perfil",
            settings: "Configuración",
            help: "Ayuda",
            logout: "Cerrar sesión",
        },

        application: {
            name: "AIPMS",
            fullName: "Sistema de gestión de proyectos impulsado por IA",
        },

        manager: {
            title: "Administrador",
            signedInAs: "Sesión iniciada como",
            account: "Cuenta del administrador",
        },

        dashboard: {
            title: "Panel del administrador",
            description:
                "Supervise los proyectos, el rendimiento del equipo y el progreso general de los proyectos.",
            totalProjects: "Total de proyectos",
            activeProjects: "Proyectos activos",
            completedProjects: "Proyectos completados",
            totalTasks: "Total de tareas",
            completedTasks: "Tareas completadas",
            teamMembers: "Miembros del equipo",
            activeSprints: "Sprints activos",
            projectProgress: "Progreso del proyecto",
            sprintProgress: "Progreso del sprint",
            recentActivity: "Actividad reciente",
            upcomingDeadlines: "Próximos plazos",
            risksAndIssues: "Riesgos y problemas",
            aiRecommendations: "Recomendaciones de IA",
            noRecentActivity: "No hay actividad reciente disponible.",
        },

        settings: {
            title: "Configuración del administrador",
            description:
                "Administre sus preferencias personales y la configuración de la aplicación.",
            signedInAs: "Sesión iniciada como",
            restoreDefaults: "Restaurar configuración predeterminada",
            preferencesSaved:
                "Sus preferencias de idioma y tema se han guardado correctamente.",
            languageTheme: "Idioma y tema",
            notifications: "Notificaciones",
            dashboard: "Panel",
            aiPreferences: "Preferencias de IA",
            languagePreference: "Preferencia de idioma",
            languageDescription:
                "Seleccione el idioma que se utilizará en toda la aplicación.",
            applicationLanguage: "Idioma de la aplicación",
            languageSavedDescription:
                "El idioma seleccionado se guarda con su cuenta y se sincroniza entre sus sesiones y dispositivos.",
            saveLanguageTheme: "Guardar idioma y tema",
            themePreference: "Preferencia de tema",
            themeDescription:
                "Seleccione la apariencia que desea utilizar en AIPMS.",
            light: "Claro",
            lightDescription:
                "Utilizar una apariencia clara en toda la aplicación.",
            dark: "Oscuro",
            darkDescription:
                "Utilizar una apariencia oscura en toda la aplicación.",
            system: "Sistema",
            systemDescription:
                "Seguir la preferencia de apariencia de su sistema operativo.",
            saveTheme: "Guardar tema",
            storageDescription:
                "Sus preferencias de idioma y tema se sincronizan con su cuenta de AIPMS y no se utilizan como almacenamiento de preferencias del navegador.",
            preferenceStorage: "Almacenamiento de preferencias",
            preferenceStorageDescription:
                "Las preferencias del administrador se almacenan en la base de datos de la cuenta de AIPMS y se sincronizan mediante la API del backend.",
            loading: "Cargando la configuración del administrador...",
            unableLoad:
                "No se pudo cargar la configuración del administrador. Inténtelo de nuevo.",
            errorManagerAccess:
                "Se requiere acceso de administrador para consultar esta configuración.",
            saving: "Guardando...",
            saveError:
                "No se pudieron guardar las preferencias de idioma y tema.",
            restoreSuccess:
                "La configuración del administrador se ha restaurado a sus valores predeterminados.",
            restoreError:
                "No se pudo restaurar la configuración predeterminada del administrador.",
            notificationsTitle: "Preferencias de notificaciones",
            notificationsDescription:
                "Configure las notificaciones que desea recibir.",
            emailNotifications: "Notificaciones por correo electrónico",
            emailNotificationsDescription:
                "Reciba notificaciones importantes de AIPMS por correo electrónico.",
            sprintUpdates: "Actualizaciones de sprints",
            sprintUpdatesDescription:
                "Reciba notificaciones sobre cambios y progreso de los sprints.",
            taskUpdates: "Actualizaciones de tareas",
            taskUpdatesDescription:
                "Reciba notificaciones cuando se actualicen las tareas que tiene asignadas.",
            aiAlerts: "Alertas de IA",
            aiAlertsDescription:
                "Reciba alertas importantes de proyectos generadas por la IA de AIPMS.",
            systemNotifications: "Notificaciones del sistema",
            systemNotificationsDescription:
                "Reciba notificaciones importantes del sistema.",
            emailChannel: "Canal de correo electrónico",
            emailChannelDescription:
                "Permitir la entrega de notificaciones mediante correo electrónico.",
            inAppChannel: "Canal dentro de la aplicación",
            inAppChannelDescription:
                "Mostrar las notificaciones dentro de la aplicación AIPMS.",
            notificationsSaved:
                "La configuración de notificaciones se ha guardado correctamente.",
            dashboardTitle: "Preferencias del panel",
            dashboardDescription:
                "Seleccione la información que desea mostrar en su panel de administrador.",
            projectProgress: "Progreso del proyecto",
            projectProgressDescription:
                "Mostrar información sobre el progreso del proyecto.",
            sprintProgress: "Progreso del sprint",
            sprintProgressDescription:
                "Mostrar información sobre el progreso del sprint.",
            projectTimeline: "Cronograma del proyecto",
            projectTimelineDescription:
                "Mostrar información sobre el cronograma del proyecto.",
            risksIssues: "Riesgos y problemas",
            risksIssuesDescription:
                "Mostrar los riesgos y problemas de proyecto identificados.",
            teamProgress: "Progreso del equipo",
            teamProgressDescription:
                "Mostrar información sobre el progreso del equipo.",
            deadlineInformation: "Información sobre plazos",
            deadlineInformationDescription:
                "Mostrar los próximos plazos de los proyectos.",
            aiRecommendations: "Recomendaciones de IA",
            aiRecommendationsDescription:
                "Mostrar recomendaciones generadas por IA en el panel.",
            aiRiskPrediction: "Predicción de riesgos mediante IA",
            aiRiskPredictionDescription:
                "Mostrar predicciones de riesgos de proyectos impulsadas por IA.",
            recentActivity: "Actividad reciente",
            recentActivityDescription:
                "Mostrar la actividad reciente de los proyectos.",
            notificationsDashboard: "Notificaciones",
            notificationsDashboardDescription:
                "Mostrar notificaciones en el panel.",
            dashboardSaved:
                "Las preferencias del panel se han guardado correctamente.",
            aiTitle: "Preferencias de IA",
            aiDescription:
                "Configure cómo se presentan las recomendaciones, alertas y análisis de IA de AIPMS.",
            aiNotifications: "Notificaciones de IA",
            aiNotificationsDescription:
                "Permitir notificaciones generadas por la IA de AIPMS.",
            delayWarnings: "Advertencias de retraso",
            delayWarningsDescription:
                "Reciba advertencias generadas por IA sobre posibles retrasos de proyectos.",
            aiInsightVisibility: "Visibilidad de análisis de IA",
            aiInsightVisibilityDescription:
                "Mostrar análisis generados por IA en toda la aplicación.",
            summaryFrequency: "Frecuencia de resúmenes",
            summaryFrequencyDescription:
                "Seleccione la frecuencia con la que deben generarse los resúmenes de IA.",
            recommendationDisplay: "Visualización de recomendaciones",
            recommendationDisplayDescription:
                "Seleccione el nivel de detalle de las recomendaciones de IA.",
            notificationPriority: "Prioridad de notificaciones",
            notificationPriorityDescription:
                "Seleccione el nivel de prioridad de las notificaciones de IA que desea mostrar.",
            realtime: "Tiempo real",
            daily: "Diario",
            weekly: "Semanal",
            never: "Nunca",
            compact: "Compacto",
            detailed: "Detallado",
            all: "Todas",
            important: "Importante",
            critical: "Crítica",
            aiSaved:
                "Las preferencias de IA se han guardado correctamente.",
        },
    },

    // ========================================================
    // CHINESE
    // ========================================================

    zh: {
        common: {
            save: "保存",
            saveChanges: "保存更改",
            cancel: "取消",
            close: "关闭",
            loading: "正在加载...",
            saving: "正在保存...",
            restoreDefaults: "恢复默认设置",
            yes: "是",
            no: "否",
            enabled: "已启用",
            disabled: "已禁用",
            search: "搜索",
            view: "查看",
            edit: "编辑",
            delete: "删除",
            create: "创建",
            update: "更新",
            back: "返回",
            next: "下一步",
            previous: "上一步",
            submit: "提交",
            confirm: "确认",
        },

        navigation: {
            dashboard: "仪表板",
            projects: "项目",
            sprints: "冲刺",
            team: "团队",
            aiFeatures: "AI 功能",
            reports: "报告",
            profile: "个人资料管理",
            settings: "设置",
            help: "帮助",
            logout: "退出登录",
        },

        application: {
            name: "AIPMS",
            fullName: "人工智能项目管理系统",
        },

        manager: {
            title: "项目经理",
            signedInAs: "当前登录身份",
            account: "项目经理账户",
        },

        dashboard: {
            title: "项目经理仪表板",
            description: "监控项目、团队绩效以及整体项目进展。",
            totalProjects: "项目总数",
            activeProjects: "进行中的项目",
            completedProjects: "已完成项目",
            totalTasks: "任务总数",
            completedTasks: "已完成任务",
            teamMembers: "团队成员",
            activeSprints: "进行中的冲刺",
            projectProgress: "项目进度",
            sprintProgress: "冲刺进度",
            recentActivity: "最近活动",
            upcomingDeadlines: "即将到期的任务",
            risksAndIssues: "风险与问题",
            aiRecommendations: "AI 建议",
            noRecentActivity: "暂无最近活动。",
        },

        settings: {
            title: "项目经理设置",
            description: "管理您的个人应用偏好和配置。",
            signedInAs: "当前登录身份",
            restoreDefaults: "恢复默认设置",
            preferencesSaved: "您的语言和主题偏好已成功保存。",
            languageTheme: "语言与主题",
            notifications: "通知",
            dashboard: "仪表板",
            aiPreferences: "AI 偏好设置",
            languagePreference: "语言偏好",
            languageDescription: "选择应用程序中使用的语言。",
            applicationLanguage: "应用程序语言",
            languageSavedDescription:
                "您选择的语言将保存至您的账户，并在不同会话和设备之间同步。",
            saveLanguageTheme: "保存语言与主题",
            themePreference: "主题偏好",
            themeDescription: "选择您希望 AIPMS 使用的外观。",
            light: "浅色",
            lightDescription: "在整个应用程序中使用浅色外观。",
            dark: "深色",
            darkDescription: "在整个应用程序中使用深色外观。",
            system: "系统",
            systemDescription: "跟随操作系统的外观设置。",
            saveTheme: "保存主题",
            storageDescription:
                "您的语言和主题偏好将与 AIPMS 账户同步，不会作为浏览器偏好存储使用。",
            preferenceStorage: "偏好存储",
            preferenceStorageDescription:
                "项目经理偏好存储在 AIPMS 账户数据库中，并通过后端 API 进行同步。",
            loading: "正在加载项目经理设置...",
            unableLoad: "无法加载项目经理设置，请重试。",
            errorManagerAccess: "需要项目经理权限才能查看这些设置。",
            saving: "正在保存...",
            saveError: "无法保存语言和主题偏好。",
            restoreSuccess: "项目经理设置已恢复为默认值。",
            restoreError: "无法恢复项目经理默认设置。",
            notificationsTitle: "通知偏好",
            notificationsDescription: "配置您希望接收的通知。",
            emailNotifications: "电子邮件通知",
            emailNotificationsDescription:
                "通过电子邮件接收重要的 AIPMS 通知。",
            sprintUpdates: "冲刺更新",
            sprintUpdatesDescription:
                "接收有关冲刺变更和进度的通知。",
            taskUpdates: "任务更新",
            taskUpdatesDescription:
                "当分配给您的任务发生更新时接收通知。",
            aiAlerts: "AI 警报",
            aiAlertsDescription:
                "接收由 AIPMS AI 生成的重要项目警报。",
            systemNotifications: "系统通知",
            systemNotificationsDescription:
                "接收重要的系统通知。",
            emailChannel: "电子邮件渠道",
            emailChannelDescription:
                "允许通过电子邮件发送通知。",
            inAppChannel: "应用内渠道",
            inAppChannelDescription:
                "在 AIPMS 应用程序中显示通知。",
            notificationsSaved: "通知设置已成功保存。",
            dashboardTitle: "仪表板偏好",
            dashboardDescription:
                "选择希望显示在项目经理仪表板上的信息。",
            projectProgress: "项目进度",
            projectProgressDescription: "显示项目进度信息。",
            sprintProgress: "冲刺进度",
            sprintProgressDescription: "显示冲刺进度信息。",
            projectTimeline: "项目时间线",
            projectTimelineDescription: "显示项目时间线信息。",
            risksIssues: "风险与问题",
            risksIssuesDescription: "显示已识别的项目风险和问题。",
            teamProgress: "团队进度",
            teamProgressDescription: "显示团队进度信息。",
            deadlineInformation: "截止日期信息",
            deadlineInformationDescription: "显示即将到来的项目截止日期。",
            aiRecommendations: "AI 建议",
            aiRecommendationsDescription:
                "在仪表板上显示 AI 生成的建议。",
            aiRiskPrediction: "AI 风险预测",
            aiRiskPredictionDescription:
                "显示 AI 驱动的项目风险预测。",
            recentActivity: "最近活动",
            recentActivityDescription: "显示最近的项目活动。",
            notificationsDashboard: "通知",
            notificationsDashboardDescription:
                "在仪表板上显示通知。",
            dashboardSaved: "仪表板偏好已成功保存。",
            aiTitle: "AI 偏好设置",
            aiDescription:
                "配置 AIPMS AI 建议、警报和洞察信息的呈现方式。",
            aiNotifications: "AI 通知",
            aiNotificationsDescription:
                "允许接收由 AIPMS AI 生成的通知。",
            delayWarnings: "延迟警告",
            delayWarningsDescription:
                "接收有关潜在项目延迟的 AI 生成警告。",
            aiInsightVisibility: "AI 洞察可见性",
            aiInsightVisibilityDescription:
                "在整个应用程序中显示 AI 生成的洞察。",
            summaryFrequency: "摘要频率",
            summaryFrequencyDescription:
                "选择 AI 摘要的生成频率。",
            recommendationDisplay: "建议显示方式",
            recommendationDisplayDescription:
                "选择 AI 建议所显示的详细程度。",
            notificationPriority: "通知优先级",
            notificationPriorityDescription:
                "选择要显示的 AI 通知优先级。",
            realtime: "实时",
            daily: "每日",
            weekly: "每周",
            never: "从不",
            compact: "简洁",
            detailed: "详细",
            all: "全部",
            important: "重要",
            critical: "严重",
            aiSaved: "AI 偏好设置已成功保存。",
        },
    },

    // ========================================================
    // ARABIC
    // ========================================================

    ar: {
        common: {
            save: "حفظ",
            saveChanges: "حفظ التغييرات",
            cancel: "إلغاء",
            close: "إغلاق",
            loading: "جارٍ التحميل...",
            saving: "جارٍ الحفظ...",
            restoreDefaults: "استعادة الإعدادات الافتراضية",
            yes: "نعم",
            no: "لا",
            enabled: "مفعّل",
            disabled: "معطّل",
            search: "بحث",
            view: "عرض",
            edit: "تعديل",
            delete: "حذف",
            create: "إنشاء",
            update: "تحديث",
            back: "رجوع",
            next: "التالي",
            previous: "السابق",
            submit: "إرسال",
            confirm: "تأكيد",
        },

        navigation: {
            dashboard: "لوحة المعلومات",
            projects: "المشروعات",
            sprints: "السبرنت",
            team: "الفريق",
            aiFeatures: "ميزات الذكاء الاصطناعي",
            reports: "التقارير",
            profile: "إدارة الملف الشخصي",
            settings: "الإعدادات",
            help: "المساعدة",
            logout: "تسجيل الخروج",
        },

        application: {
            name: "AIPMS",
            fullName: "نظام إدارة المشروعات المدعوم بالذكاء الاصطناعي",
        },

        manager: {
            title: "مدير المشروع",
            signedInAs: "تم تسجيل الدخول باسم",
            account: "حساب مدير المشروع",
        },

        dashboard: {
            title: "لوحة معلومات مدير المشروع",
            description:
                "راقب المشروعات وأداء الفريق والتقدم العام للمشروعات.",
            totalProjects: "إجمالي المشروعات",
            activeProjects: "المشروعات النشطة",
            completedProjects: "المشروعات المكتملة",
            totalTasks: "إجمالي المهام",
            completedTasks: "المهام المكتملة",
            teamMembers: "أعضاء الفريق",
            activeSprints: "السبرنتات النشطة",
            projectProgress: "تقدم المشروع",
            sprintProgress: "تقدم السبرنت",
            recentActivity: "النشاط الأخير",
            upcomingDeadlines: "المواعيد النهائية القادمة",
            risksAndIssues: "المخاطر والمشكلات",
            aiRecommendations: "توصيات الذكاء الاصطناعي",
            noRecentActivity: "لا يوجد نشاط حديث متاح.",
        },

        settings: {
            title: "إعدادات مدير المشروع",
            description:
                "إدارة تفضيلاتك الشخصية وإعدادات التطبيق.",
            signedInAs: "تم تسجيل الدخول باسم",
            restoreDefaults: "استعادة الإعدادات الافتراضية",
            preferencesSaved:
                "تم حفظ تفضيلات اللغة والمظهر بنجاح.",
            languageTheme: "اللغة والمظهر",
            notifications: "الإشعارات",
            dashboard: "لوحة المعلومات",
            aiPreferences: "تفضيلات الذكاء الاصطناعي",
            languagePreference: "تفضيل اللغة",
            languageDescription:
                "حدد اللغة التي سيتم استخدامها في جميع أنحاء التطبيق.",
            applicationLanguage: "لغة التطبيق",
            languageSavedDescription:
                "يتم حفظ اللغة التي اخترتها مع حسابك ومزامنتها عبر الجلسات والأجهزة.",
            saveLanguageTheme: "حفظ اللغة والمظهر",
            themePreference: "تفضيل المظهر",
            themeDescription:
                "حدد المظهر الذي ترغب في استخدامه في AIPMS.",
            light: "فاتح",
            lightDescription:
                "استخدام مظهر فاتح في جميع أنحاء التطبيق.",
            dark: "داكن",
            darkDescription:
                "استخدام مظهر داكن في جميع أنحاء التطبيق.",
            system: "النظام",
            systemDescription:
                "اتباع إعداد المظهر الخاص بنظام التشغيل.",
            saveTheme: "حفظ المظهر",
            storageDescription:
                "تتم مزامنة تفضيلات اللغة والمظهر مع حساب AIPMS الخاص بك ولا تُستخدم كتخزين لتفضيلات المتصفح.",
            preferenceStorage: "تخزين التفضيلات",
            preferenceStorageDescription:
                "يتم تخزين تفضيلات مدير المشروع في قاعدة بيانات حساب AIPMS ومزامنتها من خلال واجهة برمجة التطبيقات الخلفية.",
            loading: "جارٍ تحميل إعدادات مدير المشروع...",
            unableLoad:
                "تعذر تحميل إعدادات مدير المشروع. يرجى المحاولة مرة أخرى.",
            errorManagerAccess:
                "يلزم توفر صلاحية مدير المشروع لعرض هذه الإعدادات.",
            saving: "جارٍ الحفظ...",
            saveError:
                "تعذر حفظ تفضيلات اللغة والمظهر.",
            restoreSuccess:
                "تمت استعادة إعدادات مدير المشروع إلى القيم الافتراضية.",
            restoreError:
                "تعذر استعادة إعدادات مدير المشروع الافتراضية.",
            notificationsTitle: "تفضيلات الإشعارات",
            notificationsDescription:
                "حدد الإشعارات التي ترغب في استلامها.",
            emailNotifications: "إشعارات البريد الإلكتروني",
            emailNotificationsDescription:
                "استلام إشعارات AIPMS المهمة عبر البريد الإلكتروني.",
            sprintUpdates: "تحديثات السبرنت",
            sprintUpdatesDescription:
                "استلام إشعارات بشأن تغييرات السبرنت وتقدمه.",
            taskUpdates: "تحديثات المهام",
            taskUpdatesDescription:
                "استلام إشعارات عند تحديث المهام المسندة إليك.",
            aiAlerts: "تنبيهات الذكاء الاصطناعي",
            aiAlertsDescription:
                "استلام تنبيهات المشروعات المهمة التي ينشئها الذكاء الاصطناعي في AIPMS.",
            systemNotifications: "إشعارات النظام",
            systemNotificationsDescription:
                "استلام إشعارات النظام المهمة.",
            emailChannel: "قناة البريد الإلكتروني",
            emailChannelDescription:
                "السماح بإرسال الإشعارات عبر البريد الإلكتروني.",
            inAppChannel: "قناة داخل التطبيق",
            inAppChannelDescription:
                "عرض الإشعارات داخل تطبيق AIPMS.",
            notificationsSaved:
                "تم حفظ إعدادات الإشعارات بنجاح.",
            dashboardTitle: "تفضيلات لوحة المعلومات",
            dashboardDescription:
                "حدد المعلومات التي ترغب في عرضها على لوحة معلومات مدير المشروع.",
            projectProgress: "تقدم المشروع",
            projectProgressDescription:
                "عرض معلومات تقدم المشروع.",
            sprintProgress: "تقدم السبرنت",
            sprintProgressDescription:
                "عرض معلومات تقدم السبرنت.",
            projectTimeline: "الجدول الزمني للمشروع",
            projectTimelineDescription:
                "عرض معلومات الجدول الزمني للمشروع.",
            risksIssues: "المخاطر والمشكلات",
            risksIssuesDescription:
                "عرض مخاطر ومشكلات المشروع المحددة.",
            teamProgress: "تقدم الفريق",
            teamProgressDescription:
                "عرض معلومات تقدم الفريق.",
            deadlineInformation: "معلومات المواعيد النهائية",
            deadlineInformationDescription:
                "عرض المواعيد النهائية القادمة للمشروعات.",
            aiRecommendations: "توصيات الذكاء الاصطناعي",
            aiRecommendationsDescription:
                "عرض التوصيات التي ينشئها الذكاء الاصطناعي على لوحة المعلومات.",
            aiRiskPrediction: "التنبؤ بالمخاطر باستخدام الذكاء الاصطناعي",
            aiRiskPredictionDescription:
                "عرض تنبؤات مخاطر المشروعات المدعومة بالذكاء الاصطناعي.",
            recentActivity: "النشاط الأخير",
            recentActivityDescription:
                "عرض نشاط المشروعات الأخير.",
            notificationsDashboard: "الإشعارات",
            notificationsDashboardDescription:
                "عرض الإشعارات على لوحة المعلومات.",
            dashboardSaved:
                "تم حفظ تفضيلات لوحة المعلومات بنجاح.",
            aiTitle: "تفضيلات الذكاء الاصطناعي",
            aiDescription:
                "قم بتكوين طريقة عرض توصيات وتنبيهات ورؤى الذكاء الاصطناعي في AIPMS.",
            aiNotifications: "إشعارات الذكاء الاصطناعي",
            aiNotificationsDescription:
                "السماح بالإشعارات التي ينشئها الذكاء الاصطناعي في AIPMS.",
            delayWarnings: "تحذيرات التأخير",
            delayWarningsDescription:
                "استلام تحذيرات ينشئها الذكاء الاصطناعي بشأن التأخيرات المحتملة في المشروعات.",
            aiInsightVisibility: "ظهور رؤى الذكاء الاصطناعي",
            aiInsightVisibilityDescription:
                "عرض الرؤى التي ينشئها الذكاء الاصطناعي في جميع أنحاء التطبيق.",
            summaryFrequency: "تكرار الملخصات",
            summaryFrequencyDescription:
                "حدد معدل إنشاء ملخصات الذكاء الاصطناعي.",
            recommendationDisplay: "عرض التوصيات",
            recommendationDisplayDescription:
                "حدد مستوى التفاصيل المعروض في توصيات الذكاء الاصطناعي.",
            notificationPriority: "أولوية الإشعارات",
            notificationPriorityDescription:
                "حدد مستوى أولوية إشعارات الذكاء الاصطناعي التي سيتم عرضها.",
            realtime: "في الوقت الفعلي",
            daily: "يوميًا",
            weekly: "أسبوعيًا",
            never: "مطلقًا",
            compact: "موجز",
            detailed: "مفصل",
            all: "الكل",
            important: "مهم",
            critical: "حرج",
            aiSaved:
                "تم حفظ تفضيلات الذكاء الاصطناعي بنجاح.",
        },
    },

    // ========================================================
    // PORTUGUESE
    // ========================================================

    pt: {
        common: {
            save: "Guardar",
            saveChanges: "Guardar alterações",
            cancel: "Cancelar",
            close: "Fechar",
            loading: "A carregar...",
            saving: "A guardar...",
            restoreDefaults: "Restaurar definições predefinidas",
            yes: "Sim",
            no: "Não",
            enabled: "Ativado",
            disabled: "Desativado",
            search: "Pesquisar",
            view: "Ver",
            edit: "Editar",
            delete: "Eliminar",
            create: "Criar",
            update: "Atualizar",
            back: "Voltar",
            next: "Seguinte",
            previous: "Anterior",
            submit: "Submeter",
            confirm: "Confirmar",
        },

        navigation: {
            dashboard: "Painel",
            projects: "Projetos",
            sprints: "Sprint",
            team: "Equipa",
            aiFeatures: "Funcionalidades de IA",
            reports: "Relatórios",
            profile: "Gestão do perfil",
            settings: "Definições",
            help: "Ajuda",
            logout: "Terminar sessão",
        },

        application: {
            name: "AIPMS",
            fullName: "Sistema de Gestão de Projetos com Inteligência Artificial",
        },

        manager: {
            title: "Gestor de Projeto",
            signedInAs: "Sessão iniciada como",
            account: "Conta do gestor de projeto",
        },

        dashboard: {
            title: "Painel do Gestor de Projeto",
            description:
                "Monitorize projetos, desempenho da equipa e progresso geral dos projetos.",
            totalProjects: "Total de projetos",
            activeProjects: "Projetos ativos",
            completedProjects: "Projetos concluídos",
            totalTasks: "Total de tarefas",
            completedTasks: "Tarefas concluídas",
            teamMembers: "Membros da equipa",
            activeSprints: "Sprints ativos",
            projectProgress: "Progresso do projeto",
            sprintProgress: "Progresso do sprint",
            recentActivity: "Atividade recente",
            upcomingDeadlines: "Próximos prazos",
            risksAndIssues: "Riscos e problemas",
            aiRecommendations: "Recomendações de IA",
            noRecentActivity: "Não existem atividades recentes disponíveis.",
        },

        settings: {
            title: "Definições do Gestor de Projeto",
            description:
                "Gira as suas preferências pessoais e a configuração da aplicação.",
            signedInAs: "Sessão iniciada como",
            restoreDefaults: "Restaurar definições predefinidas",
            preferencesSaved:
                "As suas preferências de idioma e tema foram guardadas com sucesso.",
            languageTheme: "Idioma e tema",
            notifications: "Notificações",
            dashboard: "Painel",
            aiPreferences: "Preferências de IA",
            languagePreference: "Preferência de idioma",
            languageDescription:
                "Selecione o idioma a utilizar em toda a aplicação.",
            applicationLanguage: "Idioma da aplicação",
            languageSavedDescription:
                "O idioma selecionado é guardado na sua conta e sincronizado entre sessões e dispositivos.",
            saveLanguageTheme: "Guardar idioma e tema",
            themePreference: "Preferência de tema",
            themeDescription:
                "Selecione o aspeto que pretende utilizar no AIPMS.",
            light: "Claro",
            lightDescription:
                "Utilizar um aspeto claro em toda a aplicação.",
            dark: "Escuro",
            darkDescription:
                "Utilizar um aspeto escuro em toda a aplicação.",
            system: "Sistema",
            systemDescription:
                "Seguir a preferência de aspeto do sistema operativo.",
            saveTheme: "Guardar tema",
            storageDescription:
                "As suas preferências de idioma e tema são sincronizadas com a sua conta AIPMS e não são utilizadas como armazenamento de preferências do navegador.",
            preferenceStorage: "Armazenamento de preferências",
            preferenceStorageDescription:
                "As preferências do gestor são armazenadas na base de dados da conta AIPMS e sincronizadas através da API de backend.",
            loading: "A carregar as definições do gestor...",
            unableLoad:
                "Não foi possível carregar as definições do gestor. Tente novamente.",
            errorManagerAccess:
                "É necessário acesso de gestor para consultar estas definições.",
            saving: "A guardar...",
            saveError:
                "Não foi possível guardar as preferências de idioma e tema.",
            restoreSuccess:
                "As definições do gestor foram restauradas para os valores predefinidos.",
            restoreError:
                "Não foi possível restaurar as definições predefinidas do gestor.",
            notificationsTitle: "Preferências de notificações",
            notificationsDescription:
                "Configure as notificações que pretende receber.",
            emailNotifications: "Notificações por e-mail",
            emailNotificationsDescription:
                "Receba notificações importantes do AIPMS por e-mail.",
            sprintUpdates: "Atualizações de sprints",
            sprintUpdatesDescription:
                "Receba notificações sobre alterações e progresso dos sprints.",
            taskUpdates: "Atualizações de tarefas",
            taskUpdatesDescription:
                "Receba notificações quando as tarefas atribuídas forem atualizadas.",
            aiAlerts: "Alertas de IA",
            aiAlertsDescription:
                "Receba alertas importantes de projetos gerados pela IA do AIPMS.",
            systemNotifications: "Notificações do sistema",
            systemNotificationsDescription:
                "Receba notificações importantes do sistema.",
            emailChannel: "Canal de e-mail",
            emailChannelDescription:
                "Permitir o envio de notificações por e-mail.",
            inAppChannel: "Canal na aplicação",
            inAppChannelDescription:
                "Apresentar notificações dentro da aplicação AIPMS.",
            notificationsSaved:
                "As definições de notificações foram guardadas com sucesso.",
            dashboardTitle: "Preferências do painel",
            dashboardDescription:
                "Selecione as informações que pretende apresentar no painel do gestor.",
            projectProgress: "Progresso do projeto",
            projectProgressDescription:
                "Apresentar informações sobre o progresso do projeto.",
            sprintProgress: "Progresso do sprint",
            sprintProgressDescription:
                "Apresentar informações sobre o progresso do sprint.",
            projectTimeline: "Cronograma do projeto",
            projectTimelineDescription:
                "Apresentar informações sobre o cronograma do projeto.",
            risksIssues: "Riscos e problemas",
            risksIssuesDescription:
                "Apresentar riscos e problemas de projeto identificados.",
            teamProgress: "Progresso da equipa",
            teamProgressDescription:
                "Apresentar informações sobre o progresso da equipa.",
            deadlineInformation: "Informações sobre prazos",
            deadlineInformationDescription:
                "Apresentar os próximos prazos dos projetos.",
            aiRecommendations: "Recomendações de IA",
            aiRecommendationsDescription:
                "Apresentar recomendações geradas por IA no painel.",
            aiRiskPrediction: "Previsão de riscos por IA",
            aiRiskPredictionDescription:
                "Apresentar previsões de riscos de projetos suportadas por IA.",
            recentActivity: "Atividade recente",
            recentActivityDescription:
                "Apresentar a atividade recente dos projetos.",
            notificationsDashboard: "Notificações",
            notificationsDashboardDescription:
                "Apresentar notificações no painel.",
            dashboardSaved:
                "As preferências do painel foram guardadas com sucesso.",
            aiTitle: "Preferências de IA",
            aiDescription:
                "Configure a forma como as recomendações, alertas e informações da IA do AIPMS são apresentadas.",
            aiNotifications: "Notificações de IA",
            aiNotificationsDescription:
                "Permitir notificações geradas pela IA do AIPMS.",
            delayWarnings: "Avisos de atraso",
            delayWarningsDescription:
                "Receba avisos gerados por IA sobre possíveis atrasos dos projetos.",
            aiInsightVisibility: "Visibilidade das informações de IA",
            aiInsightVisibilityDescription:
                "Apresentar informações geradas por IA em toda a aplicação.",
            summaryFrequency: "Frequência dos resumos",
            summaryFrequencyDescription:
                "Selecione a frequência com que os resumos de IA devem ser gerados.",
            recommendationDisplay: "Apresentação das recomendações",
            recommendationDisplayDescription:
                "Selecione o nível de detalhe apresentado nas recomendações de IA.",
            notificationPriority: "Prioridade das notificações",
            notificationPriorityDescription:
                "Selecione o nível de prioridade das notificações de IA a apresentar.",
            realtime: "Em tempo real",
            daily: "Diariamente",
            weekly: "Semanalmente",
            never: "Nunca",
            compact: "Compacto",
            detailed: "Detalhado",
            all: "Todas",
            important: "Importante",
            critical: "Crítica",
            aiSaved:
                "As preferências de IA foram guardadas com sucesso.",
        },
    },

    // ========================================================
    // GERMAN
    // ========================================================

    de: {
        common: {
            save: "Speichern",
            saveChanges: "Änderungen speichern",
            cancel: "Abbrechen",
            close: "Schließen",
            loading: "Wird geladen...",
            saving: "Wird gespeichert...",
            restoreDefaults: "Standardeinstellungen wiederherstellen",
            yes: "Ja",
            no: "Nein",
            enabled: "Aktiviert",
            disabled: "Deaktiviert",
            search: "Suchen",
            view: "Anzeigen",
            edit: "Bearbeiten",
            delete: "Löschen",
            create: "Erstellen",
            update: "Aktualisieren",
            back: "Zurück",
            next: "Weiter",
            previous: "Zurück",
            submit: "Absenden",
            confirm: "Bestätigen",
        },

        navigation: {
            dashboard: "Dashboard",
            projects: "Projekte",
            sprints: "Sprint",
            team: "Team",
            aiFeatures: "KI-Funktionen",
            reports: "Berichte",
            profile: "Profilverwaltung",
            settings: "Einstellungen",
            help: "Hilfe",
            logout: "Abmelden",
        },

        application: {
            name: "AIPMS",
            fullName: "KI-gestütztes Projektmanagementsystem",
        },

        manager: {
            title: "Projektmanager",
            signedInAs: "Angemeldet als",
            account: "Projektmanager-Konto",
        },

        dashboard: {
            title: "Dashboard des Projektmanagers",
            description:
                "Überwachen Sie Projekte, Teamleistung und den gesamten Projektfortschritt.",
            totalProjects: "Projekte insgesamt",
            activeProjects: "Aktive Projekte",
            completedProjects: "Abgeschlossene Projekte",
            totalTasks: "Aufgaben insgesamt",
            completedTasks: "Abgeschlossene Aufgaben",
            teamMembers: "Teammitglieder",
            activeSprints: "Aktive Sprints",
            projectProgress: "Projektfortschritt",
            sprintProgress: "Sprint-Fortschritt",
            recentActivity: "Letzte Aktivitäten",
            upcomingDeadlines: "Bevorstehende Fristen",
            risksAndIssues: "Risiken und Probleme",
            aiRecommendations: "KI-Empfehlungen",
            noRecentActivity: "Keine aktuellen Aktivitäten verfügbar.",
        },

        settings: {
            title: "Einstellungen des Projektmanagers",
            description:
                "Verwalten Sie Ihre persönlichen Anwendungseinstellungen und Präferenzen.",
            signedInAs: "Angemeldet als",
            restoreDefaults: "Standardeinstellungen wiederherstellen",
            preferencesSaved:
                "Ihre Sprach- und Theme-Einstellungen wurden erfolgreich gespeichert.",
            languageTheme: "Sprache und Theme",
            notifications: "Benachrichtigungen",
            dashboard: "Dashboard",
            aiPreferences: "KI-Einstellungen",
            languagePreference: "Spracheinstellung",
            languageDescription:
                "Wählen Sie die Sprache aus, die in der gesamten Anwendung verwendet werden soll.",
            applicationLanguage: "Anwendungssprache",
            languageSavedDescription:
                "Die ausgewählte Sprache wird mit Ihrem Konto gespeichert und zwischen Sitzungen und Geräten synchronisiert.",
            saveLanguageTheme: "Sprache und Theme speichern",
            themePreference: "Theme-Einstellung",
            themeDescription:
                "Wählen Sie das Erscheinungsbild aus, das AIPMS verwenden soll.",
            light: "Hell",
            lightDescription:
                "Verwenden Sie ein helles Erscheinungsbild in der gesamten Anwendung.",
            dark: "Dunkel",
            darkDescription:
                "Verwenden Sie ein dunkles Erscheinungsbild in der gesamten Anwendung.",
            system: "System",
            systemDescription:
                "Übernimmt die Erscheinungseinstellung Ihres Betriebssystems.",
            saveTheme: "Theme speichern",
            storageDescription:
                "Ihre Sprach- und Theme-Einstellungen werden mit Ihrem AIPMS-Konto synchronisiert und nicht als Browsereinstellungen gespeichert.",
            preferenceStorage: "Speicherung der Einstellungen",
            preferenceStorageDescription:
                "Die Einstellungen des Projektmanagers werden in der AIPMS-Kontodatenbank gespeichert und über die Backend-API synchronisiert.",
            loading: "Einstellungen des Projektmanagers werden geladen...",
            unableLoad:
                "Die Einstellungen des Projektmanagers konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
            errorManagerAccess:
                "Für den Zugriff auf diese Einstellungen sind Manager-Berechtigungen erforderlich.",
            saving: "Wird gespeichert...",
            saveError:
                "Die Sprach- und Theme-Einstellungen konnten nicht gespeichert werden.",
            restoreSuccess:
                "Die Einstellungen des Projektmanagers wurden auf die Standardwerte zurückgesetzt.",
            restoreError:
                "Die Standardeinstellungen des Projektmanagers konnten nicht wiederhergestellt werden.",
            notificationsTitle: "Benachrichtigungseinstellungen",
            notificationsDescription:
                "Konfigurieren Sie, welche Benachrichtigungen Sie erhalten möchten.",
            emailNotifications: "E-Mail-Benachrichtigungen",
            emailNotificationsDescription:
                "Erhalten Sie wichtige AIPMS-Benachrichtigungen per E-Mail.",
            sprintUpdates: "Sprint-Aktualisierungen",
            sprintUpdatesDescription:
                "Erhalten Sie Benachrichtigungen über Änderungen und Fortschritte von Sprints.",
            taskUpdates: "Aufgaben-Aktualisierungen",
            taskUpdatesDescription:
                "Erhalten Sie Benachrichtigungen, wenn Ihnen zugewiesene Aufgaben aktualisiert werden.",
            aiAlerts: "KI-Warnungen",
            aiAlertsDescription:
                "Erhalten Sie wichtige, von der AIPMS-KI erzeugte Projektwarnungen.",
            systemNotifications: "Systembenachrichtigungen",
            systemNotificationsDescription:
                "Erhalten Sie wichtige Systembenachrichtigungen.",
            emailChannel: "E-Mail-Kanal",
            emailChannelDescription:
                "Ermöglichen Sie die Zustellung von Benachrichtigungen per E-Mail.",
            inAppChannel: "In-App-Kanal",
            inAppChannelDescription:
                "Zeigen Sie Benachrichtigungen innerhalb der AIPMS-Anwendung an.",
            notificationsSaved:
                "Die Benachrichtigungseinstellungen wurden erfolgreich gespeichert.",
            dashboardTitle: "Dashboard-Einstellungen",
            dashboardDescription:
                "Wählen Sie die Informationen aus, die auf Ihrem Manager-Dashboard angezeigt werden sollen.",
            projectProgress: "Projektfortschritt",
            projectProgressDescription:
                "Projektfortschrittsinformationen anzeigen.",
            sprintProgress: "Sprint-Fortschritt",
            sprintProgressDescription:
                "Informationen zum Sprint-Fortschritt anzeigen.",
            projectTimeline: "Projektzeitplan",
            projectTimelineDescription:
                "Informationen zum Projektzeitplan anzeigen.",
            risksIssues: "Risiken und Probleme",
            risksIssuesDescription:
                "Identifizierte Projektrisiken und Probleme anzeigen.",
            teamProgress: "Teamfortschritt",
            teamProgressDescription:
                "Informationen zum Teamfortschritt anzeigen.",
            deadlineInformation: "Fristinformationen",
            deadlineInformationDescription:
                "Bevorstehende Projektfristen anzeigen.",
            aiRecommendations: "KI-Empfehlungen",
            aiRecommendationsDescription:
                "KI-generierte Empfehlungen auf dem Dashboard anzeigen.",
            aiRiskPrediction: "KI-Risikoprognose",
            aiRiskPredictionDescription:
                "KI-gestützte Prognosen zu Projektrisiken anzeigen.",
            recentActivity: "Letzte Aktivitäten",
            recentActivityDescription:
                "Aktuelle Projektaktivitäten anzeigen.",
            notificationsDashboard: "Benachrichtigungen",
            notificationsDashboardDescription:
                "Benachrichtigungen auf dem Dashboard anzeigen.",
            dashboardSaved:
                "Die Dashboard-Einstellungen wurden erfolgreich gespeichert.",
            aiTitle: "KI-Einstellungen",
            aiDescription:
                "Konfigurieren Sie, wie KI-Empfehlungen, Warnungen und Erkenntnisse von AIPMS dargestellt werden.",
            aiNotifications: "KI-Benachrichtigungen",
            aiNotificationsDescription:
                "Von der AIPMS-KI erzeugte Benachrichtigungen zulassen.",
            delayWarnings: "Warnungen bei Verzögerungen",
            delayWarningsDescription:
                "Erhalten Sie KI-generierte Warnungen zu möglichen Projektverzögerungen.",
            aiInsightVisibility: "Sichtbarkeit von KI-Erkenntnissen",
            aiInsightVisibilityDescription:
                "KI-generierte Erkenntnisse in der gesamten Anwendung anzeigen.",
            summaryFrequency: "Häufigkeit der Zusammenfassungen",
            summaryFrequencyDescription:
                "Wählen Sie aus, wie häufig KI-Zusammenfassungen erstellt werden sollen.",
            recommendationDisplay: "Darstellung von Empfehlungen",
            recommendationDisplayDescription:
                "Wählen Sie den Detaillierungsgrad der KI-Empfehlungen.",
            notificationPriority: "Benachrichtigungspriorität",
            notificationPriorityDescription:
                "Wählen Sie die Prioritätsstufe der anzuzeigenden KI-Benachrichtigungen.",
            realtime: "Echtzeit",
            daily: "Täglich",
            weekly: "Wöchentlich",
            never: "Nie",
            compact: "Kompakt",
            detailed: "Detailliert",
            all: "Alle",
            important: "Wichtig",
            critical: "Kritisch",
            aiSaved:
                "Die KI-Einstellungen wurden erfolgreich gespeichert.",
        },
    },
};

// ============================================================
// LANGUAGE CONTEXT
// ============================================================

const LanguageContext = createContext(null);

// ============================================================
// NORMALIZE LANGUAGE
// ============================================================

function normalizeLanguage(value) {
    const language = String(value || "")
        .trim()
        .toLowerCase();

    const supported = SUPPORTED_LANGUAGES.some(
        (item) => item.code === language
    );

    return supported ? language : "en";
}

// ============================================================
// NESTED TRANSLATION RESOLVER
//
// Supports:
// t("settings.title")
// t("navigation.dashboard")
// t("dashboard.totalProjects")
// ============================================================

function getTranslationValue(object, path) {
    if (!object || !path) {
        return undefined;
    }

    return path
        .split(".")
        .reduce((current, key) => current?.[key], object);
}

// ============================================================
// PROVIDER
// ============================================================

export function LanguageProvider({ children }) {
    const auth = useContext(AuthContext);

    const user = auth?.user;

    const authenticated =
        typeof auth?.isAuthenticated === "function"
            ? auth.isAuthenticated()
            : Boolean(user);

    const [language, setLanguageState] = useState("en");

    const [isLoadingLanguage, setIsLoadingLanguage] =
        useState(true);

    // ========================================================
    // SET LANGUAGE
    //
    // IMPORTANT:
    // This only changes React state.
    // It does NOT write language to localStorage.
    //
    // ManagerSettings is responsible for saving the selected
    // language to the backend.
    // ========================================================

    const setLanguage = useCallback((newLanguage) => {
        const normalizedLanguage =
            normalizeLanguage(newLanguage);

        setLanguageState(normalizedLanguage);
    }, []);

    // ========================================================
    // LOAD LANGUAGE FROM BACKEND
    // ========================================================

    useEffect(() => {
        let cancelled = false;

        async function loadLanguagePreference() {
            if (!authenticated) {
                if (!cancelled) {
                    setLanguageState("en");
                    setIsLoadingLanguage(false);
                }

                return;
            }

            try {
                setIsLoadingLanguage(true);

                const response =
                    await api.get("/user-preferences");

                const preferences =
                    response?.data?.data ??
                    response?.data;

                const savedLanguage =
                    normalizeLanguage(
                        preferences?.languagePreference ??
                        preferences?.LanguagePreference ??
                        "en"
                    );

                if (!cancelled) {
                    setLanguageState(savedLanguage);
                }
            } catch (error) {
                console.error(
                    "Failed to load language preference:",
                    error?.response?.data || error
                );

                if (!cancelled) {
                    setLanguageState("en");
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingLanguage(false);
                }
            }
        }

        loadLanguagePreference();

        return () => {
            cancelled = true;
        };
    }, [authenticated]);

    // ========================================================
    // TRANSLATION FUNCTION
    // ========================================================

    const t = useCallback(
        (key) => {
            const currentTranslations =
                translations[language] || translations.en;

            // First try selected language.
            const translatedValue =
                getTranslationValue(
                    currentTranslations,
                    key
                );

            if (
                translatedValue !== undefined &&
                translatedValue !== null
            ) {
                return translatedValue;
            }

            // Then fall back to English.
            const englishValue =
                getTranslationValue(
                    translations.en,
                    key
                );

            if (
                englishValue !== undefined &&
                englishValue !== null
            ) {
                return englishValue;
            }

            // Last resort: show the key.
            return key;
        },
        [language]
    );

    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value = useMemo(
        () => ({
            language,

            setLanguage,

            t,

            supportedLanguages:
                SUPPORTED_LANGUAGES,

            isLoadingLanguage,
        }),
        [
            language,
            setLanguage,
            t,
            isLoadingLanguage,
        ]
    );

    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

// ============================================================
// HOOK
// ============================================================

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider."
        );
    }

    return context;
}

export default LanguageContext;