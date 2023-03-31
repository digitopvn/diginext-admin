import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IUser } from "./api-types";

export const useServiceAccountListApi = (options?: ApiOptions) => {
	return useListApi<IUser>(["users", "list"], `/api/v1/service_account`, options);
};

export const useServiceAccountApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IUser>(["users", id], `/api/v1/service_account`, id, options);
};

export const useServiceAccountSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IUser>(["users", slug], `/api/v1/service_account`, slug, options);
};

export const useServiceAccountCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IUser>(["users"], `/api/v1/service_account`, options);
};

export const useServiceAccountUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/service_account`, options);
};

export const useServiceAccountDeleteApi = () => {
	return useDeleteApi<IUser>(["users"], `/api/v1/service_account`);
};

// Add an user to a workspace
export const useServiceAccountJoinWorkspaceApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/service_account/join-workspace`, options);
};
