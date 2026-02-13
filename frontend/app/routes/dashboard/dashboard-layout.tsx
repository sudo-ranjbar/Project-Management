import Header from "@/components/layout/header";
import LoadingPage from "@/components/layout/loading";
import SidebarComponent from "@/components/layout/sidebar-component";
import { Button } from "@/components/ui/button";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { getData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export const clientLoader = async () => {
	try {
		const [workspaces] = await Promise.all([getData("/workspace")]);
		return { workspaces }
	} catch (error) {
		console.log(error);
	}
}


const DashboardLayout = () => {
	const { user, isAuthenticated, isLoadingUser } = useAuth();
	const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
	const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

	// loading
	if (isLoadingUser) return <LoadingPage />

	// permission
	if (!isAuthenticated) return <Navigate to="/sign-in" />

	// workspace selected
	const handleWorkspaceSelected = (workspace: Workspace) => {
		setCurrentWorkspace(workspace);
	};
	const handleCreateWorkspace = () => { }

	return (
		<div className="w-full flex min-h-screen">
			{/* sidebar */}
			<SidebarComponent currentWorkspace={currentWorkspace} />

			{/* main */}
			<div className="flex flex-col w-full h-full min-h-0">
				<Header
					onWorkspaceSelected={handleWorkspaceSelected}
					selectedWorkspace={currentWorkspace}
					onCreateWorkspace={() => setIsCreatingWorkspace(true)}
				/>
				<main className="flex-1 w-full overflow-y-auto min-h-0">
					<div className="container mx-auto px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full">
						<Outlet />
					</div>
				</main>
			</div>
			<CreateWorkspace
				isCreatingWorkspace={isCreatingWorkspace}
				setIsCreatingWorkspace={setIsCreatingWorkspace}
			/>
		</div>
	);
}

export default DashboardLayout;