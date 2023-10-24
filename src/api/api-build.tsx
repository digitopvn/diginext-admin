import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { BuildPlatform } from "./api-deploy";
import type { ApiOptions, IBuild } from "./api-types";

export type StartBuildParams = {
	/**
	 * Slug of the Container Registry
	 */
	registrySlug?: string;

	/**
	 * Build number is also an container image's tag
	 */
	buildNumber?: string;

	/**
	 * Enable async to watch the build process
	 * @default false
	 */
	buildWatch?: boolean;

	/**
	 * Targeted platform arch: linux/arm64, linux/amd64,...
	 */
	platforms?: BuildPlatform[];

	/**
	 * Build arguments
	 */
	args?: { name: string; value: string }[];

	/**
	 * @default false
	 */
	isDebugging?: boolean;
};
export type RerunBuildParams = Pick<StartBuildParams, "platforms" | "args" | "registrySlug" | "buildNumber" | "buildWatch">;

type StartBuildResponse = {
	SOCKET_ROOM: string;
	build: IBuild;
	imageURL: string;
	buildImage: string;
	startTime: string;
	builder: string;
	logURL: string;
};

export const useBuildListApi = (options?: ApiOptions) => {
	return useListApi<IBuild>(["builds", "list"], `/api/v1/build`, options);
};

export const useBuildApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IBuild>(["builds", id], `/api/v1/build`, id, options);
};

export const useBuildSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<IBuild>(["builds", slug], `/api/v1/build`, slug, options);
};

export const useBuildCreateApi = () => {
	return useCreateApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IBuild>(["builds"], `/api/v1/build`, options);
};

export const useBuildDeleteApi = () => {
	return useDeleteApi<IBuild>(["builds"], `/api/v1/build`);
};

export const useBuildLogsApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<any>(["builds", "logs", slug], `/api/v1/build/logs`, slug, options);
};

export const useBuildStartApi = (options?: ApiOptions) => {
	return useCreateApi<StartBuildResponse, Error, StartBuildParams>(["builds", "start"], `/api/v1/build/start`, options);
};

export const useBuildStopApi = (options?: ApiOptions) => {
	return useCreateApi<IBuild>(["builds", "stop"], `/api/v1/build/stop`, options);
};

export const useBuildRerunApi = (options?: ApiOptions) => {
	return useCreateApi<StartBuildResponse, Error, RerunBuildParams>(["builds", "rerun"], `/api/v1/build/rerun`, options);
};
