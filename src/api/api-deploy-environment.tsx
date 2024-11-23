import { useListApi } from "./api";
import type { ApiOptions, IApp, IDeployEnvironment } from "./api-types";

export const useDeployEnvironmentListApi = (options?: ApiOptions) => {
	return useListApi<IDeployEnvironment & { name: string; app: IApp }>(["deploy-environments", "list"], `/api/v1/deploy-environment`, options);
};
