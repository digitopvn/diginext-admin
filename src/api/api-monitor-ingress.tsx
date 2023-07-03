import type { KubeIngress } from "@/types/KubeIngress";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorIngressApi = (options?: ApiOptions) => {
	return useListApi<KubeIngress>(["monitor-ingress", "list"], `/api/v1/monitor/ingresses`, options);
};
