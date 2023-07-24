import type { KubePod } from "@/types/KubePod";

import { useDeleteApi, useListApi } from "./api";
import type { ApiMonitorFilter, ApiMonitorOptions } from "./api-types";

export const useMonitorPodApi = (options?: ApiMonitorOptions) => {
	return useListApi<KubePod>(["monitor-pod", "list"], `/api/v1/monitor/pods`, options);
};

export const useMonitorPodDeleteApi = (options?: ApiMonitorOptions) => {
	return useDeleteApi<KubePod, ApiMonitorFilter>(["monitor-pod", "delete"], `/api/v1/monitor/pods`, options);
};
