import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { IUser } from "./api-types";

export const useUserListApi = () => {
	return useListApi<IUser>(["users"], `/api/v1/user`);
};

export const useUserApi = (id: string) => {
	return useItemApi<IUser>(["users"], `/api/v1/user`, id);
};

export const useUserCreateApi = (data: any) => {
	return useCreateApi<IUser>(["users"], `/api/v1/user`, data);
};

export const useUserUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IUser>(["users"], `/api/v1/user`, filter, data);
};

export const useUserDeleteApi = (filter: any) => {
	return useDeleteApi<IUser>(["users"], `/api/v1/user`, filter);
};
