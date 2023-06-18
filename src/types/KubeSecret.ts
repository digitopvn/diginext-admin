export interface KubeSecret {
	apiVersion?: string;
	kind?: "Secret";
	type?: string;
	metadata?: {
		name?: string;
		namespace?: string;
		creationTimestamp?: string;
		uid?: string;
	};
	data?: {
		[key: string]: string;
	};
	// extras
	clusterShortName?: string;
	/**
	 * Cluster ID
	 */
	cluster?: string;
	/**
	 * Workspace ID
	 */
	workspace?: string;
}
