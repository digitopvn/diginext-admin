import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICluster } from "./api-types";

export const useClusterListApi = (options?: ApiOptions) => {
	return useListApi<ICluster>(["clusters"], `/api/v1/cluster`, options);
};

export const useClusterApi = (id: string) => {
	return useItemApi<ICluster>(["clusters"], `/api/v1/cluster`, id);
};

export const useClusterSlugApi = (options?: ApiOptions) => {
	return useItemSlugApi<ICluster>(["clusters"], `/api/v1/cluster`, options);
};

export const useClusterCreateApi = () => {
	return useCreateApi<ICluster>(["clusters"], `/api/v1/cluster`);
};

export const useClusterUpdateApi = (filter: any, options?: ApiOptions) => {
	return useUpdateApi<ICluster>(["clusters"], `/api/v1/cluster`, filter, options);
};

export const useClusterDeleteApi = () => {
	return useDeleteApi<ICluster>(["clusters"], `/api/v1/cluster`);
};
