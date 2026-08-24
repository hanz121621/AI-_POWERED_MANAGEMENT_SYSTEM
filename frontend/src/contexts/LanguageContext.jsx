import { createContext, useMemo, useState } from "react";

// ============================================================
// STORAGE
// ============================================================

const LANGUAGE_STORAGE_KEY = "aipms_system_language";

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
    // ============================================================
    // ENGLISH
    // ============================================================

    English: {
        // --------------------------------------------------------
        // SYSTEM SETTINGS
        // --------------------------------------------------------

        systemSettings: "System Settings",

        systemSettingsDescription:
            "Configure general AI-PMS system settings.",

        generalConfiguration: "General Configuration",

        systemName: "System Name",

        defaultLanguage: "Default Language",

        dateFormat: "Date Format",

        timeFormat: "Time Format",

        // --------------------------------------------------------
        // USER REGISTRATION
        // --------------------------------------------------------

        userRegistration: "User Registration",

        allowUserRegistration:
            "Allow User Registration",

        allowNewUsers:
            "Allow new users to register.",

        // --------------------------------------------------------
        // SYSTEM LIMITS
        // --------------------------------------------------------

        systemLimits: "System Limits",

        sessionTimeout:
            "Session Timeout (minutes)",

        maximumFileUpload:
            "Maximum File Upload (MB)",

        // --------------------------------------------------------
        // MAINTENANCE
        // --------------------------------------------------------

        maintenanceMode:
            "Maintenance Mode",

        enableMaintenanceMode:
            "Enable Maintenance Mode",

        maintenanceDescription:
            "Restrict normal system access during maintenance.",

        // --------------------------------------------------------
        // ACTIONS
        // --------------------------------------------------------

        cancel: "Cancel",

        saveChanges:
            "Save Changes",

        saving:
            "Saving...",

        // --------------------------------------------------------
        // MESSAGES
        // --------------------------------------------------------

        settingsUpdated:
            "System settings updated successfully.",

        invalidConfiguration:
            "Invalid configuration values.",

        unableToSave:
            "Unable to save system settings. Please try again.",

        // --------------------------------------------------------
        // LANGUAGES
        // --------------------------------------------------------

        english: "English",

        amharic: "Amharic",

        // --------------------------------------------------------
        // DATE FORMATS
        // --------------------------------------------------------

        yearMonthDay:
            "YYYY-MM-DD",

        dayMonthYear:
            "DD/MM/YYYY",

        monthDayYear:
            "MM/DD/YYYY",

        // --------------------------------------------------------
        // TIME FORMATS
        // --------------------------------------------------------

        twentyFourHour:
            "24-hour",

        twelveHour:
            "12-hour",

        // --------------------------------------------------------
        // COMMON NAVIGATION
        // --------------------------------------------------------

        dashboard: "Dashboard",

        projects: "Projects",

        tasks: "Tasks",

        teams: "Teams",

        users: "Users",

        reports: "Reports",

        profile: "Profile",

        logout: "Logout",

        settings: "Settings",

        // --------------------------------------------------------
        // COMMON ACTIONS
        // --------------------------------------------------------

        add: "Add",

        edit: "Edit",

        delete: "Delete",

        view: "View",

        search: "Search",

        close: "Close",

        confirm: "Confirm",

        back: "Back",

        next: "Next",

        previous: "Previous",

        submit: "Submit",

        update: "Update",

        create: "Create",

        // --------------------------------------------------------
        // STATUS
        // --------------------------------------------------------

        active: "Active",

        inactive: "Inactive",

        enabled: "Enabled",

        disabled: "Disabled",

        pending: "Pending",

        completed: "Completed",

        archived: "Archived",
    },

    // ============================================================
    // AMHARIC
    // ============================================================

    Amharic: {
        // --------------------------------------------------------
        // SYSTEM SETTINGS
        // --------------------------------------------------------

        systemSettings:
            "የስርዓት ቅንብሮች",

        systemSettingsDescription:
            "የAI-PMS አጠቃላይ የስርዓት ቅንብሮችን ያስተካክሉ።",

        generalConfiguration:
            "አጠቃላይ ውቅር",

        systemName:
            "የስርዓት ስም",

        defaultLanguage:
            "ነባሪ ቋንቋ",

        dateFormat:
            "የቀን ቅርጸት",

        timeFormat:
            "የሰዓት ቅርጸት",

        // --------------------------------------------------------
        // USER REGISTRATION
        // --------------------------------------------------------

        userRegistration:
            "የተጠቃሚ ምዝገባ",

        allowUserRegistration:
            "የተጠቃሚ ምዝገባን ፍቀድ",

        allowNewUsers:
            "አዲስ ተጠቃሚዎች እንዲመዘገቡ ፍቀድ።",

        // --------------------------------------------------------
        // SYSTEM LIMITS
        // --------------------------------------------------------

        systemLimits:
            "የስርዓት ገደቦች",

        sessionTimeout:
            "የክፍለ ጊዜ ጊዜ ገደብ (ደቂቃ)",

        maximumFileUpload:
            "ከፍተኛው የፋይል መጫኛ መጠን (MB)",

        // --------------------------------------------------------
        // MAINTENANCE
        // --------------------------------------------------------

        maintenanceMode:
            "የጥገና ሁነታ",

        enableMaintenanceMode:
            "የጥገና ሁነታን አንቃ",

        maintenanceDescription:
            "በጥገና ወቅት መደበኛ የስርዓት መዳረሻን ይገድቡ።",

        // --------------------------------------------------------
        // ACTIONS
        // --------------------------------------------------------

        cancel:
            "ሰርዝ",

        saveChanges:
            "ለውጦችን አስቀምጥ",

        saving:
            "በማስቀመጥ ላይ...",

        // --------------------------------------------------------
        // MESSAGES
        // --------------------------------------------------------

        settingsUpdated:
            "የስርዓት ቅንብሮች በተሳካ ሁኔታ ተዘምነዋል።",

        invalidConfiguration:
            "ልክ ያልሆነ የውቅር እሴት።",

        unableToSave:
            "የስርዓት ቅንብሮችን ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",

        // --------------------------------------------------------
        // LANGUAGES
        // --------------------------------------------------------

        english:
            "እንግሊዝኛ",

        amharic:
            "አማርኛ",

        // --------------------------------------------------------
        // DATE FORMATS
        // --------------------------------------------------------

        yearMonthDay:
            "ዓመት-ወር-ቀን",

        dayMonthYear:
            "ቀን/ወር/ዓመት",

        monthDayYear:
            "ወር/ቀን/ዓመት",

        // --------------------------------------------------------
        // TIME FORMATS
        // --------------------------------------------------------

        twentyFourHour:
            "24 ሰዓት",

        twelveHour:
            "12 ሰዓት",

        // --------------------------------------------------------
        // COMMON NAVIGATION
        // --------------------------------------------------------

        dashboard:
            "ዳሽቦርድ",

        projects:
            "ፕሮጀክቶች",

        tasks:
            "ተግባራት",

        teams:
            "ቡድኖች",

        users:
            "ተጠቃሚዎች",

        reports:
            "ሪፖርቶች",

        profile:
            "መገለጫ",

        logout:
            "ውጣ",

        settings:
            "ቅንብሮች",

        // --------------------------------------------------------
        // COMMON ACTIONS
        // --------------------------------------------------------

        add:
            "ጨምር",

        edit:
            "አርትዕ",

        delete:
            "ሰርዝ",

        view:
            "ይመልከቱ",

        search:
            "ፈልግ",

        close:
            "ዝጋ",

        confirm:
            "አረጋግጥ",

        back:
            "ተመለስ",

        next:
            "ቀጣይ",

        previous:
            "ቀዳሚ",

        submit:
            "አስገባ",

        update:
            "አዘምን",

        create:
            "ፍጠር",

        // --------------------------------------------------------
        // STATUS
        // --------------------------------------------------------

        active:
            "ንቁ",

        inactive:
            "የተሰናከለ",

        enabled:
            "ነቅቷል",

        disabled:
            "ተሰናክሏል",

        pending:
            "በመጠባበቅ ላይ",

        completed:
            "ተጠናቋል",

        archived:
            "ተመዝግቧል",
    },
};

// ============================================================
// CONTEXT
// ============================================================

const LanguageContext = createContext(null);

// ============================================================
// LANGUAGE PROVIDER
// ============================================================

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        try {
            const savedLanguage = localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            );

            if (
                savedLanguage === "English" ||
                savedLanguage === "Amharic"
            ) {
                return savedLanguage;
            }

            return "English";
        } catch {
            return "English";
        }
    });

    // ============================================================
    // CHANGE LANGUAGE
    // ============================================================

    const setLanguage = (newLanguage) => {
        const selectedLanguage =
            newLanguage === "Amharic"
                ? "Amharic"
                : "English";

        setLanguageState(selectedLanguage);

        try {
            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                selectedLanguage
            );
        } catch {
            // Ignore localStorage errors
        }
    };

    // ============================================================
    // TRANSLATION FUNCTION
    // ============================================================

    const t = (key) => {
        const currentTranslations =
            translations[language];

        const englishTranslations =
            translations.English;

        return (
            currentTranslations?.[key] ??
            englishTranslations?.[key] ??
            key
        );
    };

    // ============================================================
    // CONTEXT VALUE
    // ============================================================

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
        }),
        [language]
    );

    // ============================================================
    // PROVIDER
    // ============================================================

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export default LanguageContext;