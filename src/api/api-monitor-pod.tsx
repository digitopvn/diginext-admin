import type { KubePod } from "@/types/KubePod";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorPodApi = (options?: ApiOptions) => {
	return useListApi<KubePod>(["monitor-pod", "list"], `/api/v1/monitor/pods`, options);
};
