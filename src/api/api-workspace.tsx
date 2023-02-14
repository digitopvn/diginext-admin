import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IWorkspace } from "./api-types";

export const useWorkspaceListApi = (options?: ApiOptions) => {
	return useListApi<IWorkspace>(["workspaces", "list"], `/api/v1/workspace`, options);
};

export const useWorkspaceApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IWorkspace>(["workspaces", id], `/api/v1/workspace`, id, options);
};

export const useWorkspaceSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IWorkspace>(["workspaces", slug], `/api/v1/workspace`, slug, options);
};

export const useWorkspaceCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, options);
};

export const useWorkspaceUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, options);
};

export const useWorkspaceDeleteApi = () => {
	return useDeleteApi<IWorkspace>(["workspaces", "delete"], `/api/v1/workspace`);
};

// export const useWorkspaceJoinApi = (filter: any, options?: ApiOptions) => {
// 	return useUpdateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter, options);
// };
