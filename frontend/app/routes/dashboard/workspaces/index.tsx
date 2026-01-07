import LoadingPage from "@/components/layout/loading";
import NoDataFound from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import WorkspaceCard from "@/components/workspace/workspace-card";
import { useGetWorkspacesQuery } from "@/hooks/workspace";
import type { Workspace } from "@/types";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const WorkspacesPage = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data: Workspace[];
        isLoading: boolean;
    };

    if (isLoading) {
        return <LoadingPage />
    }

    return (
        <>
            <div className="space-y-8">
                {/* header section */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-3xl font-bold">Worksapces</h2>
                    <Button className="bg-blue-500" onClick={() => setIsCreatingWorkspace(true)}>
                        <PlusCircle className="size-4 mr-2" />
                        New Workspace
                    </Button>
                </div>
                {/* workspaces cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        workspaces.length === 0 ?
                            (<NoDataFound
                                title="No workspaces found"
                                description="Create a new workspace to get started"
                                buttonText="Create workspace"
                                buttonAction={() => setIsCreatingWorkspace(true)} />) :

                            workspaces.map((ws) => (
                                <WorkspaceCard key={ws._id} workspace={ws} />
                            ))
                    }
                </div>
            </div>
            <CreateWorkspace isCreatingWorkspace={isCreatingWorkspace} setIsCreatingWorkspace={setIsCreatingWorkspace} />
        </>
    );
}

export default WorkspacesPage;