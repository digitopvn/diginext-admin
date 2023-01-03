import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { IFramework } from "./api-types";

export const useFrameworkListApi = () => {
	return useListApi<IFramework>(["projects"], `/api/v1/project`);
};

export const useFrameworkApi = (id: string) => {
	return useItemApi<IFramework>(["projects"], `/api/v1/project`, id);
};

export const useFrameworkCreateApi = (data: any) => {
	return useCreateApi<IFramework>(["projects"], `/api/v1/project`, data);
};

export const useFrameworkUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IFramework>(["projects"], `/api/v1/project`, filter, data);
};

export const useFrameworkDeleteApi = (filter: any) => {
	return useDeleteApi<IFramework>(["projects"], `/api/v1/project`, filter);
};
