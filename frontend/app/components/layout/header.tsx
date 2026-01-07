import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, ChevronsLeft, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/provider/auth-context";
import { Link, useLoaderData, useNavigate } from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";
import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "@/zustand-store/sidebar-collaps";

interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
    selectedWorkspace: Workspace | null;
    onCreateWorkspace: () => void;
}

const Header = ({
    onWorkspaceSelected,
    selectedWorkspace,
    onCreateWorkspace,
}: HeaderProps) => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
    
    const isCollapsed = useSidebarCollapse((state) => state.isCollapsed)
    const setIsCollapsed = useSidebarCollapse((state) => state.setIsCollapsed)
    
    return (
        <div className="sticky top-0 border-b bg-background h-14 flex items-center">
            <Button variant={"outline"} size={"icon"} onClick={setIsCollapsed} className="ml-1 hidden md:flex ">
                <ChevronsLeft className={cn("size-4 transition-all duration-300", isCollapsed && "rotate-180")} />
            </Button>
            <div className="flex justify-between items-center h-14 px-4 sm:px-6 lg:px-8 py-4 w-full">
                {/* left */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>
                            {
                                selectedWorkspace ? <>
                                    {
                                        selectedWorkspace.color && <WorkspaceAvatar color={selectedWorkspace.color}
                                            name={selectedWorkspace.name} />
                                    }
                                    <span className="font-medium">{selectedWorkspace.name}</span>
                                </> : <>
                                    <span className="font-medium">Select workspace</span>
                                </>
                            }
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {
                                workspaces.map((ws) => (
                                    <DropdownMenuItem key={ws._id} onClick={() => onWorkspaceSelected(ws)}>
                                        {ws.color && (<WorkspaceAvatar color={ws.color} name={ws.name} />)}
                                        <span className="ml-2">{ws.name}</span>
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkspace}>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Create Workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* right */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button asChild variant={"default"}>
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/user/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="/user/setting">Setting</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

export default Header;