import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useRouterQuery = (): [any, { setQuery: (query?: any) => any; deleteQuery: (keys: string[]) => any; deleteAllQueryKeys: () => any }] => {
	const router = useRouter();

	const [routerQuery, setRouterQuery] = useState(router.query as any);

	const setQuery = (query: any = {}) => {
		const newQuery = { ...routerQuery, ...query };
		setRouterQuery(newQuery);
		router.push(`${router.pathname}`, { query: newQuery });
		return newQuery;
	};

	const deleteQuery = (keys: string[]) => {
		keys.forEach((key) => {
			delete routerQuery[key];
		});
		setRouterQuery(routerQuery);
		router.push(`${router.pathname}`, { query: routerQuery });
		return routerQuery;
	};

	const deleteAllQueryKeys = () => {
		const keys = Object.keys(routerQuery);
		return deleteQuery(keys);
	};

	useEffect(() => {
		if (!router.isReady) return;

		const routerPathQuery = router.asPath;
		if (routerPathQuery.indexOf("?") === -1) return;

		/**
		 * ! [Goon's note]
		 * Can't get "page" directly from "router.query" because of Next.js hydration & Automatic Static Optimization
		 * Learn more: https://nextjs.org/docs/advanced-features/automatic-static-optimization
		 * Below is the alternative solution! MAGIC!!!
		 */
		const urlParams = new URLSearchParams(routerPathQuery.split("?")[1]);
		const params = Object.fromEntries(urlParams);

		setRouterQuery(params);
		// setQuery((_query) => {
		// 	/**
		// 	 * ! Return the previous query object, not the new object!!!
		// 	 */
		// 	Object.entries(params).forEach(([key, val]) => {
		// 		// eslint-disable-next-line no-param-reassign
		// 		_query[key] = val;
		// 	});
		// 	return _query;
		// });
	}, [router.asPath, router.isReady]);

	return [routerQuery, { setQuery, deleteQuery, deleteAllQueryKeys }];
};
