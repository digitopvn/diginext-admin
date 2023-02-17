import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IBuild } from "./api-types";

export const useBuildListApi = (options?: ApiOptions) => {
	return useListApi<IBuild>(["builds", "list"], `/api/v1/build`, options);
};

export const useBuildApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IBuild>(["builds", id], `/api/v1/build`, id, options);
};

export const useBuildSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IBuild>(["builds", slug], `/api/v1/build`, slug, options);
};

export const useBuildCreateApi = () => {
	return useCreateApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IBuild>(["builds"], `/api/v1/build`, options);
};

export const useBuildDeleteApi = () => {
	return useDeleteApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildLogsApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<any>(["builds", "logs", slug], `/api/v1/build/logs`, slug, options);
};

export const useBuildStopApi = (options?: ApiOptions) => {
	return useUpdateApi<IBuild>(["builds", "stop"], `/api/v1/build/stop`, options);
};
