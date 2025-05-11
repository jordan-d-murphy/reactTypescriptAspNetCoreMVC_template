import { RouteObject } from "react-router-dom";
import DashboardLayout from "@/pages/layouts/DashboardLayout";
import PublicLayout from "@/pages/layouts/PublicLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { ProjectsPage } from "@/pages/dashboard/features/projects/ProjectsPage";
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
import PlaygroundPage from "@/pages/dashboard/features/playground/page";
import { Mail } from "@/pages/dashboard/features/mail/components/mail";
import MailPage from "@/pages/dashboard/features/mail/page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "authV2", element: <AuthV2Page /> },
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
      { path: "playground", element: <PlaygroundPage /> },
      { path: "mail", element: <MailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
