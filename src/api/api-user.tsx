import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IUser } from "./api-types";

export const useUserListApi = (options?: ApiOptions) => {
	return useListApi<IUser>(["users"], `/api/v1/user`, options);
};

export const useUserApi = (id: string) => {
	return useItemApi<IUser>(["users"], `/api/v1/user`, id);
};

export const useUserCreateApi = () => {
	return useCreateApi<IUser>(["users"], `/api/v1/user`);
};

export const useUserUpdateApi = () => {
	return useUpdateApi<IUser>(["users"], `/api/v1/user`);
};

export const useUserDeleteApi = () => {
	return useDeleteApi<IUser>(["users"], `/api/v1/user`);
};
