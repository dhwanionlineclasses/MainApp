import ProfileSidebar from "@/components/profile-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="w-full h-screen">
        <SidebarProvider>
          <ProfileSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
  );
}
