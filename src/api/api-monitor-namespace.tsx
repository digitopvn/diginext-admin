import type { KubeNamespace } from "@/types/KubeNamespace";

import { useDeleteApi, useListApi } from "./api";
import type { ApiMonitorFilter, ApiMonitorOptions } from "./api-types";

export const useMonitorNamespaceApi = (options?: Omit<ApiMonitorOptions, "namespace">) => {
	return useListApi<KubeNamespace>(["monitor-namespace", "list"], `/api/v1/monitor/namespaces`, options);
};

export const useMonitorNamespaceDeleteApi = (options?: ApiMonitorOptions) => {
	return useDeleteApi<KubeNamespace, Omit<ApiMonitorFilter, "namespace">>(["monitor-namespace", "delete"], `/api/v1/monitor/namespaces`, options);
};
