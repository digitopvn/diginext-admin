import type { KubeIngress } from "@/types/KubeIngress";

import { useDeleteApi, useListApi } from "./api";
import type { ApiMonitorFilter, ApiMonitorOptions } from "./api-types";

export const useMonitorIngressApi = (options?: ApiMonitorOptions) => {
	return useListApi<KubeIngress>(["monitor-ingress", "list"], `/api/v1/monitor/ingresses`, options);
};

export const useMonitorIngressDeleteApi = (options?: ApiMonitorOptions) => {
	return useDeleteApi<KubeIngress, ApiMonitorFilter>(["monitor-ingress", "delete"], `/api/v1/monitor/ingresses`, options);
};
