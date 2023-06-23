import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICloudDatabase } from "./api-types";

export const useCloudDatabaseListApi = (options?: ApiOptions) => {
	return useListApi<ICloudDatabase>(["databases", "list"], `/api/v1/database`, options);
};

export const useCloudDatabaseApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudDatabase>(["databases", id], `/api/v1/database`, id, options);
};

export const useCloudDatabaseSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<ICloudDatabase>(["databases", slug], `/api/v1/database`, slug, options);
};

export const useCloudDatabaseCreateApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabase>(["databases"], `/api/v1/database`, options);
};

export const useCloudDatabaseUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICloudDatabase>(["databases", "update"], `/api/v1/database`, options);
};

export const useCloudDatabaseDeleteApi = () => {
	return useDeleteApi<ICloudDatabase>(["databases", "delete"], `/api/v1/database`);
};

export const useCloudDatabaseHealthzApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudDatabase>(["databases-healthz", id], `/api/v1/database/healthz`, id, options);
};

export const useCloudDatabaseBackupApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabase>(["databases-backup"], `/api/v1/database/backup`, options);
};

export const useCloudDatabaseRestoreApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabase>(["databases-restore"], `/api/v1/database/restore`, options);
};

export const useCloudDatabaseAutoBackupApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabase>(["databases-auto-backup"], `/api/v1/database/auto-backup`, options);
};
