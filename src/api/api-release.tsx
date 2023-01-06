import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IRelease } from "./api-types";

export const useReleaseListApi = (options?: ApiOptions) => {
	return useListApi<IRelease>(["releases"], `/api/v1/release`, options);
};

export const useReleaseApi = (id: string, options?: ApiOptions) => {
	return useItemApi<IRelease>(["releases"], `/api/v1/release`, id, options);
};

export const useReleaseCreateApi = (options?: ApiOptions) => {
	return useCreateApi<IRelease>(["releases"], `/api/v1/release`, options);
};

export const useReleaseUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<IRelease>(["releases"], `/api/v1/release`, options);
};

export const useReleaseDeleteApi = (options?: ApiOptions) => {
	return useDeleteApi<IRelease>(["releases"], `/api/v1/release`, options);
};

// Roll out release
export const useReleaseRollOutApi = (filter: any = {}, options?: ApiOptions) => {
	return useUpdateApi<IRelease>(["releases"], `/api/v1/release/rollout`, filter, options);
};

// Create new release from a build
export const useCreateReleaseFromBuildApi = (options?: ApiOptions) => {
	return useCreateApi<IRelease>(["releases"], `/api/v1/release/from-build`, options);
};

// Preview PRE-RELEASE deployment
export const usePreviewPrereleaseApi = (options?: ApiOptions) => {
	return useUpdateApi<IRelease>(["releases"], `/api/v1/release/preview`, options);
};
