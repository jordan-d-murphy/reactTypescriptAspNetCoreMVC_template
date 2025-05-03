// src/components/layout/PublicLayout.tsx
import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router-dom";
import { PublicNav } from "@/components/PublicNav";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
// import { Toaster } from "@/components/ui/toaster";

export default function PublicLayout() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setIsLoading(false), 600); // adjust as needed
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground px-4">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="grid grid-cols-3 h-16 items-center px-4 max-w-screen-xl mx-auto w-full">
          <div /> {/* Left empty for balance */}
          <div className="flex justify-center">
            <PublicNav />
          </div>
          <div className="flex justify-end">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="w-full">
        {/* {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : ( */}
        <Outlet />
        {/* )} */}
      </main>
    </div>
  );
}
