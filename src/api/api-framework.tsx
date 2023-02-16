import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IFramework } from "./api-types";

export const useFrameworkListApi = (options?: ApiOptions) => {
	return useListApi<IFramework>(["frameworks", "list"], `/api/v1/framework`, options);
};

export const useFrameworkApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IFramework>(["frameworks", id], `/api/v1/framework`, id, options);
};

export const useFrameworkSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IFramework>(["frameworks", slug], `/api/v1/framework`, slug, options);
};

export const useFrameworkCreateApi = () => {
	return useCreateApi<IFramework>(["frameworks"], `/api/v1/framework`);
};

export const useFrameworkUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IFramework>(["frameworks"], `/api/v1/framework`, options);
};

export const useFrameworkDeleteApi = () => {
	return useDeleteApi<IFramework>(["frameworks", "delete"], `/api/v1/framework`);
};
