import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IContainerRegistry } from "./api-types";

export const useContainerRegistryListApi = (options?: ApiOptions) => {
	return useListApi<IContainerRegistry>(["registries"], `/api/v1/registry`, options);
};

export const useContainerRegistryApi = (id: string) => {
	return useItemApi<IContainerRegistry>(["registries"], `/api/v1/registry`, id);
};

export const useContainerRegistryCreateApi = () => {
	return useCreateApi<IContainerRegistry>(["registries"], `/api/v1/registry`);
};

export const useContainerRegistryUpdateApi = () => {
	return useUpdateApi<IContainerRegistry>(["registries"], `/api/v1/registry`);
};

export const useContainerRegistryDeleteApi = () => {
	return useDeleteApi<IContainerRegistry>(["registries"], `/api/v1/registry`);
};
