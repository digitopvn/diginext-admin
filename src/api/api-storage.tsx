import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICloudStorage } from "./api-types";

export const useCloudStorageListApi = (options?: ApiOptions) => {
	return useListApi<ICloudStorage>(["storages", "list"], `/api/v1/storage`, options);
};

export const useCloudStorageApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudStorage>(["storages", id], `/api/v1/storage`, id, options);
};

export const useCloudStorageSlugApi = (slug: string | undefined, options?: ApiOptions) => {
	return useItemSlugApi<ICloudStorage>(["storages", slug], `/api/v1/storage`, slug, options);
};

export const useCloudStorageCreateApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudStorage>(["storages"], `/api/v1/storage`, options);
};

export const useCloudStorageUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICloudStorage>(["storages"], `/api/v1/storage`, options);
};

export const useCloudStorageDeleteApi = () => {
	return useDeleteApi<ICloudStorage>(["storages"], `/api/v1/storage`);
};
