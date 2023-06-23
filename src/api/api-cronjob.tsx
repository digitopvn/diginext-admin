import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ICronjob } from "./api-types";

export const useCronjobListApi = (options?: ApiOptions) => {
	return useListApi<ICronjob>(["cronjobs", "list"], `/api/v1/cronjob`, options);
};

export const useCronjobApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ICronjob>(["cronjobs", id], `/api/v1/cronjob`, id, options);
};

export const useCronjobSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<ICronjob>(["cronjobs", slug], `/api/v1/cronjob`, slug, options);
};

export const useCronjobCreateApi = (options?: ApiOptions) => {
	return useCreateApi<ICronjob>(["cronjobs"], `/api/v1/cronjob`, options);
};

export const useCronjobUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ICronjob>(["cronjobs"], `/api/v1/cronjob`, options);
};

export const useCronjobDeleteApi = () => {
	return useDeleteApi<ICronjob>(["cronjobs"], `/api/v1/cronjob`);
};

export const useCronjobScheduleAtApi = (options?: ApiOptions) => {
	return useCreateApi<ICronjob>(["cronjobs"], `/api/v1/cronjob/schedule-at`, options);
};

export const useCronjobScheduleRepeatApi = (options?: ApiOptions) => {
	return useCreateApi<ICronjob>(["cronjobs"], `/api/v1/cronjob/schedule-repeat`, options);
};

export const useCronjobCancelApi = (options?: ApiOptions) => {
	return useDeleteApi<ICronjob>(["cronjobs"], `/api/v1/cronjob/cancel`, options);
};
