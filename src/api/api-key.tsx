import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IUser } from "./api-types";

export const useApiKeyListApi = (options?: ApiOptions) => {
	return useListApi<IUser>(["users", "list"], `/api/v1/api_key`, options);
};

export const useApiKeyApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IUser>(["users", id], `/api/v1/api_key`, id, options);
};

export const useApiKeySlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IUser>(["users", slug], `/api/v1/api_key`, slug, options);
};

export const useApiKeyCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IUser>(["users"], `/api/v1/api_key`, options);
};

export const useApiKeyUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/api_key`, options);
};

export const useApiKeyDeleteApi = () => {
	return useDeleteApi<IUser>(["users"], `/api/v1/api_key`);
};

// Add an user to a workspace
export const useApiKeyJoinWorkspaceApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/api_key/join-workspace`, options);
};
