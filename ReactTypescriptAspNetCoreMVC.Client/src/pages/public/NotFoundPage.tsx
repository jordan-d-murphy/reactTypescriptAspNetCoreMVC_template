// src/pages/NotFoundPage.tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404 – Page Not Found</h1>
      <p className="mt-4 text-muted-foreground text-lg">
        {isAuthenticated
          ? "This page doesn’t exist in your dashboard."
          : "Looks like this page doesn’t exist. Maybe try logging in?"}
      </p>
      <Link to={isAuthenticated ? "/dashboard" : "/login"}>
        <Button className="mt-6">{isAuthenticated ? "Go to Dashboard" : "Go to Login"}</Button>
      </Link>
    </div>
  );
}
