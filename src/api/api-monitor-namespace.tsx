import type { KubeNamespace } from "@/types/KubeNamespace";

import { useListApi } from "./api";
import type { ApiOptions } from "./api-types";

export const useMonitorNamespaceApi = (options?: ApiOptions) => {
	return useListApi<KubeNamespace>(["monitor-namespace", "list"], `/api/v1/monitor/namespaces`, options);
};
