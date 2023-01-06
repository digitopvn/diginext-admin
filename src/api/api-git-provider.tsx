import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IGitProvider } from "./api-types";

export const useGitProviderListApi = (options?: ApiOptions) => {
	return useListApi<IGitProvider>(["gits"], `/api/v1/git`, options);
};

export const useGitProviderApi = (id: string) => {
	return useItemApi<IGitProvider>(["gits"], `/api/v1/git`, id);
};

export const useGitProviderCreateApi = () => {
	return useCreateApi<IGitProvider>(["gits"], `/api/v1/git`);
};

export const useGitProviderUpdateApi = () => {
	return useUpdateApi<IGitProvider>(["gits"], `/api/v1/git`);
};

export const useGitProviderDeleteApi = () => {
	return useDeleteApi<IGitProvider>(["gits"], `/api/v1/git`);
};
