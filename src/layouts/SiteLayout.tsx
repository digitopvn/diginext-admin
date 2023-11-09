import { Layout, theme } from "antd";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { MenuSider } from "@/commons/MenuSider";
import NewEditPage from "@/commons/NewEditPage";
import { PageFooter } from "@/commons/PageFooter";
import { SiteHeader } from "@/commons/SiteHeader";
import { DatabaseBackupList } from "@/components/databases/DatabaseBackupList";
import { AppLogs } from "@/components/deployments/AppLogs";
import { BuildList } from "@/components/deployments/BuildList";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import DeployEnvironment from "@/components/deployments/DeployEnvironment";
import DeploymentYaml from "@/components/deployments/DeploymentYaml";
import EnvVarsNewEdit from "@/components/deployments/EnvVarsNewEdit";
import { ReleaseList } from "@/components/deployments/ReleaseList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
	showMenu?: boolean;
	useSidebar: boolean;
};

export const SiteLayout = (props: ISiteLayoutProps) => {
	const { useSidebar } = props;

	// handling Drawers
	const drawer = useDrawerProvider();
	const { drawerVisibility, showDrawer, closeDrawer } = drawer;

	const [query, { setQuery, deleteQuery, deleteAllQueryKeys }] = useRouterQuery();
	const { lv1, lv2, type, slug, project, app, env } = query;

	const {
		token: { colorText },
	} = theme.useToken();

	const openBuildList = (level = 1) => {
		if (showDrawer)
			showDrawer(
				{
					title: "Builds",
					content: <BuildList />,
				},
				{ level }
			);
	};

	const openReleaseList = (level = 1) => {
		if (showDrawer) showDrawer({ title: "Releases", content: <ReleaseList /> }, { level });
	};

	const openBuildLogs = (level = 1) => {
		if (showDrawer)
			showDrawer(
				{
					title: "Build Logs",
					content: (
						// <div className="p-4 pt-6">
						<BuildLogs />
						// </div>
					),
				},
				{ level }
			);
	};

	const openEnvVarsPage = (level = 1) => {
		if (showDrawer) showDrawer({ title: "Environment Variables", content: <EnvVarsNewEdit /> }, { level });
	};

	const openAppDeployEnvLogsPage = (level = 1) => {
		if (showDrawer) showDrawer({ title: `Application Logs (env: ${env || "unknown"})`, content: <AppLogs /> }, { level });
	};

	const openDeploymentYamlPage = (level = 1) => {
		if (showDrawer) showDrawer({ title: `Deployment YAML: ${env.toUpperCase()}`, content: <DeploymentYaml /> }, { level });
	};

	const openDeployEnvironment = (level = 1) => {
		if (showDrawer) showDrawer({ title: `Deploy Environment: ${env.toUpperCase()}`, content: <DeployEnvironment /> }, { level });
	};

	const openDbBackupList = (level = 1) => {
		if (showDrawer) showDrawer({ title: `Cloud Database Backups`, content: <DatabaseBackupList /> }, { level });
	};

	const openEditPage = (level = 1) => {
		if (showDrawer) showDrawer({ title: "Edit", content: <NewEditPage /> }, { level });
	};

	const openCreatePage = (level = 1) => {
		if (showDrawer) showDrawer({ title: "Create", content: <NewEditPage /> }, { level });
	};

	useEffect(() => {
		// console.log("lv1 :>> ", lv1);

		/**
		 * NOTE: Find in: <NewEditPage />
		 */

		switch (lv1) {
			case "build":
				openBuildList();
				break;

			case "build_logs":
				openBuildLogs(1);
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

			case "deploy_environment":
				openDeployEnvironment();
				break;

			case "env_vars":
				openEnvVarsPage();
				break;

			case "app_logs":
				openAppDeployEnvLogsPage();
				break;

			case "db_backups":
				openDbBackupList();
				break;

			default:
				// close drawer lv1
				deleteQuery(["lv1"]);
				if (closeDrawer) closeDrawer("lv1");
				break;
		}

		/**
		 * NOTE: Find in: <NewEditPage />
		 */
		switch (lv2) {
			case "build":
				openBuildList(2);
				break;

			case "build_logs":
				openBuildLogs(2);
				break;

			case "release":
				openReleaseList(2);
				break;

			case "app_logs":
				openAppDeployEnvLogsPage(2);
				break;

			case "env_vars":
				openEnvVarsPage(2);
				break;

			case "deployment_yaml":
				openDeploymentYamlPage(2);
				break;

			case "db_backups":
				openDbBackupList(2);
				break;

			default:
				// close drawer lv2
				deleteQuery(["lv2"]);
				if (closeDrawer) closeDrawer("lv2");
				break;
		}
	}, [lv1, lv2, project, app, env]);

	// useEffect(() => {
	// 	if (drawerVisibility?.lv1 === false) deleteQuery(["lv1"]);
	// 	if (drawerVisibility?.lv2 === false) deleteQuery(["lv2"]);
	// 	if (drawerVisibility?.lv1 === false && drawerVisibility?.lv2 === false) deleteAllQueryKeys();
	// }, [drawerVisibility?.lv1, drawerVisibility?.lv2]);

	return (
		<Layout hasSider className="full-height">
			{/* Meta tags */}
			{props.meta}

			{/* Sidebar here */}
			<div className="full-height fixed z-[102] overflow-visible md:relative md:overflow-y-auto md:overflow-x-hidden">
				{useSidebar && <MenuSider />}
			</div>

			<Layout className="full-height overflow-auto transition-all">
				{/* Site Header */}
				{useSidebar && <SiteHeader />}

				{/* Page content here */}
				<div className="flex flex-auto flex-col overflow-auto">{props.children}</div>

				{/* Site/Page Footer */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
