import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ITeam } from "./api-types";

export const useTeamListApi = (options?: ApiOptions) => {
	return useListApi<ITeam>(["teams"], `/api/v1/team`, options);
};

export const useTeamApi = (id: string) => {
	return useItemApi<ITeam>(["teams"], `/api/v1/team`, id);
};

export const useTeamCreateApi = (data: any) => {
	return useCreateApi<ITeam>(["teams"], `/api/v1/team`, data);
};

export const useTeamUpdateApi = (filter: any, data: any) => {
	return useUpdateApi<ITeam>(["teams"], `/api/v1/team`, filter, data);
};

export const useTeamDeleteApi = (filter: any) => {
	return useDeleteApi<ITeam>(["teams"], `/api/v1/team`, filter);
};
