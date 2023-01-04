import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IApp } from "./api-types";

export const useAppListApi = (options?: ApiOptions) => {
	return useListApi<IApp>(["apps"], `/api/v1/app`, options);
};

export const useAppApi = (id: string) => {
	return useItemApi<IApp>(["apps"], `/api/v1/app`, id);
};

export const useAppCreateApi = (data: any) => {
	return useCreateApi<IApp>(["apps"], `/api/v1/app`, data);
};

export const useAppUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IApp>(["apps"], `/api/v1/app`, filter, data);
};

export const useAppDeleteApi = (filter: any) => {
	return useDeleteApi<IApp>(["apps"], `/api/v1/app`, filter);
};
