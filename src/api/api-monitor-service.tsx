import type { KubeService } from "@/types/KubeService";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorServiceApi = (options?: ApiOptions) => {
	return useListApi<KubeService>(["monitor-service", "list"], `/api/v1/monitor/services`, options);
};
