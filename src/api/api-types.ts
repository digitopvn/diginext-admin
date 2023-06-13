/* eslint-disable prettier/prettier */
import type { AxiosRequestConfig } from "axios";

export type ApiFilter = any;

export type ApiOptions = AxiosRequestConfig & {
	pagination?: IPaginationOptions;
	populate?: string;
	filter?: ApiFilter;
	sort?: string;
	staleTime?: number;
	enabled?: boolean;
};

export type ApiStatus = "error" | "loading" | "success" | "idle";

export type ApiPagination = {
	current_page: number;
	total_pages: number;
	total_items: number;
	page_size: number;
	next_page?: number;
	prev_page?: number;
};

export interface AccessTokenInfo {
	access_token: string;
	expiredTimestamp: number;
	expiredDate: Date;
	expiredDateGTM7: string;
}

export interface ApiResponse<T = any> extends ApiPagination {
	status: number;
	data: T;
	messages: string[];
	token?: AccessTokenInfo;
}

export const registryProviderList = ["gcloud", "digitalocean", "dockerhub"] as const;
export type RegistryProvider = { name: string; slug: (typeof registryProviderList)[number] };
export const registryProviders = registryProviderList.map((provider) => {
	switch (provider) {
		case "digitalocean":
			return { name: "Digital Ocean Registry", slug: "digitalocean" } as RegistryProvider;
		case "gcloud":
			return { name: "Google Container Registry", slug: "gcloud" } as RegistryProvider;
		case "dockerhub":
			return { name: "Docker Registry", slug: "dockerhub" } as RegistryProvider;
		default:
			return undefined;
	}
});
export type RegistryProviderType = (typeof registryProviderList)[number];

// cloud providers
export const cloudProviderList = ["gcloud", "digitalocean", "custom"] as const;
export type CloudProviderType = (typeof cloudProviderList)[number];

// git providers
export const availableGitProviders = ["bitbucket", "github"] as const;
export const gitProviders = availableGitProviders.map((provider) => {
	switch (provider) {
		case "bitbucket":
			return { name: "Bitbucket", slug: "bitbucket" };
		case "github":
			return { name: "Github", slug: "github" };
		// case "gitlab":
		// 	return { name: "Gitlab", slug: "gitlab" };
		default:
			return { name: "Unknown", slug: "unknown" };
	}
});
export type GitProviderType = (typeof availableGitProviders)[number];

// resource types
export const availableResourceSizes = ["none", "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x"] as const;
export type ResourceQuotaSize = (typeof availableResourceSizes)[number];

// git provider domains
export const gitProviderDomain = {
	bitbucket: "bitbucket.org",
	github: "github.com",
	gitlab: "gitlab.com",
};

// build status
export const buildStatusList = ["start", "building", "failed", "success"] as const;
export type BuildStatus = (typeof buildStatusList)[number];

/**
 * App status:
 * - `healthy`: App's containers are running well.
 * - `partial_healthy`: Some of the app's containers are unhealthy.
 * - `undeployed`: App has not been deployed yet.
 * - `failed`: App's containers are unable to deploy due to image pull back-off or image pulling errors.
 * - `crashed`: App's containers are facing some unexpected errors.
 * - `unknown`: Other unknown errors.
 */
export const appStatusList = ["healthy", "partial_healthy", "undeployed", "failed", "crashed", "unknown"] as const;
export type AppStatus = (typeof appStatusList)[number];

// ssl
export const sslIssuers = ["letsencrypt", "custom", "none"] as const;
export type SSLIssuer = (typeof sslIssuers)[number];

export interface IGeneral {
	/**
	 * Alias of `_id` MongoDB
	 */
	id?: string;
	/**
	 * MongoDB `ID`
	 */
	_id?: string;
	/**
	 * A unique slug of this instance
	 */
	slug?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	metadata?: any;
	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: any;
	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: any;
}

export type IBase = IGeneral;

export interface IPaginationOptions {
	page?: number;
	size?: number;
	skip?: number;
	limit?: number;
}

export interface WorkspaceApiAccessToken {
	/**
	 *
	 */
	name: string;

	/**
	 *
	 */
	slug?: string;

	/**
	 *
	 */
	token: string;

	/**
	 *
	 */
	roles?: IRole[];
}

export interface IWorkspace extends IGeneral {
	/**
	 * Workspace name
	 */
	name?: string;

	/**
	 * Workspace slug: auto-generated by "name" column
	 * @readonly
	 */
	slug?: string;

	/**
	 * Is this a Public workspace
	 */
	public?: boolean;

	/**
	 * Workspace profile picture
	 */
	image?: string;

	/**
	 * Workspace domain name
	 */
	domain?: string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * List of this workspace's API Access Token
	 */
	apiAccessTokens?: WorkspaceApiAccessToken[];

	/**
	 * `DX_KEY` that obtained from https://diginext.vn
	 */
	dx_key?: string;
}

export type IRouteScope = "all" | "workspace" | "team" | "project" | "app";

export type IRoutePermission = "full" | "own" | "create" | "read" | "update" | "delete";

export interface RoleRoute {
	/**
	 * Route path
	 * @example /api/v1/healthz
	 */
	route: string;
	/**
	 * @default ["full"]
	 */
	permissions: IRoutePermission[];
	/**
	 * (TBC)
	 * @default all
	 * @example all
	 */
	scope?: IRouteScope;
}

export interface IRole extends IGeneral {
	name?: string;
	image?: string;
	type?: string;

	routes?: RoleRoute[];

	/**
	 * ID of the project
	 *
	 * @remarks This can be populated to {Project} data
	 */
	project?: IProject | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface ITeam extends IGeneral {
	name?: string;

	image?: string;

	/**
	 * ID of the project
	 *
	 * @remarks This can be populated to {Project} data
	 */
	project?: IProject | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IProviderInfo {
	name: string;
	user_id?: string;
	access_token?: string;
}

export interface IUser extends IGeneral {
	/**
	 * User name
	 */
	name?: string;

	/**
	 * User's type
	 */
	type?: "user" | "service_account" | "api_key_user";

	/**
	 * Unique username of a user
	 * This equavilent with "slug"
	 */
	username?: string;

	/**
	 * User email address
	 */
	email?: string;

	/**
	 * Is this user's email or phone verified?
	 */
	verified?: boolean;

	/**
	 * User profile picture URL
	 */
	image?: string;

	/**
	 * List of Cloud Providers which this user can access to
	 */
	providers?: IProviderInfo[];

	/**
	 * User password (hashed)
	 */
	password?: string;

	/**
	 * User token
	 */
	token?: AccessTokenInfo;

	/**
	 * User's roles
	 */
	roles?: IRole[] | string[];

	/**
	 * User's team IDs which this user is a member
	 */
	teams?: ITeam[] | string[];

	/**
	 * List of workspace IDs which this user is a member
	 */
	workspaces?: IWorkspace[];

	/**
	 * Active workspace ID which the user is logging into
	 */
	activeWorkspace?: IWorkspace;
}

export interface IServiceAccount extends IUser {}

export interface BitbucketOAuthOptions {
	/**
	 * The CONSUMER_KEY for Bitbucket authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/
	 * @type {string}
	 * @memberof IGitProvider
	 */
	consumer_key?: string;

	/**
	 * The CONSUMER_SECRET for Bitbucket authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/
	 * @type {string}
	 * @memberof IGitProvider
	 */
	consumer_secret?: string;

	/**
	 * Your Bitbucket account's username
	 */
	username?: string;

	/**
	 * The APP_PASSWORD for Bitbucket authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/
	 * @type {string}
	 * @memberof IGitProvider
	 */
	app_password?: string;

	/**
	 * `TRUE` if the REST API calling was successfully.
	 */
	verified?: boolean;
}

export interface GithubOAuthOptions {
	/**
	 * The app's CLIENT_ID for Github authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app
	 * @type {string}
	 * @memberof IGitProvider
	 */
	client_id?: string;

	/**
	 * The app's CLIENT_SECRET for Github authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app
	 * @type {string}
	 * @memberof IGitProvider
	 */
	client_secret?: string;

	/**
	 * Your Github account's username
	 */
	username?: string;

	/**
	 * The PERSONAL ACCESS TOKEN for Github authentication:
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @link https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
	 * @type {string}
	 * @memberof IGitProvider
	 */
	personal_access_token?: string;

	/**
	 * `TRUE` if the REST API calling was successfully.
	 */
	verified?: boolean;
}

export interface GitUser {
	id?: string;
	username?: string;
	display_name?: string;
	url?: string;
	email?: string;
}

export interface GitOrg {
	id: string;
	name: string;
	description: string;
	url: string;
}

export interface GitRepository {
	id: string;
	name: string;
	full_name: string;
	description: string;
	private: boolean;
	fork: boolean;
	repo_url: string;
	ssh_url: string;
	owner: {
		username: string;
		id: string;
		url: string;
		type: string;
	};
	created_at: string;
	updated_at: string;
}

export interface GitRepositoryDto {
	name: string;
	description?: string;
	private: boolean;
}

export interface IGitProvider extends IBase {
	/**
	 * The name of the Git provider.
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	name?: string;

	/**
	 * The host of the Git provider.
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	host?: string;

	/**
	 * The Git workspace of the Git provider.
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	gitWorkspace?: string;

	/**
	 * The repository of the Git provider.
	 *
	 * @type {{
	 *     url?: string;
	 *     sshPrefix?: string;
	 *   }}
	 * @memberof IGitProvider
	 */
	repo?: {
		/**
		 * The URL of the repository of the Git provider.
		 *
		 * @type {string}
		 */
		url?: string;

		/**
		 * The SSH prefix of the repository of the Git provider.
		 *
		 * @type {string}
		 */
		sshPrefix?: string;
	};

	/**
	 * The type of the Git provider.
	 *
	 * @type {GitProviderType}
	 * @memberof IGitProvider
	 */
	type?: GitProviderType;

	/**
	 * Bitbucket OAuth Information
	 */
	bitbucket_oauth?: BitbucketOAuthOptions;

	/**
	 * Github OAuth Information
	 */
	github_oauth?: GithubOAuthOptions;

	/**
	 * Authorization header method
	 */
	method?: "bearer" | "basic";

	/**
	 * The API access token of the Git provider,
	 * to create new repo, commit, pull & push changes to the repositories.
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	access_token?: string;

	/**
	 * The API refresh token of the Git provider,
	 * to obtain new access token if it's expired
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	refresh_token?: string;
}

export interface IFramework extends IGeneral {
	name?: string;

	host?: string;

	/**
	 * ID of the Git Provider
	 *
	 * @remarks This can be populated to {GitProvider} data
	 */

	git?: IGitProvider;

	gitProvider?: string;

	repoURL?: string;

	repoSSH?: string;

	mainBranch?: string;

	/**
	 * Number of downloads
	 */
	downloads?: number;

	/**
	 * ID of the project
	 *
	 * @remarks This can be populated to {Project} data
	 */
	project?: IProject | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IContainerRegistry extends IGeneral {
	name?: string;
	slug?: string;

	/**
	 * The host (domain) of your container registry which you are using.
	 * @example
	 * - gcr.io
	 * - asia.gcr.io
	 * - azurecr.io
	 */
	host?: string;

	/**
	 * Base URL of the image, usually is the registry host URI combines with something else.
	 * - This will be used to combine with your project/app image path.
	 * @example
	 * asia.gcr.io/project-id-here
	 */
	imageBaseURL?: string;

	/**
	 * Provider's "shortName"
	 */
	provider?: string;

	// @Column()
	// serviceAccount?: string;

	imagePullSecret?: {
		name?: string;
		value?: string;
	};

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface KubeEnvironmentVariable {
	name: string;
	value: string;
}

export interface DiginextEnvironmentVariable {
	name: string;
	value: string;
	/**
	 * @default "string"
	 */
	type?: "string" | "secret";
}

export interface IAppEnvironment {
	/**
	 * Container registry slug
	 */
	registry?: string;
	/**
	 * Cloud provider's short name
	 */
	provider?: string;
	/**
	 * Cluster's short name
	 */
	cluster?: string;
	/**
	 * [Google Cloud] PROJECT_ID
	 */
	project?: string;
	/**
	 * [Google Cloud] Region
	 */
	region?: string;
	/**
	 * [Google Cloud] Zone
	 */
	zone?: string;

	/**
	 * Image URI of this app on the Container Registry.
	 * - Combined from: `<registry-image-base-url>/<project-slug>/<app-name-in-slug-case>`
	 * - No `tag` version at the end! (eg. `latest`, `beta`,...)
	 * @example
	 * asia.gcr.io/google-project-id/my-project-slug/my-app-slug
	 */
	imageURL?: string;

	/**
	 * Destination namespace name
	 */
	namespace?: string;
	/**
	 * Container quota resources
	 * @example
	 * "none" - {}
	 * "1x" - { requests: { cpu: `50m`, memory: `256Mi` }, limits: { cpu: `50m`, memory: `256Mi` } }
	 * "2x" - { requests: { cpu: `100m`, memory: `512Mi` }, limits: { cpu: `100m`, memory: `512Mi` } }
	 */
	size?: "none" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x";
	shouldInherit?: boolean;
	redirect?: boolean;
	/**
	 * Container's scaling replicas
	 */
	replicas?: number;
	/**
	 * Container's port
	 */
	port?: number;
	basePath?: string;
	domains?: string[];
	cdn?: boolean;
	ssl?: "letsencrypt" | "custom" | "none";
	tlsSecret?: string;
	cliVersion?: string;
	/**
	 * Content of namespace YAML file
	 */
	namespaceYaml?: string;
	/**
	 * Content of deployment YAML file
	 */
	deploymentYaml?: string;
	/**
	 * Content of prerelease deployment YAML file
	 */
	prereleaseDeploymentYaml?: string;
	/**
	 * Prerelease endpoint URL
	 */
	prereleaseUrl?: string;
	/**
	 * Collection array of environment variables
	 */
	envVars?: KubeEnvironmentVariable[];

	/**
	 * User name of the first person who deploy on this environment.
	 */
	createdBy?: string;

	/**
	 * User name of the last person who deploy or update this environment.
	 */
	lastUpdatedBy?: string;

	/**
	 * ID of the creator
	 */
	creator?: any;

	/**
	 * Update time
	 */
	updatedAt?: Date;

	/**
	 * Deployment's status
	 */
	status?: AppStatus;

	/**
	 * Amount of ready instances
	 */
	readyCount?: number;
}

export interface ICloudProvider extends IGeneral {
	name?: string;

	/**
	 * Cloud provider short name, without spacing & special characters
	 */
	shortName?: string;

	// @Column({ default: [] })
	// ips?: string[];

	// @Column({ default: [] })
	// domains?: string[];

	/**
	 * Content of the API access token to use services on this cloud provider
	 * - Apply for: Digital Ocean
	 */
	apiAccessToken?: string;

	/**
	 * Content of the Service Account credentials ti access services on this cloud provider
	 * - Apply for: Google Cloud, AWS,...
	 * - For example: Kubernetes Clusters, Single Sign-On,...
	 */
	serviceAccount?: string;

	/**
	 * List of available clusters on this provider
	 */
	clusters?: string[] | ICluster[];

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface ICluster extends IGeneral {
	name?: string;

	/**
	 * Cluster slug
	 */
	slug?: string;

	/**
	 * Flag to check cluster's accessibility
	 */
	isVerified?: boolean;

	/**
	 * Cluster short name (to access via `kubectl context`)
	 */
	shortName?: string;

	/**
	 * Cloud provider of this cluster
	 */
	provider?: ICloudProvider;

	/**
	 * Short name of the cloud provider
	 */
	providerShortName?: string;

	/**
	 * Cloud zone of this cluster
	 */
	zone?: string;

	/**
	 * Cloud region of this cluster
	 */
	region?: string;

	/**
	 * [GOOGLE ONLY] Project ID of this cluster
	 *
	 * @remarks This is not a project ID of BUILD SERVER database
	 */
	projectID?: string;

	/**
	 * The PRIMARY domain of this cluster
	 */
	primaryDomain?: string;

	/**
	 * The PRIMARY IP ADDRESS of this cluster, or IP ADDRESS of the LOAD BALANCER
	 */
	primaryIP?: string;

	/**
	 * Alternative domains or project's domains of this cluster
	 */
	domains?: string[];

	/**
	 * The KUBECONFIG data to access to this cluster
	 */
	kubeConfig?: string;

	/**
	 * Content of the Service Account credentials to access this cluster
	 */
	serviceAccount?: string;

	/**
	 * Content of the API ACCESS TOKEN to access this cluster
	 */
	apiAccessToken?: string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IApp extends IGeneral {
	/**
	 * @deprecated
	 */
	environment?: { [key: string]: IAppEnvironment };
	deployEnvironment?: { [key: string]: IAppEnvironment };

	git?: string;
	latestBuild?: string;
	name?: string;

	project?: IProject | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IProject extends IGeneral {
	name?: string;
	slug?: string;
	updatedAt?: string;
	apps?: IApp[];
	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IBuild extends IGeneral {
	name?: string;
	image?: string;
	slug?: string;
	env?: string;
	branch?: string;
	logs?: string;
	createdBy?: string;
	status?: "start" | "building" | "failed" | "success";
	projectSlug?: string;
	appSlug?: string;

	/**
	 * ID of the app
	 *
	 * @remarks This can be populated to {Project} data
	 */
	app?: IApp | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the project
	 *
	 * @remarks This can be populated to {Project} data
	 */
	project?: IProject | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}

export interface IRelease extends IGeneral {
	name?: string;
	image?: string;
	env?: any[] | string;
	diginext?: any;
	namespace?: string;
	prodYaml?: string;
	preYaml?: string;
	prereleaseUrl?: string;
	productionUrl?: string;
	createdBy?: string;
	branch?: string;
	provider?: string;

	/**
	 * Short name of the targeted cluster to deploy to.
	 */
	cluster?: string;
	projectSlug?: string;
	appSlug?: string;
	providerProjectId?: string;
	buildStatus?: "start" | "building" | "failed" | "success";
	active?: boolean;

	/**
	 * ID of the app
	 *
	 * @remarks This can be populated to {Project} data
	 */
	app?: IApp | string;

	/**
	 * User ID of the owner
	 *
	 * @remarks This can be populated to {User} data
	 */
	owner?: IUser | string;

	/**
	 * ID of the project
	 *
	 * @remarks This can be populated to {Project} data
	 */
	project?: IProject | string;

	/**
	 * ID of the workspace
	 *
	 * @remarks This can be populated to {Workspace} data
	 */
	workspace?: IWorkspace | string;
}
