import { Drawer } from "antd";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { useRouterQuery } from "@/plugins/useRouterQuery";

type IDrawerContext = {
	drawerVisibility: boolean;
	toggleDrawer?: (value?: boolean) => void;
	onClose?: () => void;
};

export const DrawerContext = createContext<IDrawerContext>({ drawerVisibility: false });

export const DrawerProvider = (props: { children?: ReactNode } = {}) => {
	const [drawerVisibility, setDrawerVisibility] = useState(false);

	const [query, { setQuery, deleteQuery, deleteAllQueryKeys }] = useRouterQuery();
	const { type } = query;

	const toggleDrawer = (flag?: boolean) => {
		if (typeof flag !== "undefined") return setDrawerVisibility(flag);
		return setDrawerVisibility((_opened) => !_opened);
	};

	const onClose = () => {
		setDrawerVisibility(false);
		deleteAllQueryKeys();
		// deleteQuery(["type", "project", "app", "env"]);
	};

	return (
		<DrawerContext.Provider value={{ drawerVisibility, toggleDrawer, onClose }}>
			{props.children}
			<Drawer title={query.type === "build" ? "Builds" : "Releases"} placement="right" onClose={onClose} open={drawerVisibility} size="large">
				{/* {query.type === "build" && <BuildList project={query.project} app={query.app} env={query.env} />} */}
			</Drawer>
		</DrawerContext.Provider>
	);
};

export const useLayoutProvider = () => {
	const context = useContext(DrawerContext);
	return context;
};

export default DrawerProvider;
