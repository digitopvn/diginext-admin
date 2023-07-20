export interface KubeService {
	apiVersion?: string;
	kind?: "Service";
	metadata?: {
		creationTimestamp?: string;
		name?: string;
		namespace?: string;
		labels?: {
			[key: string]: string;
		};
		uid?: string;
	};
	spec?: {
		type?: string;
		ports?: { name?: string; port?: number; targetPort?: number; protocol?: string }[];
		selector?: any;
		sessionAffinity?: string;
		status?: {
			loadBalancer?: any;
		};
	};
	// extras
	clusterSlug?: string;
	/**
	 * Cluster ID
	 */
	cluster?: string;
	/**
	 * Workspace ID
	 */
	workspace?: string;
}
