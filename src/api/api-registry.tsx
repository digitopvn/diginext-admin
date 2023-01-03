import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IContainerRegistry } from "./api-types";

export const useContainerRegistryListApi = (options?: ApiOptions) => {
	return useListApi<IContainerRegistry>(["registries"], `/api/v1/registry`, options);
};

export const useContainerRegistryApi = (id: string) => {
	return useItemApi<IContainerRegistry>(["registries"], `/api/v1/registry`, id);
};

export const useContainerRegistryCreateApi = (data: any) => {
	return useCreateApi<IContainerRegistry>(["registries"], `/api/v1/registry`, data);
};

export const useContainerRegistryUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IContainerRegistry>(["registries"], `/api/v1/registry`, filter, data);
};

export const useContainerRegistryDeleteApi = (filter: any) => {
	return useDeleteApi<IContainerRegistry>(["registries"], `/api/v1/registry`, filter);
};
