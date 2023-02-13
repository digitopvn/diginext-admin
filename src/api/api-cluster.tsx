import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICluster } from "./api-types";

export const useClusterListApi = (options?: ApiOptions) => {
	return useListApi<ICluster>(["clusters", "list"], `/api/v1/cluster`, options);
};

export const useClusterApi = (id: string) => {
	return useItemApi<ICluster>(["clusters", "id"], `/api/v1/cluster`, id);
};

export const useClusterSlugApi = (options?: ApiOptions) => {
	return useItemSlugApi<ICluster>(["clusters", "slug"], `/api/v1/cluster`, options);
};

export const useClusterCreateApi = () => {
	return useCreateApi<ICluster>(["clusters", "create"], `/api/v1/cluster`);
};

export const useClusterUpdateApi = (filter: any, options?: ApiOptions) => {
	return useUpdateApi<ICluster>(["clusters", "update"], `/api/v1/cluster`, filter, options);
};

export const useClusterDeleteApi = () => {
	return useDeleteApi<ICluster>(["clusters", "delete"], `/api/v1/cluster`);
};
