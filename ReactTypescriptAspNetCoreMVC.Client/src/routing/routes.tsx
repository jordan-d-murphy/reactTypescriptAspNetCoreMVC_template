// src/routes.tsx
import { Outlet, RouteObject } from "react-router-dom";
import DashboardLayout from "@/pages/layouts/DashboardLayout";
import PublicLayout from "@/pages/layouts/PublicLayout";

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
import { ProtectedRoute } from "./ProtectedRoute";
import AuthV2Page from "@/pages/auth/AuthV2Page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "authV2", element: <AuthV2Page /> },
      { path: "register", element: <RegisterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
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
