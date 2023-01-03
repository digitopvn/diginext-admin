import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ICloudProvider } from "./api-types";

export const useCloudProviderListApi = () => {
	return useListApi<ICloudProvider>(["providers"], `/api/v1/provider`);
};

export const useCloudProviderApi = (id: string) => {
	return useItemApi<ICloudProvider>(["providers"], `/api/v1/provider`, id);
};

export const useCloudProviderCreateApi = (data: any) => {
	return useCreateApi<ICloudProvider>(["providers"], `/api/v1/provider`, data);
};

export const useCloudProviderUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<ICloudProvider>(["providers"], `/api/v1/provider`, filter, data);
};

export const useCloudProviderDeleteApi = (filter: any) => {
	return useDeleteApi<ICloudProvider>(["providers"], `/api/v1/provider`, filter);
};
