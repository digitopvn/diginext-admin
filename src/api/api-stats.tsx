import { useApi } from "./api";

export interface Stats {
	projects: number;
	apps: number;
	clusters: number;
	databases: number;
	db_backups: number;
	gits: number;
	registries: number;
	frameworks: number;
	users: number;
	builds: number;
	releases: number;
}

export interface SummaryStats {
	all: Stats;
	today: Stats;
	week: Stats;
	month: Stats;
}

export const useStatsVersionApi = () => {
	return useApi<{ version: string; location?: string }>(["stats", "version"], `/api/v1/stats/version`, {
		// cache for 30 mins
		staleTime: 30 * 60 * 1000,
	});
};

export const useStatsApi = () => {
	return useApi<SummaryStats>(["stats", "summary"], `/api/v1/stats/summary`);
};
