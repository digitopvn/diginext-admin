import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, IRelease } from "./api-types";

export const useReleaseListApi = (options?: ApiOptions) => {
	return useListApi<IRelease>(["releases"], `/api/v1/release`, options);
};

export const useReleaseApi = (id: string) => {
	return useItemApi<IRelease>(["releases"], `/api/v1/release`, id);
};

export const useReleaseCreateApi = (data: any) => {
	return useCreateApi<IRelease>(["releases"], `/api/v1/release`, data);
};

export const useReleaseUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<IRelease>(["releases"], `/api/v1/release`, filter, data);
};

export const useReleaseDeleteApi = (filter: any) => {
	return useDeleteApi<IRelease>(["releases"], `/api/v1/release`, filter);
};
