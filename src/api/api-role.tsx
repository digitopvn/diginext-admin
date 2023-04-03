import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IRole } from "./api-types";

export const useRoleListApi = (options?: ApiOptions) => {
	return useListApi<IRole>(["roles", "list"], `/api/v1/role`, options);
};

export const useRoleApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IRole>(["roles", id], `/api/v1/role`, id, options);
};

export const useRoleSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IRole>(["roles", slug], `/api/v1/role`, slug, options);
};

export const useRoleCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IRole>(["roles"], `/api/v1/role`, options);
};

export const useRoleUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IRole>(["roles"], `/api/v1/role`, options);
};

export const useRoleDeleteApi = (filter?: any) => {
	return useDeleteApi<IRole>(["roles"], `/api/v1/role`);
};
