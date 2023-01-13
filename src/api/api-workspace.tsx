import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IWorkspace } from "./api-types";

export const useWorkspaceListApi = (options?: ApiOptions) => {
	return useListApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, options);
};

export const useWorkspaceApi = (id: string) => {
	return useItemApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, id);
};

export const useWorkspaceCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, options);
};

export const useWorkspaceUpdateApi = (filter: any, options?: ApiOptions) => {
	return useUpdateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter, options);
};

export const useWorkspaceDeleteApi = (filter: any, options?: ApiOptions) => {
	return useDeleteApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter, options);
};

// export const useWorkspaceJoinApi = (filter: any, options?: ApiOptions) => {
// 	return useUpdateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter, options);
// };
