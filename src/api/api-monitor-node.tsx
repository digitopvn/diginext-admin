import type { KubeNode } from "@/types/KubeNode";

import { useListApi } from "./api";
import type { ApiMonitorOptions } from "./api-types";

export const useMonitorNodeApi = (options?: ApiMonitorOptions) => {
	return useListApi<KubeNode>(["monitor-node", "list"], `/api/v1/monitor/nodes`, options);
};
