import { lazy } from "react";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserProgress = lazy(() => import("../pages/UserProgress"));
const EngagementData = lazy(() => import("../pages/EngagementData"));

const routes = [
  // dashboard
  {
    path: "/",
    element: <Dashboard />,
    layout: "default",
  },
  {
    path: "/user-progress",
    element: <UserProgress />,
    layout: "default",
  },
  {
    path: "/engagement-data",
    element: <EngagementData />,
    layout: "default",
  },
];

export { routes };
