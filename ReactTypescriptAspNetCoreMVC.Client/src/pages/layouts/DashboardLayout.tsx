import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setIsLoading(false), 700); // adjust as needed
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main>
          {/* {isLoading ? (
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin animate- text-muted-foreground" />
            </div>
          ) : ( */}
          <Outlet />
          {/* )} */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
