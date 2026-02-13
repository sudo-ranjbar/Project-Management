import type { CreateProjectFormData } from "@/components/project/create-project";
import { getData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            projectData: CreateProjectFormData;
            workspaceId: string;
        }) =>
            postData(
                `/project/${data.workspaceId}/create-project`,
                data.projectData
            ),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["workspaces", data.workspace],
            });
        },
    });
};

export const useProjectQuery = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getData(`/project/${projectId}/tasks`),
    });
};
