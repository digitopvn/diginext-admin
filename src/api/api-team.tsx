import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ITeam } from "./api-types";

export const useTeamListApi = () => {
	return useListApi<ITeam>(["teams"], `/api/v1/team`);
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
