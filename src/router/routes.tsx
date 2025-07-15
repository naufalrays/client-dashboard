import { lazy } from "react";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserProgress = lazy(() => import("../pages/UserProgress"));
const EngagementData = lazy(() => import("../pages/EngagementData"));

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "default",
  },
  {
    path: "/login",
    element: <Login />,
    layout: "blank",
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    layout: "default",
  },
  {
    path: "/user-progress",
    element: (
      <ProtectedRoute>
        <UserProgress />
      </ProtectedRoute>
    ),
    layout: "default",
  },
  {
    path: "/engagement-data",
    element: (
      <ProtectedRoute>
        <EngagementData />
      </ProtectedRoute>
    ),
    layout: "default",
  },
];

export { routes };
