import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IBuild } from "./api-types";

export const useBuildListApi = (options?: ApiOptions) => {
	return useListApi<IBuild>(["builds"], `/api/v1/build`, options);
};

export const useBuildApi = (id: string) => {
	return useItemApi<IBuild>(["builds"], `/api/v1/build`, id);
};

export const useBuildCreateApi = () => {
	return useCreateApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildUpdateApi = () => {
	return useUpdateApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildDeleteApi = () => {
	return useDeleteApi<IBuild>(["builds"], `/api/v1/build`);
};
