import type { KubeNode } from "@/types/KubeNode";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorNodeApi = (options?: ApiOptions) => {
	return useListApi<KubeNode>(["monitor-node", "list"], `/api/v1/monitor/nodes`, options);
};
