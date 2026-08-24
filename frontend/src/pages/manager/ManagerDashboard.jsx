


import { useNavigate } from "react-router-dom";

import StatCard from "../../components/manager/StatCard";
import ProjectProgress from "../../components/manager/ProjectProgress";
import AIInsights from "../../components/manager/AIInsights";
import DashboardCharts from "../../components/manager/DashboardCharts";
import ProjectTable from "../../components/manager/ProjectTable";
import RiskPrediction from "../../components/manager/RiskPrediction";

import {
  FolderKanban,
  CheckCircle,
  Users,
  AlertTriangle,
} from "lucide-react";


function ManagerDashboard() {

  const navigate = useNavigate();


  // =========================
  // Dashboard Statistics
  // =========================

  const stats = [
    {
      title: "Total Projects",
      value: "24",
      icon: FolderKanban,
      color: "bg-blue-600",
      path: "/manager/projects",
    },

    {
      title: "Completed Tasks",
      value: "356",
      icon: CheckCircle,
      color: "bg-green-600",
      path: "/manager/tasks",
    },

    {
      title: "Team Members",
      value: "42",
      icon: Users,
      color: "bg-purple-600",
      path: "/manager/team",
    },

    {
      title: "AI Risks",
      value: "8",
      icon: AlertTriangle,
      color: "bg-red-600",
      path: "/manager/risks",
    },
  ];


  return (
    <div className="w-full space-y-8">

      {/* =========================
          Header
      ========================== */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Manager Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Monitor projects, teams and AI insights
        </p>
      </div>


      {/* =========================
          Statistics Cards
      ========================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {stats.map((item) => (

          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="cursor-pointer"
          >

            <StatCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              onClick={() => navigate(item.path)}
            />

          </div>

        ))}

      </div>


      {/* =========================
          Progress + AI Insights
      ========================== */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        <ProjectProgress />

        <AIInsights />

      </div>


      {/* =========================
          Dashboard Charts
      ========================== */}

      <div className="w-full">

        <DashboardCharts />

      </div>


      {/* =========================
          Project Table
      ========================== */}

      <div className="w-full">

        <ProjectTable />

      </div>


      {/* =========================
          Risk Prediction
      ========================== */}

      <div className="w-full">

        <RiskPrediction />

      </div>

    </div>
  );
}


export default ManagerDashboard;

