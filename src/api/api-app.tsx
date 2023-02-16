import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IApp } from "./api-types";

export const useAppListApi = (options?: ApiOptions) => {
	return useListApi<IApp>(["apps", "list"], `/api/v1/app`, options);
};

export const useAppApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IApp>(["apps", id], `/api/v1/app`, id, options);
};

export const useAppSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IApp>(["apps", slug], `/api/v1/app`, slug, options);
};

export const useAppCreateApi = () => {
	return useCreateApi<IApp>(["apps"], `/api/v1/app`);
};

export const useAppUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IApp>(["apps", "update"], `/api/v1/app`, options);
};

export const useAppDeleteApi = () => {
	return useDeleteApi<IApp>(["apps", "delete"], `/api/v1/app`);
};

export const useAppEnvironmentDeleteApi = () => {
	return useDeleteApi<IApp | any>(["projects", "apps", "environment", "delete"], `/api/v1/app/environment`);
};
