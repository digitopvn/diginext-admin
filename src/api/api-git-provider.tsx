import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IGitProvider } from "./api-types";

export const useGitProviderListApi = (options?: ApiOptions) => {
	return useListApi<IGitProvider>(["gits", "list"], `/api/v1/git`, options);
};

export const useGitProviderApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IGitProvider>(["gits", id], `/api/v1/git`, id, options);
};

export const useGitProviderSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemApi<IGitProvider>(["gits", slug], `/api/v1/git`, slug, options);
};

export const useGitProviderCreateApi = () => {
	return useCreateApi<IGitProvider>(["gits"], `/api/v1/git`);
};

export const useGitProviderUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IGitProvider>(["gits"], `/api/v1/git`, options);
};

export const useGitProviderDeleteApi = () => {
	return useDeleteApi<IGitProvider>(["gits"], `/api/v1/git`);
};
