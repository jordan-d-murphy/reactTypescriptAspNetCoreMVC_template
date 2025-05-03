// src/components/layout/PublicLayout.tsx
import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router-dom";
import { PublicNav } from "../PublicNav";
// import { Toaster } from "@/components/ui/toaster";

export default function PublicLayout() {
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
        <Outlet />
      </main>
    </div>
  );
}
