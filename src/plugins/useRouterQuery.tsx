import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useRouterQuery = (): [any, { setQuery: (query?: any) => any; deleteQuery: (keys: string[]) => any; deleteAllQueryKeys: () => any }] => {
	const router = useRouter();

	const routerPathQuery = router.asPath;
	const urlParams = new URLSearchParams(router.asPath.split("?")[1]);
	const params = Object.fromEntries(urlParams);

	const [routerQuery, setRouterQuery] = useState(params);

	const setQuery = (query: any = {}) => {
		const newQuery = { ...routerQuery, ...query };
		setRouterQuery(newQuery);
		router.push(`${router.pathname}`, { query: newQuery });
		return newQuery;
	};

	const deleteQuery = (keys: string[]) => {
		const newQuery = { ...routerQuery };
		keys.forEach((key) => {
			delete newQuery[key];
		});
		setRouterQuery(newQuery);

		router.push(router.pathname, { query: newQuery });

		return routerQuery;
	};

	const deleteAllQueryKeys = () => {
		const keys = Object.keys(routerQuery);
		return deleteQuery(keys);
	};

	useEffect(() => {
		if (!router.isReady) return;

		if (routerPathQuery.indexOf("?") === -1) {
			deleteAllQueryKeys();
			return;
		}

		/**
		 * ! [Goon's note]
		 * Can't get "page" directly from "router.query" because of Next.js hydration & Automatic Static Optimization
		 * Learn more: https://nextjs.org/docs/advanced-features/automatic-static-optimization
		 * Below is the alternative solution! MAGIC!!!
		 */
		setRouterQuery(params);
	}, [router.asPath, router.isReady]);

	return [routerQuery, { setQuery, deleteQuery, deleteAllQueryKeys }];
};
