import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICloudProvider } from "./api-types";

export const useCloudProviderListApi = (options?: ApiOptions) => {
	return useListApi<ICloudProvider>(["providers"], `/api/v1/provider`, options);
};

export const useCloudProviderApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudProvider>(["providers"], `/api/v1/provider`, id, options);
};

export const useCloudProviderCreateApi = () => {
	return useCreateApi<ICloudProvider>(["providers"], `/api/v1/provider`);
};

export const useCloudProviderUpdateApi = () => {
	return useUpdateApi<ICloudProvider>(["providers"], `/api/v1/provider`);
};

export const useCloudProviderDeleteApi = () => {
	return useDeleteApi<ICloudProvider>(["providers"], `/api/v1/provider`);
};
