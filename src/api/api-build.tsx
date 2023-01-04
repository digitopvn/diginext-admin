import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IBuild } from "./api-types";

export const useBuildListApi = (options?: ApiOptions) => {
	return useListApi<IBuild>(["builds"], `/api/v1/build`, options);
};

export const useBuildApi = (id: string) => {
	return useItemApi<IBuild>(["builds"], `/api/v1/build`, id);
};

export const useBuildCreateApi = (data: any) => {
	return useCreateApi<IBuild>(["builds"], `/api/v1/build`, data);
};

export const useBuildUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IBuild>(["builds"], `/api/v1/build`, filter, data);
};

export const useBuildDeleteApi = (filter: any) => {
	return useDeleteApi<IBuild>(["builds"], `/api/v1/build`, filter);
};
