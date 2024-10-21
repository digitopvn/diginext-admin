import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICluster } from "./api-types";

export const useClusterListApi = (options?: ApiOptions) => {
	return useListApi<ICluster>(["clusters", "list"], `/api/v1/cluster`, options);
};

export const useClusterListAllApi = (options?: ApiOptions) => {
	return useListApi<ICluster>(["clusters", "list-all"], `/api/v1/cluster/all`, options);
};

export const useClusterApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICluster>(["cluster", "id"], `/api/v1/cluster`, id, options);
};

export const useClusterSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<ICluster>(["cluster", slug], `/api/v1/cluster`, slug, options);
};

export const useClusterCreateApi = () => {
	return useCreateApi<ICluster>(["clusters", "create"], `/api/v1/cluster`);
};

export const useClusterUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICluster>(["clusters", "update"], `/api/v1/cluster`, options);
};

export const useClusterDeleteApi = () => {
	return useDeleteApi<ICluster>(["clusters", "delete"], `/api/v1/cluster`);
};
