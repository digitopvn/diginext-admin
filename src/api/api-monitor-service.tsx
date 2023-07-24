import type { KubeService } from "@/types/KubeService";

import { useDeleteApi, useListApi } from "./api";
import type { ApiMonitorFilter, ApiMonitorOptions } from "./api-types";

export const useMonitorServiceApi = (options?: ApiMonitorOptions) => {
	return useListApi<KubeService>(["monitor-service", "list"], `/api/v1/monitor/services`, options);
};

export const useMonitorServiceDeleteApi = (options?: ApiMonitorOptions) => {
	return useDeleteApi<KubeService, ApiMonitorFilter>(["monitor-service", "delete"], `/api/v1/monitor/services`, options);
};
