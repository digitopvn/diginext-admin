import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICloudProvider } from "./api-types";

export const useCloudProviderListApi = (options?: ApiOptions) => {
	return useListApi<ICloudProvider>(["providers", "list"], `/api/v1/provider`, options);
};

export const useCloudProviderApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudProvider>(["providers", id], `/api/v1/provider`, id, options);
};

export const useCloudProviderSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemApi<ICloudProvider>(["providers", slug], `/api/v1/provider`, slug, options);
};

export const useCloudProviderCreateApi = () => {
	return useCreateApi<ICloudProvider>(["providers"], `/api/v1/provider`);
};

export const useCloudProviderUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICloudProvider>(["providers"], `/api/v1/provider`, options);
};

export const useCloudProviderDeleteApi = () => {
	return useDeleteApi<ICloudProvider>(["providers", "delete"], `/api/v1/provider`);
};
