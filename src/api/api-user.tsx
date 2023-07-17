import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IUser } from "./api-types";

export const useUserListApi = (options?: ApiOptions) => {
	return useListApi<IUser>(["users", "list"], `/api/v1/user`, options);
};

export const useUserApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IUser>(["users", id], `/api/v1/user`, id, options);
};

export const useUserSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IUser>(["users", slug], `/api/v1/user`, slug, options);
};

export const useUserCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IUser>(["users"], `/api/v1/user`, options);
};

export const useUserUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/user`, options);
};

export const useUserDeleteApi = () => {
	return useDeleteApi<IUser>(["users"], `/api/v1/user`);
};

// Add an user to a workspace
type UserJoinWorkspaceParams = {
	/**
	 * User ID
	 */
	userId: string;
	/**
	 * Workspace slug
	 */
	workspace: string;
};
export const useUserJoinWorkspaceApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser, UserJoinWorkspaceParams>(["users"], `/api/v1/user/join-workspace`, options);
};

export const useUserAssignRoleApi = (options?: ApiOptions) => {
	return useUpdateApi<IUser, { roleId: string }>(["users"], `/api/v1/user/assign-role`, options);
};
