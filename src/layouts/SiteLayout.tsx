import { Layout, theme } from "antd";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { MenuSider } from "@/commons/MenuSider";
import NewEditPage from "@/commons/NewEditPage";
import { PageFooter } from "@/commons/PageFooter";
import { SiteHeader } from "@/commons/SiteHeader";
import { BuildList } from "@/components/deployments/BuildList";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import EnvVarsNewEdit from "@/components/deployments/EnvVarsNewEdit";
import { ReleaseList } from "@/components/deployments/ReleaseList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";
import { useLayoutProvider } from "@/providers/LayoutProvider";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
	showMenu?: boolean;
	useSidebar: boolean;
};

export const SiteLayout = (props: ISiteLayoutProps) => {
	const { useSidebar } = props;
	const router = useRouter();
	const { sidebarCollapsed } = useLayoutProvider();
	let marginLeft: string | number = "auto";
	if (useSidebar) marginLeft = sidebarCollapsed ? 80 : 200;

	// handling Drawers
	const drawer = useDrawerProvider();
	const { drawerVisibility, showDrawer, closeDrawer } = drawer;

	const [query, { setQuery, deleteQuery, deleteAllQueryKeys }] = useRouterQuery();
	const { lv1, lv2, type, slug, project, app, env } = query;

	const {
		token: { colorText },
	} = theme.useToken();

	const openBuildList = () => {
		if (showDrawer) showDrawer({ title: "Builds", content: <BuildList /> }, { level: 1 });
	};

	const openReleaseList = () => {
		if (showDrawer) showDrawer({ title: "Releases", content: <ReleaseList /> }, { level: 1 });
	};

	const openBuildLogs = () => {
		if (showDrawer) showDrawer({ title: "Build Logs", content: <BuildLogs /> }, { level: 2 });
	};

	const openEnvVarsPage = () => {
		if (showDrawer) showDrawer({ title: "Environment Variables", content: <EnvVarsNewEdit /> }, { level: 1 });
	};

	const openEditPage = () => {
		if (showDrawer) showDrawer({ title: "Edit", content: <NewEditPage /> }, { level: 1 });
	};

	const openCreatePage = () => {
		if (showDrawer) showDrawer({ title: "Create", content: <NewEditPage /> }, { level: 1 });
	};

	useEffect(() => {
		// console.log("lv1 :>> ", lv1);
		switch (lv1) {
			case "build":
				openBuildList();
				break;

			case "release":
				openReleaseList();
				break;

			case "new":
				openCreatePage();
				break;

			case "edit":
				openEditPage();
				break;

			case "env_vars":
				openEnvVarsPage();
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
		if (drawerVisibility?.lv1 === false)
			deleteQuery([
				"lv1",
				"project",
				"app",
				"env",
				"release",
				"type",
				"cluster_slug",
				"framework_slug",
				"git_provider_slug",
				"registry_slug",
				"user",
				"role",
			]);
	}, [drawerVisibility?.lv1]);

	useEffect(() => {
		if (drawerVisibility?.lv2 === false) deleteQuery(["lv2", "build_slug"]);
	}, [drawerVisibility?.lv2]);

	return (
		<Layout hasSider>
			{/* Meta tags */}
			{props.meta}

			{/* Sidebar here */}
			{useSidebar && <MenuSider />}

			<Layout className="min-h-screen transition-all" style={{ marginLeft }}>
				{/* Site Header */}
				{useSidebar && <SiteHeader />}

				{/* Page content here */}
				<div className="grow px-2">{props.children}</div>

				{/* Site/Page Footer */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
