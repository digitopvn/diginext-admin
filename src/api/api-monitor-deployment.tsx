import type { KubeDeployment } from "@/types/KubeDeployment";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorDeploymentApi = (options?: ApiOptions) => {
	return useListApi<KubeDeployment>(["monitor-deployment", "list"], `/api/v1/monitor/deployments`, options);
};
