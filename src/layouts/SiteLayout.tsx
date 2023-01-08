import { Layout, theme } from "antd";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { MenuSider } from "@/commons/MenuSider";
import { PageFooter } from "@/commons/PageFooter";
import { SiteHeader } from "@/commons/SiteHeader";
import { BuildList } from "@/components/deployments/BuildList";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import { ReleaseList } from "@/components/deployments/ReleaseList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";
import { useLayoutProvider } from "@/providers/LayoutProvider";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
	showMenu?: boolean;
};

export const SiteLayout = (props: ISiteLayoutProps) => {
	const router = useRouter();
	const { sidebarCollapsed } = useLayoutProvider();

	// handling Drawers
	const drawer = useDrawerProvider();
	const { drawerVisibility, showDrawer, closeDrawer } = drawer;

	const [query, { setQuery, deleteQuery }] = useRouterQuery();
	const { lv1, lv2, project, app, env } = query;

	const {
		token: { colorText },
	} = theme.useToken();

	const openBuildList = (_project: string, _app: string, _env: string) => {
		if (showDrawer) showDrawer({ title: "Builds", content: <BuildList /> }, { level: 1 });
	};

	const openReleaseList = (_project: string, _app: string, _env: string) => {
		if (showDrawer) showDrawer({ title: "Releases", content: <ReleaseList /> }, { level: 1 });
	};

	const openBuildLogs = () => {
		if (showDrawer) showDrawer({ title: "Build Logs", content: <BuildLogs /> }, { level: 2 });
	};

	useEffect(() => {
		console.log("lv1 :>> ", lv1);
		switch (lv1) {
			case "build":
				if (!project || !app || !env) return;
				openBuildList(project, app, env);
				break;

			case "release":
				if (!project || !app || !env) return;
				openReleaseList(project, app, env);
				break;

			default:
				// close drawer lv1
				if (closeDrawer) closeDrawer("lv1");
				break;
		}

		switch (lv2) {
			case "build_logs":
				openBuildLogs();
				break;

			default:
				// close drawer lv2
				if (closeDrawer) closeDrawer("lv2");
				break;
		}
	}, [lv1, lv2, project, app, env]);

	useEffect(() => {
		if (!drawerVisibility?.lv1) deleteQuery(["lv1", "project", "app", "env"]);
		if (!drawerVisibility?.lv2) deleteQuery(["lv2", "build_slug"]);
	}, [drawerVisibility?.lv1, drawerVisibility?.lv2]);

	return (
		<Layout hasSider>
			{/* Meta tags */}
			{props.meta}

			{/* Sidebar here */}
			<MenuSider />

			<Layout className="min-h-screen transition-all" style={{ marginLeft: sidebarCollapsed ? 80 : 200 }}>
				{/* Site Header */}
				<SiteHeader />

				{/* Page content here */}
				<div className="grow px-2">{props.children}</div>

				{/* Site/Page Footer */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
