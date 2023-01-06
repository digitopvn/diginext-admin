import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IFramework } from "./api-types";

export const useFrameworkListApi = (options?: ApiOptions) => {
	return useListApi<IFramework>(["frameworks"], `/api/v1/framework`, options);
};

export const useFrameworkApi = (id: string) => {
	return useItemApi<IFramework>(["frameworks"], `/api/v1/framework`, id);
};

export const useFrameworkCreateApi = () => {
	return useCreateApi<IFramework>(["frameworks"], `/api/v1/framework`);
};

export const useFrameworkUpdateApi = () => {
	return useUpdateApi<IFramework>(["frameworks"], `/api/v1/framework`);
};

export const useFrameworkDeleteApi = (filter: any) => {
	return useDeleteApi<IFramework>(["frameworks"], `/api/v1/framework`);
};
