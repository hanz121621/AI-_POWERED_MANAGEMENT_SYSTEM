import { Routes, Route, Navigate } from "react-router-dom";

import DeveloperDashboard from "./DeveloperDashboard";
import Profile from "./Profile";
import Projects from "./Projects";
import Tasks from "./Tasks";
import SprintParticipation from "./SprintParticipation";
import Communication from "./Communication";
import Reports from "./Reports";
import Settings from "./Settings";

export default function Developer() {
    return (
        <Routes>
            <Route index element={<DeveloperDashboard />} />

            <Route path="profile" element={<Profile />} />

            <Route path="projects" element={<Projects />} />

            <Route path="tasks" element={<Tasks />} />

            <Route
                path="sprint-participation"
                element={<SprintParticipation />}
            />

            <Route
                path="communication"
                element={<Communication />}
            />

            <Route
                path="reports"
                element={<Reports />}
            />

            <Route
                path="settings"
                element={<Settings />}
            />

            <Route
                path="*"
                element={<Navigate to="/contributor/developer" replace />}
            />
        </Routes>
    );
}