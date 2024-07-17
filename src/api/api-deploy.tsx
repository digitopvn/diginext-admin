import type { KubeDeployment } from "@/types/KubeDeployment";
import type { KubeNamespace } from "@/types/KubeNamespace";

import { useCreateApi } from "./api";
import type { ApiOptions, IApp, IBuild, IRelease, IUser } from "./api-types";

// build platforms
export const buildPlatformList = [
	"linux/arm64",
	"linux/amd64",
	"linux/amd64/v2",
	"linux/riscv64",
	"linux/ppc64le",
	"linux/s390x",
	"linux/386",
	"linux/mips64le",
	"linux/mips64",
	"linux/arm/v7",
	"linux/arm/v6",
] as const;
export type BuildPlatform = (typeof buildPlatformList)[number];

export type StartBuildParams = {
	/**
	 * App's slug
	 */
	appSlug: string;
	/**
	 * Build number is also an container image's tag
	 */
	buildNumber: string;
	/**
	 * Select a git branch to pull source code & build
	 */
	gitBranch: string;

	/**
	 * ID of the author
	 * - `If passing "userId", no need to pass "user" and vice versa.`
	 */
	userId?: string;

	/**
	 * {User} instance of the author
	 * - `If passing "user", no need to pass "userId" and vice versa.`
	 */
	user?: IUser;

	/**
	 * Slug of the Container Registry
	 */
	registrySlug: string;

	/**
	 * Select the deploy environment to build image, in this case, this info is using for selecting "Dockerfile"
	 * of specific deploy environment only, for example: "Dockerfile.dev" or "Dockerfile.prod",
	 * if you don't specify "env", a default "Dockerfile" will be selected.
	 * - **[OPTIONAL] SHOULD NOT rely on this!**
	 * - A build should be able to used for any deploy environments.
	 */
	env?: string;

	/**
	 * Path to the source code directory
	 * * [OPTIONAL] Only apply for CLI command, has no effects on API call
	 */
	buildDir?: string;

	/**
	 * Enable async to watch the build process
	 * @default false
	 */
	buildWatch?: boolean;

	/**
	 * DXUP CLI version of client user
	 */
	cliVersion?: string;

	/**
	 * @default false
	 */
	isDebugging?: boolean;

	/**
	 * Targeted platform arch: linux/arm64, linux/amd64,...
	 */
	platforms?: BuildPlatform[];

	/**
	 * Build arguments
	 */
	args?: { name: string; value: string }[];
};

export type DeployBuildParams = {
	/**
	 * Deploy environment
	 * @example "dev", "prod"
	 */
	env: string;
	/**
	 * `[OPTIONAL]` - Cluster's slug
	 */
	cluster?: string;
	/**
	 * `[OPTIONAL]` - Container registry's slug
	 */
	registry?: string;
	/**
	 * User ID of the author
	 */
	author?: string;
	/**
	 * [DANGER]
	 * ---
	 * Should delete old deployment and deploy a new one from scratch
	 * @default false
	 */
	shouldUseFreshDeploy?: boolean;
	/**
	 * ### FOR DEPLOY to PROD
	 * Force roll out the release to "prod" deploy environment (instead of "prerelease" environment)
	 * @default false
	 */
	forceRollOut?: boolean;
	/**
	 * ### WARNING
	 * Skip checking deployed POD's ready status.
	 * - The response status will always be SUCCESS even if the pod is unable to start up properly.
	 * @default false
	 */
	skipReadyCheck?: boolean;
	/**
	 * ### WARNING
	 * Skip checking the progress of deployment, let it run in background, won't return the deployment's status.
	 * @default false
	 */
	deployInBackground?: boolean;
};

export type GenerateDeploymentResult = {
	// namespace
	namespaceContent: string;
	namespaceObject: KubeNamespace;
	// deployment (ingress, service, pods,...)
	deploymentContent: string;
	deploymentCfg: KubeDeployment;
	// prerelease (ingress, service, pods,...)
	// prereleaseYamlObject: any[];
	// prereleaseDeploymentContent: string;
	// prereleaseUrl: string;
	// accessibility
	buildTag: string;
	IMAGE_NAME: string;
	endpoint: string;
};

export type DeployBuildV2Result = {
	app: IApp;
	build: IBuild;
	release: IRelease;
	deployment: GenerateDeploymentResult;
	endpoint: string;
	// prerelease: FetchDeploymentResult;
};

export type DeployBuildV2Options = {
	/**
	 * ### `REQUIRED`
	 * Target deploy environment
	 */
	env: string;
	/**
	 * Select target cluster (by slug) to deploy
	 */
	clusterSlug?: string;
	/**
	 * Current version of the DXUP CLI
	 */
	cliVersion?: string;
	/**
	 * ### CAUTION
	 * If `TRUE`, it will find and wipe out the current deployment, then deploy a new one!
	 */
	shouldUseFreshDeploy?: boolean;
	/**
	 * ### ONLY APPLY FOR DEPLOYING to PROD
	 * Force roll out the release to "prod" deploy environment (skip the "prerelease" environment)
	 * @default false
	 * @deprecated
	 */
	forceRollOut?: boolean;
	/**
	 * ### WARNING
	 * Skip checking deployed POD's ready status.
	 * - The response status will always be SUCCESS even if the pod is unable to start up properly.
	 * @default false
	 */
	skipReadyCheck?: boolean;
	/**
	 * ### WARNING
	 * Skip watching the progress of deployment, let it run in background, won't return the deployment's status.
	 * @default true
	 */
	deployInBackground?: boolean;
};

export type PromoteDeployEnvironmentOptions = {
	/**
	 * @default false
	 */
	isDebugging?: boolean;
	/**
	 * App's slug
	 */
	appSlug: string;
	/**
	 * Original deploy environment (FROM)
	 */
	fromEnv: string;
} & DeployBuildV2Options;

/**
 * Build & deploy app from source code.
 */
export const useDeployFromSourceApi = (options?: ApiOptions) => {
	return useCreateApi<{ logURL: string }, Error, { buildParams: StartBuildParams; deployParams: DeployBuildParams }>(
		["deploy-source"],
		`/api/v1/deploy/from-source`,
		options
	);
};

/**
 * Build & deploy app from a repo SSH url.
 */
export const useDeployFromGitApi = (options?: ApiOptions) => {
	return useCreateApi<
		{ logURL: string },
		Error,
		{
			/**
			 * Git repo SSH url
			 */
			sshUrl: string;
			/**
			 * Target git branch to build and deploy
			 */
			gitBranch: string;
			/**
			 * Cluster's slug
			 * - **CAUTION: will take the default or random cluster if not specified**.
			 */
			clusterSlug?: string;
			/**
			 * Exposed port
			 */
			port: string;
			deployParams: DeployBuildParams;
		}
	>(["deploy-git"], `/api/v1/deploy/from-git`, options);
};

/**
 * Build & deploy an app.
 */
export const useDeployFromAppApi = (options?: ApiOptions) => {
	return useCreateApi<
		{ logURL: string },
		Error,
		{
			/**
			 * App's slug
			 */
			appSlug: string;
			/**
			 * Target git branch to build and deploy
			 */
			gitBranch: string;
			deployParams: DeployBuildParams;
		}
	>(["deploy-app"], `/api/v1/deploy/from-app`, options);
};

/**
 * Promote a deploy environment to another environment (default: "production").
 */
export const usePromoteDeployEnvironmentApi = (options?: ApiOptions) => {
	return useCreateApi<DeployBuildV2Result, Error, PromoteDeployEnvironmentOptions>(["promote-deploy-env"], `/api/v1/deploy/promote`, options);
};

/**
 * No builds, just deploy to target environment from a "success" build.
 */
export const useDeployFromBuildApi = (options?: ApiOptions) => {
	return useCreateApi<any>(["deploy-build"], `/api/v1/deploy/from-build`, options);
};
