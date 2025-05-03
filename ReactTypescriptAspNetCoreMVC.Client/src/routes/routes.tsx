// src/routes.tsx
import { Outlet, RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import PublicLayout from "@/components/layouts/PublicLayout";

// Import your pages
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { ProjectsPage } from "@/pages/dashboard/features/projects/ProjectsPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "@/pages/public/Home";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import TimestampPage from "@/pages/dashboard/TimestampPage";
import UuidPage from "@/pages/dashboard/UuidPage";
import RandomNumberPage from "@/pages/dashboard/RandomNumberPage";
import AdminPage from "@/pages/dashboard/AdminPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/app",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "random", element: <RandomNumberPage /> },
      { path: "uuid", element: <UuidPage /> },
      { path: "timestamp", element: <TimestampPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
