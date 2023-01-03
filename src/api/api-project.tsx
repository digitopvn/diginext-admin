import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { IProject } from "./api-types";

export const useProjectListApi = () => {
	return useListApi<IProject>(["projects"], `/api/v1/project`);
};

export const useProjectApi = (id: string) => {
	return useItemApi<IProject>(["projects"], `/api/v1/project`, id);
};

export const useProjectCreateApi = (data: any) => {
	return useCreateApi<IProject>(["projects"], `/api/v1/project`, data);
};

export const useProjectUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IProject>(["projects"], `/api/v1/project`, filter, data);
};

export const useProjectDeleteApi = (filter: any) => {
	return useDeleteApi<IProject>(["projects"], `/api/v1/project`, filter);
};

// with apps
export const useProjectListWithAppsApi = () => {
	return useListApi<IProject>(["projects"], `/api/v1/project/with-apps`, { populate: "owner" });
};
