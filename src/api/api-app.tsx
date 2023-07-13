import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IApp, IDeployEnvironment, KubeEnvironmentVariable } from "./api-types";

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

export const useAppUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IApp>(["apps", "update"], `/api/v1/app`, options);
};

export const useAppDeleteApi = () => {
	return useDeleteApi<IApp>(["apps", "delete"], `/api/v1/app`);
};

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
