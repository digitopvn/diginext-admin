import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICloudDatabase, ICloudDatabaseBackup } from "./api-types";

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

// ----- DATABASE ACTIONS -----

export const useCloudDatabaseActionBackupApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabaseBackup>(["database-action-backup"], `/api/v1/database/backup`, options);
};

export const useCloudDatabaseActionRestoreApi = (options?: ApiOptions) => {
	return useCreateApi<{ id: string }, Error, ICloudDatabaseBackup>(["database-action-restore"], `/api/v1/database/restore`, options);
};

export const useCloudDatabaseActionAutoBackupApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabase>(["database-action-autos-backup"], `/api/v1/database/auto-backup`, options);
};

// ----- CLOUD DATABASE BACKUP -----

export const useCloudDatabaseBackupListApi = (options?: ApiOptions) => {
	return useListApi<ICloudDatabaseBackup>(["database-backups", "list"], `/api/v1/database-backup`, options);
};

export const useCloudDatabaseBackupItemApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICloudDatabaseBackup>(["database-backups", id], `/api/v1/database-backup`, id, options);
};

export const useCloudDatabaseBackupCreateApi = (options?: ApiOptions) => {
	return useCreateApi<ICloudDatabaseBackup>(["database-backups"], `/api/v1/database-backup`, options);
};

export const useCloudDatabaseBackupUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICloudDatabaseBackup>(["database-backups", "update"], `/api/v1/database-backup`, options);
};

export const useCloudDatabaseBackupDeleteApi = () => {
	return useDeleteApi<ICloudDatabaseBackup>(["database-backups", "delete"], `/api/v1/database-backup`);
};
