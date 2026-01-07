import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import type { LucideProps } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

export type NavItem = {
    title: string;
    href: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

const SidebarNav = ({
    items,
    isCollapsed,
    className,
    currentWorkspace,
    ...props
}: {
    items: NavItem[];
    isCollapsed: boolean;
    className: string;
    currentWorkspace: Workspace | null;
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={cn("flex flex-col gap-y-2", className)} {...props} >
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                const handleClick = () => {
                    if (item.href === "/workspaces") {
                        navigate(item.href);
                    } else if (currentWorkspace && currentWorkspace._id) {
                        navigate(`${item.href}?workspaceId=${currentWorkspace._id}`);
                    } else {
                        navigate(item.href);
                    }
                }
                return <Button 
                key={item.href}
                variant={isActive? "outline" : "ghost"}
                    className={cn("justify-start", isActive && "bg-blue-800/20 text-blue-600 font-medium hover:bg-blue-800/20 hover:text-blue-600 ")}
                onClick={handleClick}
                >
                    <Icon className="size-4 mr-2"/>
                    {isCollapsed ? (<span className="sr-only">{item.title}</span>) : 
                    (item.title)
                }
                </Button>
            })}
        </nav>
    );
}

export default SidebarNav;