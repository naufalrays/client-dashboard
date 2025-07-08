import { createBrowserRouter } from "react-router-dom";
import BlankLayout from "../components/Layouts/BlankLayout";
import DefaultLayout from "../components/Layouts/DefaultLayout";
import { routes } from "./routes";
import ErrorPage from "../pages/ErrorPage";

const finalRoutes = routes.map((route) => {
  return {
    ...route,
    element:
      route.layout === "blank" ? (
        <BlankLayout>{route.element}</BlankLayout>
      ) : (
        <DefaultLayout>{route.element}</DefaultLayout>
      ),
    errorElement: <ErrorPage />,
  };
});

const router = createBrowserRouter(finalRoutes);

export default router;
