import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICluster } from "./api-types";

export const useClusterListApi = (options?: ApiOptions) => {
	return useListApi<ICluster>(["clusters"], `/api/v1/cluster`, options);
};

export const useClusterApi = (id: string) => {
	return useItemApi<ICluster>(["clusters"], `/api/v1/cluster`, id);
};

export const useClusterCreateApi = (data: any) => {
	return useCreateApi<ICluster>(["clusters"], `/api/v1/cluster`, data);
};

export const useClusterUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<ICluster>(["clusters"], `/api/v1/cluster`, filter, data);
};

export const useClusterDeleteApi = (filter: any) => {
	return useDeleteApi<ICluster>(["clusters"], `/api/v1/cluster`, filter);
};
