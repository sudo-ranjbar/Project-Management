import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { CheckCircle2, LayoutDashboard, ListCheck, LogOut, Settings, Users, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useSidebarCollapse } from "@/zustand-store/sidebar-collaps";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./sidebar-nav";


const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
    const { user, logout } = useAuth();
    const isCollapsed = useSidebarCollapse((state) => state.isCollapsed)
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Workspaces",
            href: "/workspaces",
            icon: Users,
        },
        {
            title: "My Tasks",
            href: "/my-tasks",
            icon: ListCheck,
        },
        {
            title: "Members",
            href: `/members`,
            icon: Users,
        },
        {
            title: "Achieved",
            href: `/achieved`,
            icon: CheckCircle2,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ];
    return (
        <div className={cn("flex flex-col border-r bg-sidebar transition-all duration-300", isCollapsed ? "w-16 md:w-20" : "w-16 md:w-60")}>
            {/* sidebar header */}
            <div className="flex items-center justify-center px-4 h-14 border-b">
                <Link to="/dashboard" className="flex items-center ">
                    {!isCollapsed ?
                        (
                            <div className="flex items-center gap-4">
                                <Wrench className="w-6 h-6 text-blue-600" />
                                <span className="text-lg font-semibold hidden md:block">TaskHub</span>
                            </div>
                        ) :
                        (
                            <Wrench className="w-6 h-6 text-blue-600" />
                        )
                    }
                </Link>
            </div>

            {/* sidebar content */}
            <ScrollArea className="flex-1 px-3 py-2">
                <SidebarNav
                    items={navItems}
                    isCollapsed={isCollapsed}
                    className={cn(isCollapsed && "items-center space-y-2")}
                    currentWorkspace={currentWorkspace}
                />
            </ScrollArea>

            {/* logout */}
            <div>
                <Button variant={"ghost"} size={"default"} onClick={logout}>
                    <LogOut className={cn("w-4 h-4" , !isCollapsed && "mr-1")}/>
                    {!isCollapsed && <span className="hidden md:block">Logout</span>}
                </Button>
            </div>
        </div>
    );
}

export default SidebarComponent;