import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IContainerRegistry } from "./api-types";

export const useContainerRegistryListApi = (options?: ApiOptions) => {
	return useListApi<IContainerRegistry>(["registries", "list"], `/api/v1/registry`, options);
};

export const useContainerRegistryListAllApi = (options?: ApiOptions) => {
	return useListApi<IContainerRegistry>(["registries", "list-all"], `/api/v1/registry/all`, options);
};

export const useContainerRegistryApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IContainerRegistry>(["registries", id], `/api/v1/registry`, id, options);
};

export const useContainerRegistrySlugApi = (slug: string | undefined, options?: ApiOptions) => {
	return useItemSlugApi<IContainerRegistry>(["registries", slug], `/api/v1/registry`, slug, options);
};

export const useContainerRegistryCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IContainerRegistry>(["registries"], `/api/v1/registry`, options);
};

export const useContainerRegistryUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IContainerRegistry>(["registries"], `/api/v1/registry`, options);
};

export const useContainerRegistryDeleteApi = () => {
	return useDeleteApi<IContainerRegistry>(["registries"], `/api/v1/registry`);
};
