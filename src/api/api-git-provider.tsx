import { useApi, useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, GitOrg, GitRepository, GitUser, IGitProvider } from "./api-types";

export const useGitProviderListApi = (options?: ApiOptions) => {
	return useListApi<IGitProvider>(["gits", "list"], `/api/v1/git`, options);
};

export const useGitProviderApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IGitProvider>(["gits", id], `/api/v1/git`, id, options);
};

export const useGitProviderSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IGitProvider>(["gits", slug], `/api/v1/git`, slug, options);
};

export const useGitProviderCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IGitProvider>(["gits"], `/api/v1/git`, options);
};

export const useGitProviderUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IGitProvider>(["gits"], `/api/v1/git`, options);
};

export const useGitProviderDeleteApi = () => {
	return useDeleteApi<IGitProvider>(["gits"], `/api/v1/git`);
};

export const useGitPublicKeyApi = () => {
	return useApi<{ publicKey: string }>(["public-key"], `/api/v1/git/public-key`);
};

export const useGitVerifyApi = (options?: ApiOptions) => {
	return useApi<{ profile: GitUser; provider: IGitProvider }>(["git-verify"], `/api/v1/git/verify`, options);
};

export const useGitOrgListApi = (options?: ApiOptions) => {
	return useListApi<GitOrg>(["git-orgs", "list"], `/api/v1/git/orgs`, options);
};

export const useGitOrgCreateApi = () => {
	return useCreateApi<GitOrg>(["git-orgs"], `/api/v1/git/orgs`);
};

export const useGitOrgRepoListApi = (options?: ApiOptions) => {
	return useListApi<GitRepository>(["git-orgs-repos", "list"], `/api/v1/git/orgs/repos`, options);
};

export const useGitOrgRepoCreateApi = () => {
	return useCreateApi<GitRepository>(["git-orgs-repos"], `/api/v1/git/orgs/repos`);
};
