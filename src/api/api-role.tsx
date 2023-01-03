import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { IRole } from "./api-types";

export const useRoleListApi = () => {
	return useListApi<IRole>(["roles"], `/api/v1/role`);
};

export const useRoleApi = (id: string) => {
	return useItemApi<IRole>(["roles"], `/api/v1/role`, id);
};

export const useRoleCreateApi = (data: any) => {
	return useCreateApi<IRole>(["roles"], `/api/v1/role`, data);
};

export const useRoleUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IRole>(["roles"], `/api/v1/role`, filter, data);
};

export const useRoleDeleteApi = (filter: any) => {
	return useDeleteApi<IRole>(["roles"], `/api/v1/role`, filter);
};
