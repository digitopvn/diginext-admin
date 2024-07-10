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
	isDebugging?: boolean;
};

export type ApiMonitorFilter = {
	/**
	 * Cluster's ID or SLUG
	 */
	cluster?: string;
	/**
	 * Resource's name
	 */
	name?: string;
	/**
	 * Namespace's name
	 */
	namespace?: string;
	/**
	 * Filter by labels
	 */
	labels?: Record<string, string>;
};

export type ApiMonitorOptions = AxiosRequestConfig & {
	// pagination?: IPaginationOptions;
	filter?: ApiMonitorFilter;
	sort?: string;
	output?: "json" | "yaml";
	staleTime?: number;
	enabled?: boolean;
	isDebugging?: boolean;
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
	refresh_token: string;
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

export interface HiddenBodyKeys {
	id?: unknown;
	_id?: unknown;
	metadata?: unknown;
	owner?: unknown;
	workspace?: unknown;
	createdAt?: unknown;
	deletedAt?: unknown;
	updatedAt?: unknown;
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

// cloud storage providers
export const storageProviderList = ["gcloud", "do_space", "aws_s3"] as const;
export type StorageProvider = { name: string; slug: (typeof storageProviderList)[number] };
export const storageProviders = storageProviderList.map((provider) => {
	switch (provider) {
		case "aws_s3":
			return { name: "Amazon S3 Storage", slug: "aws_s3" } as StorageProvider;
		case "gcloud":
			return { name: "Google Cloud Storage", slug: "gcloud" } as StorageProvider;
		case "do_space":
			return { name: "DigitalOcean Space Storage", slug: "do_space" } as StorageProvider;
		default:
			return undefined;
	}
});
export type StorageProviderType = (typeof storageProviderList)[number];

// database providers
export const cloudDatabaseList = [
	"mongodb",
	"mysql",
	"mariadb",
	"postgresql",
	// "sqlserver", "sqlite", "redis", "dynamodb"
] as const;
export type CloudDatabaseType = (typeof cloudDatabaseList)[number];

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
/**
 * Container quota resources
 * @example
 * "none" - {}
 * "1x" - { requests: { cpu: "20m", memory: "128Mi" }, limits: { cpu: "20m", memory: 128Mi" } }
 * "2x" - { requests: { cpu: "40m", memory: "256Mi" }, limits: { cpu: "40m", memory: "256Mi" } }
 * "3x" - { requests: { cpu: "80m", memory: "512Mi" }, limits: { cpu: "80m", memory: "512Mi" } }
 * "4x" - { requests: { cpu: "160m", memory: "1024Mi" }, limits: { cpu: "160m", memory: "1024Mi" } }
 * "5x" - { requests: { cpu: "320m", memory: "2048Mi" }, limits: { cpu: "320m", memory: "2048Mi" } }
 * "6x" - { requests: { cpu: "640m", memory: "4058Mi" }, limits: { cpu: "640m", memory: "4058Mi" } }
 * "7x" - { requests: { cpu: "1280m", memory: "2048Mi" }, limits: { cpu: "1280m", memory: "2048Mi" } }
 * "8x" - { requests: { cpu: "2560m", memory: "8116Mi" }, limits: { cpu: "2560m", memory: "8116Mi" } }
 * "9x" - { requests: { cpu: "5120m", memory: "16232Mi" }, limits: { cpu: "5120m", memory: "16232Mi" } }
 * "10x" - { requests: { cpu: "10024m", memory: "32464Mi" }, limits: { cpu: "10024m", memory: "32464Mi" } }
 */
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

// deploy status
export const deployStatusList = ["pending", "in_progress", "failed", "success", "cancelled"] as const;
export type DeployStatus = (typeof deployStatusList)[number];

// backup status
export const backupStatusList = ["start", "in_progress", "failed", "success", "cancelled"] as const;
export type BackupStatus = (typeof backupStatusList)[number];

/**
 * App status:
 * - `deploying`: App is being deployed.
 * - `healthy`: App's containers are running well.
 * - `partial_healthy`: Some of the app's containers are unhealthy.
 * - `undeployed`: App has not been deployed yet.
 * - `failed`: App's containers are unable to deploy due to image pull back-off or image pulling errors.
 * - `crashed`: App's containers are facing some unexpected errors.
 * - `unknown`: Other unknown errors.
 */
export const appStatusList = ["deploying", "healthy", "partial_healthy", "undeployed", "failed", "crashed", "unknown"] as const;
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
	active?: boolean;
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

/**
 * ### User access permission settings:
 * - `undefined`: all
 * - `[]`: none
 * - `[ ...project_id... ]`: some
 */
export type UserAccessPermissions = {
	projects?: string[];
	apps?: string[];
	clusters?: string[];
	databases?: string[];
	database_backups?: string[];
	gits?: string[];
	frameworks?: string[];
	container_registries?: string[];
};

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

	/**
	 * Active role ID in current workspace
	 */
	activeRole?: IRole;

	/**
	 * User access permission settings
	 */
	allowAccess?: UserAccessPermissions;
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
	is_org: boolean;
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

export interface GitRepoBranch {
	name: string;
	url: string;
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
	 * The Git workspace (ORG) of the Git provider.
	 *
	 * @type {string}
	 * @memberof IGitProvider
	 */
	org?: string;

	/**
	 * Alias of `org` field, will be remove soon.
	 * @deprecated
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
	 * - `TRUE` if the git provider which connected by "Administrator"
	 * - `FALSE` if it was connected by workspace's members and won't be displayed on the dashboard.
	 */
	isOrg?: boolean;

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

export interface IDeployEnvironment {
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
	 * Date when it's updated
	 */
	updatedAt?: Date;

	/**
	 * Date when it's put to sleep
	 */
	sleepAt?: Date;

	/**
	 * Date when it's awaken
	 */
	awakeAt?: Date;

	/**
	 * Date when it's taken down
	 */
	tookDownAt?: Date;

	/**
	 * Deployment's status
	 */
	status?: AppStatus;

	/**
	 * Amount of ready instances
	 */
	readyCount?: number;

	/**
	 * A screenshot URL from build success
	 */
	screenshot?: string;

	/**
	 * List of persistent volumes that attached to this deploy environment
	 */
	volumes: DeployEnvironmentVolume[];
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

export interface AppGitInfo {
	/**
	 * `REQUIRES`
	 * ---
	 * A SSH URI of the source code repository
	 * @example git@bitbucket.org:digitopvn/example-repo.git
	 */
	repoSSH: string;
	/**
	 * OPTIONAL
	 * ---
	 * A SSH URI of the source code repository
	 * @example https://bitbucket.org/digitopvn/example-repo
	 */
	repoURL?: string;
	/**
	 * OPTIONAL
	 * ---
	 * Git provider's type: `github`, `bitbucket`, `gitlab`
	 */
	provider?: GitProviderType;
}

export interface IApp extends IGeneral {
	/**
	 * The name of the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	name?: string;

	/**
	 * OPTIONAL: The image URI of this app on the Container Registry (without `TAG`).
	 *
	 * Combined from: `<registry-image-base-url>/<project-slug>/<app-name-slug>`
	 *
	 * **Don't** specify `tag` at the end! (e.g., `latest`, `beta`,...)
	 *
	 * @type {string}
	 * @memberof IApp
	 * @default <registry-image-base-url>/<project-slug>/<app-name-slug>
	 * @example "asia.gcr.io/my-workspace/my-project/my-app"
	 */
	image?: string;

	/**
	 * The slug of the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	slug?: string;

	/**
	 * The user who created the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	createdBy?: string;

	/**
	 * The user who last updated the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	lastUpdatedBy?: string;

	/**
	 * The Git information of the app.
	 *
	 * @type {AppGitInfo}
	 * @memberof IApp
	 */
	git?: AppGitInfo;

	/**
	 * The framework information of the app.
	 *
	 * @memberof IApp
	 */
	framework?: {
		name?: string;
		slug?: string;
		version?: string;
		repoURL?: string;
		repoSSH?: string;
	};

	/**
	 * The environment information of the app.
	 *
	 * @type {{ [key: string]: IDeployEnvironment | string }}
	 * @memberof IApp
	 * @deprecated
	 */
	environment?: { [key: string]: IDeployEnvironment | string };

	/**
	 * The deploy environment information of the app.
	 *
	 * @type {{ [key: string]: IDeployEnvironment }}
	 * @memberof IApp
	 */
	deployEnvironment?: { [key: string]: IDeployEnvironment };

	/**
	 * The latest build of the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	latestBuild?: string;

	/**
	 * Project of this app
	 */
	project?: string | IProject;

	/**
	 * The project slug of the app.
	 *
	 * @type {string}
	 * @memberof IApp
	 */
	projectSlug?: string;

	/**
	 * Git Provider of this app
	 */
	gitProvider?: string | IGitProvider | string;

	/**
	 * Date when the application was archived (take down all deploy environments)
	 */
	archivedAt?: Date;
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
	status?: BuildStatus;
	deployStatus?: DeployStatus;
	projectSlug?: string;
	appSlug?: string;

	/**
	 * CLI Version
	 */
	cliVersion?: string;
	/**
	 * Image tag is also "buildNumber"
	 */
	tag?: string;
	/**
	 * Build start time
	 */
	startTime?: Date;
	/**
	 * Build end time
	 */
	endTime?: Date;
	/**
	 * Build duration in miliseconds
	 */
	duration?: number;

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
	buildStatus?: BuildStatus;
	status?: DeployStatus;
	active?: boolean;
	message?: string;
	/**
	 * Deploy start time
	 */
	startTime?: Date;
	/**
	 * Deploy end time
	 */
	endTime?: Date;
	/**
	 * Deploy duration in miliseconds
	 */
	duration?: number;

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

// http methods
export const requestMethodList = ["GET", "POST", "PATCH", "DELETE"] as const;
export type RequestMethodType = (typeof requestMethodList)[number];

export const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type WeekDay = (typeof weekDays)[number];

export const cronjobRepeatUnitList = ["second", "minute", "hour", "day", "month", "year"] as const;
export type CronjobRepeatUnit = (typeof cronjobRepeatUnitList)[number];

// cronjob status
export const cronjobStatusList = ["failed", "success"] as const;
export type CronjobStatus = (typeof cronjobStatusList)[number];

export type CronjobRequest = {
	url?: string;
	method?: RequestMethodType;
	params?: Record<string, string>;
	body?: Record<string, string>;
	headers?: Record<string, string>;
};

export type CronjobRepeat = {
	range?: number;
	unit?: CronjobRepeatUnit;
};

export type CronjonRepeatCondition = {
	/**
	 * Array of hours from 0 to 23
	 */
	atHours?: number[];
	/**
	 * Array of minutes from 0 to 59
	 */
	atMins?: number[];
	/**
	 * Array of weekdays
	 */
	atWeekDays?: WeekDay[];
	/**
	 * Array of days from 1 to 31
	 */
	atDays?: number[];
	/**
	 * Array of days from 0 to 11
	 */
	atMonths?: number[];
};

export type CronjobHistory = {
	runAt: Date;
	status: CronjobStatus;
	responseStatus: string | number;
	message: string;
};

export interface ICronjob extends IBase {
	name?: string;
	// api request
	url?: string;
	method?: RequestMethodType;
	params?: Record<string, string>;
	body?: Record<string, string>;
	headers?: Record<string, string>;
	// schedule
	nextRunAt?: Date;
	repeat?: CronjobRepeat;
	repeatCondition?: CronjonRepeatCondition;
	// history
	history?: CronjobHistory[];
}
export type CronjobDto = Omit<ICronjob, keyof HiddenBodyKeys>;

export interface ICloudDatabase extends IBase {
	name?: string;
	verified?: boolean;
	type?: CloudDatabaseType;
	provider?: string;
	user?: string;
	pass?: string;
	host?: string;
	port?: number;
	url?: string;
	/**
	 * Cronjob ID
	 */
	autoBackup?: string | ICronjob;
}
export type CloudDatabaseDto = Omit<ICloudDatabase, keyof HiddenBodyKeys>;

export interface ICloudDatabaseBackup extends IBase {
	name?: string;
	status?: BackupStatus;
	/**
	 * Backup file path
	 */
	path?: string;
	/**
	 * Backup file URL
	 */
	url?: string;
	type?: CloudDatabaseType;
	dbSlug?: string;
	database?: string | ICloudDatabase;
}
export type CloudDatabaseBackupDto = Omit<ICloudDatabaseBackup, keyof HiddenBodyKeys>;

export interface ICloudStorage extends IBase {
	name?: string;
	verified?: boolean;
	provider?: CloudProviderType;
	/**
	 * The host (domain) of your cloud storage.
	 * @example "cdn.example.com"
	 */
	host?: string;
	/**
	 * Storage origin URL
	 * @example "https://storage.googleapis.com/<project-id>"
	 */
	origin?: string;
	/**
	 * Bucket name
	 */
	bucket?: string;
	/**
	 * Storage region
	 */
	region?: string;
	/**
	 * Authentication
	 */
	auth?: {
		/**
		 * ### NOTE: For Google Cloud Storage
		 * JSON string containing "client_email" and "private_key" properties, or the external account client options.
		 */
		service_account?: string;
		/**
		 * ### NOTE: For AWS S3 & DigitalOcean Space Storage
		 * Your AWS access key ID
		 */
		key_id?: string;
		/**
		 * ### NOTE: For AWS S3 & DigitalOcean Space Storage
		 * Your AWS secret access key
		 */
		key_secret?: string;
	};
}

export type DeployEnvironmentVolume = {
	/**
	 * Volume name
	 */
	name: string;
	/**
	 * Kubernetes node name
	 */
	node: string;
	/**
	 * Volume size
	 * @example "5Gi", "500Mi"
	 */
	size: string;
	/**
	 * Kubernetes Storage Class
	 */
	storageClass: string;
	/**
	 * Map directory on the host server to this volume
	 */
	// hostPath: string;
	/**
	 * Location of mapped directory inside the container into this volume
	 */
	mountPath: string;
};
