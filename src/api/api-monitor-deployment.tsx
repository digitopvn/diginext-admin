import type { KubeDeployment } from "@/types/KubeDeployment";

import { useDeleteApi, useListApi } from "./api";
import type { ApiMonitorFilter, ApiMonitorOptions } from "./api-types";

export const useMonitorDeploymentApi = (options?: ApiMonitorOptions) => {
	return useListApi<KubeDeployment>(["monitor-deployment", "list"], `/api/v1/monitor/deployments`, options);
};

export const useMonitorDeploymentDeleteApi = (options?: ApiMonitorOptions) => {
	return useDeleteApi<KubeDeployment, ApiMonitorFilter>(["monitor-deployment", "delete"], `/api/v1/monitor/deployments`, options);
};
