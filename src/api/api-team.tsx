import { useCreateApi, useDeleteApi, useItemApi, useItemSlugApi, useListApi, useUpdateApi } from "./api";
import type { ApiOptions, ITeam } from "./api-types";

export const useTeamListApi = (options?: ApiOptions) => {
	return useListApi<ITeam>(["teams", "list"], `/api/v1/team`, options);
};

export const useTeamApi = (id: string, options?: ApiOptions) => {
	return useItemApi<ITeam>(["teams", id], `/api/v1/team`, id, options);
};

export const useTeamSlugApi = (slug: string, options?: ApiOptions) => {
	return useItemSlugApi<ITeam>(["teams", slug], `/api/v1/team`, slug, options);
};

export const useTeamCreateApi = (options?: ApiOptions) => {
	return useCreateApi<ITeam>(["teams"], `/api/v1/team`, options);
};

export const useTeamUpdateApi = (options?: ApiOptions) => {
	return useUpdateApi<ITeam>(["teams"], `/api/v1/team`, options);
};

export const useTeamDeleteApi = () => {
	return useDeleteApi<ITeam>(["teams"], `/api/v1/team`);
};
