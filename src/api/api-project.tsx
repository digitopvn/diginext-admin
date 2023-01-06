import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IProject } from "./api-types";

export const useProjectListApi = (options?: ApiOptions) => {
	return useListApi<IProject>(["projects"], `/api/v1/project`, options);
};

export const useProjectApi = (id: string) => {
	return useItemApi<IProject>(["projects"], `/api/v1/project`, id);
};

export const useProjectCreateApi = () => {
	return useCreateApi<IProject>(["projects"], `/api/v1/project`);
};

export const useProjectUpdateApi = () => {
	return useUpdateApi<IProject>(["projects"], `/api/v1/project`);
};

export const useProjectDeleteApi = () => {
	return useDeleteApi<IProject>(["projects"], `/api/v1/project`);
};

// with apps
export const useProjectListWithAppsApi = (options?: ApiOptions) => {
	return useListApi<IProject>(["projects"], `/api/v1/project/with-apps`, options);
};
