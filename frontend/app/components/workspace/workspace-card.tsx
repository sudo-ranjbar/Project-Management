import type { Workspace } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import WorkspaceAvatar from "./workspace-avatar";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { Link } from "react-router";


const WorkspaceCard = ({workspace} : {workspace: Workspace}) => {
    return ( 
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className="transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />

                            <div>
                                <CardTitle>{workspace.name}</CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center text-muted-foreground">
                            <Users className="size-4 mr-1" />
                            <span className="text-xs">{workspace.members.length}</span>
                        </div>
                    </div>

                    <CardDescription className="line-clamp-1">
                        {workspace.description || "No description"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        View workspace details and projects
                    </div>
                </CardContent>
            </Card>
        </Link>
     );
}
 
export default WorkspaceCard;