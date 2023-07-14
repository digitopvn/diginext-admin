import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IApp, IDeployEnvironment, KubeEnvironmentVariable } from "./api-types";

interface ImportGitParams {
	/**
	 * App's name
	 */
	name?: string;
	/**
	 * Git repo SSH url
	 * @example git@github.com:digitopvn/diginext.git
	 */
	sshUrl: string;
	/**
	 * Git provider ID to host the new repo of this app
	 */
	gitProviderID: string;
	/**
	 * Select git branch to pull
	 */
	gitBranch?: string;
	/**
	 * Project ID of this app
	 */
	projectID?: string;
	/**
	 * `DANGER`
	 * ---
	 * Delete app and git repo if they were existed.
	 * @default false
	 */
	force?: boolean;
}

export const useAppListApi = (options?: ApiOptions) => {
	return useListApi<IApp>(["apps", "list"], `/api/v1/app`, options);
};

export const useAppApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IApp>(["apps", id], `/api/v1/app`, id, options);
};

export const useAppSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IApp>(["apps", slug], `/api/v1/app`, slug, options);
};

export const useAppCreateApi = () => {
	return useCreateApi<IApp>(["apps"], `/api/v1/app`);
};

export const useAppImportGitApi = (options?: ApiOptions) => {
	return useCreateApi<IApp, Error, ImportGitParams>(["apps"], `/api/v1/app/import-git`, options);
};

export const useAppUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IApp>(["apps", "update"], `/api/v1/app`, options);
};

export const useAppDeleteApi = () => {
	return useDeleteApi<IApp>(["apps", "delete"], `/api/v1/app`);
};

// environment variables

export const useAppEnvVarsCreateApi = (options?: ApiOptions) => {
	return useCreateApi<KubeEnvironmentVariable[] | any>(["env_vars"], `/api/v1/app/environment/variables`, options);
};

export const useAppEnvVarsDeleteApi = (options?: ApiOptions) => {
	return useDeleteApi<KubeEnvironmentVariable[] | any>(["env_vars", "delete"], `/api/v1/app/environment/variables`, options);
};

export const useAppAddDomainApi = (options?: ApiOptions) => {
	return useCreateApi<any>(["env_vars"], `/api/v1/app/environment/domains`, options);
};

// APP DEPLOY ENVIRONMENT

export const useAppDeployEnvironmentSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IDeployEnvironment>(["deploy_environment", slug], `/api/v1/app/deploy_environment`, slug, options);
};

export const useAppDeployEnvironmentCreateApi = () => {
	return useCreateApi<IDeployEnvironment>(["deploy_environment"], `/api/v1/app/deploy_environment`);
};

export const useAppDeployEnvironmentUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IDeployEnvironment>(["deploy_environment", "update"], `/api/v1/app/deploy_environment`, options);
};

export const useAppDeployEnvironmentDeleteApi = () => {
	return useDeleteApi<IDeployEnvironment>(["deploy_environment", "delete"], `/api/v1/app/deploy_environment`);
};

// LOGS

export const useAppDeployEnvironmentLogsApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<{ [pod: string]: string }>(["app_logs", slug], `/api/v1/app/environment/logs`, slug, options);
};
