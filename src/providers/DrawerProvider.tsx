import { useResponsive } from "ahooks";
import { Drawer } from "antd";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { useRouterQuery } from "@/plugins/useRouterQuery";

// import { useRouterQuery } from "@/plugins/useRouterQuery";

type DrawerContentParams = {
	title: string;
	content: any;
};

type DrawerOptions = {
	level: number;
};

type DrawerVisibility = {
	lv1: boolean;
	lv2: boolean;
};

type IDrawerContext = {
	drawerVisibility: DrawerVisibility;
	toggleDrawer: (lv: "lv1" | "lv2", value?: boolean) => void;
	showDrawer: (params: DrawerContentParams, options?: DrawerOptions) => void;
	closeDrawer: (lv?: "lv1" | "lv2") => void;
};

export const DrawerContext = createContext<IDrawerContext>({
	drawerVisibility: { lv1: false, lv2: false },
	toggleDrawer: (lv: "lv1" | "lv2", value?: boolean) => {},
	showDrawer: (params: DrawerContentParams, options?: DrawerOptions) => {},
	closeDrawer: (lv?: "lv1" | "lv2") => {},
});

export const DrawerProvider = (props: { children?: ReactNode } = {}) => {
	const [drawerVisibility, setDrawerVisibility] = useState<DrawerVisibility>({ lv1: false, lv2: false });
	const [content, setContent] = useState<DrawerContentParams>();
	const [contentLv2, setContentLv2] = useState<DrawerContentParams>();
	const [query, { setQuery, deleteQuery, deleteAllQueryKeys }] = useRouterQuery();
	const responsive = useResponsive();

	const toggleDrawer = (lv: "lv1" | "lv2" = "lv1", flag?: boolean) => {
		if (typeof flag !== "undefined")
			return setDrawerVisibility((_drawerVisibility) => {
				const newDrawerVisibitity = { ..._drawerVisibility };
				newDrawerVisibitity[lv] = flag;
				return newDrawerVisibitity;
			});

		return setDrawerVisibility((_drawerVisibility) => {
			const newDrawerVisibitity = { ..._drawerVisibility };
			newDrawerVisibitity[lv] = !_drawerVisibility[lv];
			return newDrawerVisibitity;
		});
	};

	const closeDrawer = (lv?: "lv1" | "lv2") => {
		if (lv) {
			deleteQuery([lv]);
			toggleDrawer(lv, false);
		} else {
			deleteAllQueryKeys();
			setDrawerVisibility({ lv1: false, lv2: false });
		}
	};

	const onCloseLv1 = () => {
		deleteAllQueryKeys();
		setDrawerVisibility((_drawerVisibility) => {
			return { ..._drawerVisibility, lv1: false };
		});
	};

	const onCloseLv2 = () => {
		deleteQuery(["lv2"]);
		setDrawerVisibility((_drawerVisibility) => {
			return { ..._drawerVisibility, lv2: false };
		});
	};

	const showDrawer = (params: DrawerContentParams, options?: DrawerOptions) => {
		switch (options?.level) {
			case 1:
				setContent(params);
				toggleDrawer("lv1", true);
				break;

			case 2:
				setContentLv2(params);
				toggleDrawer("lv2", true);
				break;

			default:
				break;
		}
	};

	return (
		<DrawerContext.Provider value={{ drawerVisibility, toggleDrawer, showDrawer, closeDrawer }}>
			{props.children}
			{/* LEVEL 1 */}
			<Drawer
				title={content?.title}
				placement="right"
				onClose={onCloseLv1}
				open={drawerVisibility.lv1}
				width={responsive?.md ? "70%" : "100%"}
				styles={{
					body: { overflow: "auto", overflowX: "hidden", flex: "auto", padding: 0 },
				}}
				destroyOnClose
			>
				{content?.content}

				{/* LEVEL 2 */}
				<Drawer
					title={contentLv2?.title}
					placement="right"
					onClose={onCloseLv2}
					open={drawerVisibility.lv2}
					width={responsive?.md ? "70%" : "100%"}
					styles={{
						body: { overflow: "auto", overflowX: "hidden", flex: "auto", padding: 0 },
					}}
					destroyOnClose
				>
					{contentLv2?.content}
				</Drawer>
			</Drawer>
		</DrawerContext.Provider>
	);
};

export const useDrawerProvider = () => {
	const context = useContext(DrawerContext);
	return context;
};

export default DrawerProvider;
