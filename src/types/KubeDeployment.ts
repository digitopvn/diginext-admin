import type { ResourceQuotaSize } from "@/api/api-types";

import type { IResourceQuota } from "./IKube";

export interface KubeDeployment {
	apiVersion?: string;
	kind?: string;
	metadata?: {
		creationTimestamp?: string;
		name?: string;
		namespace?: string;
		labels: {
			[key: string]: string;
		};
		uid?: string;
	};
	spec?: {
		replicas?: number;
		selector?: {
			matchLabels?: {
				app?: string;
			};
		};
		template?: {
			metadata?: {
				labels?: {
					owner?: string;
					app?: string;
					project?: string;
				};
			};
			spec?: {
				containers?: {
					name?: string;
					image?: string;
					ports?: { containerPort?: number }[];
					resources?: IResourceQuota;
					env?: { name?: string; value?: any }[];
				}[];
				imagePullSecrets?: { name?: string }[];
			};
		};
	};
	status?: {
		conditions?: {
			lastTransitionTime?: string;
			lastUpdateTime?: string;
			message?: string;
			reason?: string;
			status?: string;
			type?: string;
		}[];
		observedGeneration?: number;
		replicas?: number;
		readyReplicas?: number;
		unavailableReplicas?: number;
		availableReplicas?: number;
		updatedReplicas?: number;
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
	/**
	 * Usage
	 */
	cpuAvg?: string;
	cpuCapacity?: string;
	cpuRecommend?: string;
	memoryAvg?: string;
	memoryCapacity?: string;
	memoryRecommend?: string;
	size?: ResourceQuotaSize;
}
