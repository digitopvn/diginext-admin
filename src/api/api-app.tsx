import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IApp } from "./api-types";

export const useAppListApi = (options?: ApiOptions) => {
	return useListApi<IApp>(["apps"], `/api/v1/app`, options);
};

export const useAppApi = (id: string) => {
	return useItemApi<IApp>(["apps"], `/api/v1/app`, id);
};

export const useAppCreateApi = () => {
	return useCreateApi<IApp>(["apps"], `/api/v1/app`);
};

export const useAppUpdateApi = () => {
	return useUpdateApi<IApp>(["apps"], `/api/v1/app`);
};

export const useAppDeleteApi = () => {
	return useDeleteApi<IApp>(["apps"], `/api/v1/app`);
};
