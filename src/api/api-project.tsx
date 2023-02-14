import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IProject } from "./api-types";

// project list
export const useProjectListApi = (options?: ApiOptions) => {
	return useListApi<IProject>(["projects", "list"], `/api/v1/project`, options);
};

// project list with apps
export const useProjectListWithAppsApi = (options?: ApiOptions) => {
	return useListApi<IProject>(["projects", "list"], `/api/v1/project/with-apps`, options);
};

export const useProjectApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IProject>(["projects", id], `/api/v1/project`, id, options);
};

export const useProjectCreateApi = () => {
	return useCreateApi<IProject>(["projects", "create"], `/api/v1/project`);
};

export const useProjectUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IProject>(["projects", "update"], `/api/v1/project`, options);
};

export const useProjectDeleteApi = () => {
	return useDeleteApi<IProject>(["projects", "delete"], `/api/v1/project`);
};
