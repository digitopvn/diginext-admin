import { useCreateApi, useDeleteApi, useItemApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ITeam } from "./api-types";

export const useTeamListApi = (options?: ApiOptions) => {
	return useListApi<ITeam>(["teams"], `/api/v1/team`, options);
};

export const useTeamApi = (id: string) => {
	return useItemApi<ITeam>(["teams"], `/api/v1/team`, id);
};

export const useTeamCreateApi = () => {
	return useCreateApi<ITeam>(["teams"], `/api/v1/team`);
};

export const useTeamUpdateApi = () => {
	return useUpdateApi<ITeam>(["teams"], `/api/v1/team`);
};

export const useTeamDeleteApi = () => {
	return useDeleteApi<ITeam>(["teams"], `/api/v1/team`);
};
