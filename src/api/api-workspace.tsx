import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { IWorkspace } from "./api-types";

export const useWorkspaceListApi = () => {
	return useListApi<IWorkspace>(["workspaces"], `/api/v1/workspace`);
};

export const useWorkspaceApi = (id: string) => {
	return useItemApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, id);
};

export const useWorkspaceCreateApi = (data: any) => {
	return useCreateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, data);
};

export const useWorkspaceUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter, data);
};

export const useWorkspaceDeleteApi = (filter: any) => {
	return useDeleteApi<IWorkspace>(["workspaces"], `/api/v1/workspace`, filter);
};
