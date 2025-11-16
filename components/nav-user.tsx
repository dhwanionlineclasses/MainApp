"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { logout } from "@/action/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useProfileData } from "@/data/get-profile-data";

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: profileData, isError, isPending, error } = useProfileData();

  if (isPending) {
    console.log("Loading your profile data...");
  }
  if (isError) {
    console.log("Error: ", error);
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await logout();
      if (res.success) {
        toast("Successfully logged out!");
        router.push("/");
      } else {
        router.push("/");
        toast(res.message);
      }
    } catch (err) {
      toast("Something went wrong", {
        description: "Check console for more details",
      });
      router.push("/");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
            >
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={profileData?.data?.gender === 'male' ? '/avatar-male.png' : '/avatar-female.png'} alt={isPending
                  ? "Loading..."
                  : profileData?.data?.username
                    ? profileData.data.username
                    : "Username"} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-medium">{isPending
                  ? "Loading..."
                  : profileData?.data?.username
                    ? profileData.data.username
                    : "Username"}</span>
                <span className="truncate">{isPending
                  ? "Loading..."
                  : profileData?.data?.email
                    ? profileData.data.email
                    : "Email"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={profileData?.data?.gender === 'male' ? '/avatar-male.png' : '/avatar-female.png'} alt={isPending
                    ? "Loading..."
                    : profileData?.data?.username
                      ? profileData.data.username
                      : "Username"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-medium">{isPending
                    ? "Loading..."
                    : profileData?.data?.username
                      ? profileData.data.username
                      : "Username"}</span>
                  <span className="truncate">{isPending
                    ? "Loading..."
                    : profileData?.data?.email
                      ? profileData.data.email
                      : "Email"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}
              disabled={loading || isPending}>
              <LogOut />
              {loading ? "Logging Out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
