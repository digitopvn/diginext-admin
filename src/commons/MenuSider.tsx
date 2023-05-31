import {
	ApartmentOutlined,
	BranchesOutlined,
	CloudOutlined,
	CloudServerOutlined,
	ClusterOutlined,
	CodepenOutlined,
	DashboardOutlined,
	DatabaseOutlined,
	DeploymentUnitOutlined,
	LockOutlined,
	ProjectOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { trimEnd, trimStart } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useDarkMode } from "usehooks-ts";

import { useAuth } from "@/api/api-auth";
import type { IRole } from "@/api/api-types";
import { useLayoutProvider } from "@/providers/LayoutProvider";

const items: MenuProps["items"] = [
	{
		key: `menu/`,
		icon: <DashboardOutlined />,
		label: "Dashboard",
	},
	{
		key: `menu/project`,
		icon: <ProjectOutlined />,
		label: "Projects",
	},
	{
		key: `menu/framework`,
		icon: <CodepenOutlined />,
		label: "Frameworks",
	},
	{
		key: `menu/git`,
		icon: <BranchesOutlined />,
		label: "Git Providers",
	},
	{
		key: `menu/infrastructure`,
		icon: <DeploymentUnitOutlined />,
		label: "Infrastructure",
		children: [
			{
				key: `menu/infrastructure/cloud-provider`,
				icon: <CloudOutlined />,
				label: "Cloud Providers",
			},
			{
				key: `menu/infrastructure/cluster`,
				icon: <ClusterOutlined />,
				label: "K8S Clusters",
			},
			{
				key: `menu/infrastructure/database`,
				icon: <DatabaseOutlined />,
				label: "Databases",
			},
			{
				key: `menu/infrastructure/registry`,
				icon: <CloudServerOutlined />,
				label: "Container Registries",
			},
			// {
			// 	key: `menu/infrastructure/cloud-storage`,
			// 	icon: <HddOutlined />,
			// 	label: "Cloud Storage",
			// },
		],
	},
	{
		key: `menu/workspace`,
		icon: <ApartmentOutlined />,
		label: "Workspace",
		children: [
			{
				key: `menu/workspace/users`,
				icon: <UserOutlined />,
				label: "Users",
			},
			{
				key: `menu/workspace/teams`,
				icon: <TeamOutlined />,
				label: "Teams",
			},
			{
				key: `menu/workspace/roles`,
				icon: <LockOutlined />,
				label: "Roles",
			},
		],
	},
	{
		key: `menu/settings`,
		icon: <SettingOutlined />,
		label: "Settings",
	},
];

export const MenuSider = () => {
	const router = useRouter();
	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();
	const { isDarkMode } = useDarkMode();

	const [user] = useAuth();
	const userRoles = ((user?.roles as IRole[]) || []).filter((role) => role.workspace === user.activeWorkspace?._id);
	const activeRole = userRoles[0];
	// console.log("activeRole :>> ", activeRole);

	const pageLv0 = `menu/${trimStart(router.pathname, "/").split("/")[0]}`;
	const menuPath = `menu${trimEnd(router.pathname, "/")}`;
	// console.log("menuPath :>> ", menuPath);

	const isCollapsible = useMemo(
		() => typeof window !== "undefined" && window?.innerWidth >= 728,
		[typeof window !== "undefined" ? window?.innerWidth : null]
	);
	// console.log("isCollapsible :>> ", isCollapsible);

	useEffect(() => {
		if (typeof window !== "undefined" && window?.innerWidth < 728 && !sidebarCollapsed && toggleSidebar) toggleSidebar(true);
	}, [typeof window !== "undefined" ? window?.innerWidth : null]);

	const onMenuSelected: MenuProps["onSelect"] = (e) => {
		// console.log("e", e);
		const path = trimStart(e.key, "menu");
		router.push(path);
	};

	return (
		<Sider
			theme="light"
			collapsible={isCollapsible}
			collapsed={sidebarCollapsed}
			onCollapse={(value) => toggleSidebar && toggleSidebar(value)}
			style={{
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				left: 0,
				top: 0,
				bottom: 0,
			}}
		>
			{sidebarCollapsed ? (
				<div className="mx-auto my-5 w-[32px]">
					<Link href="/">
						<img
							src={
								isDarkMode
									? `${router.basePath}/assets/images/diginext-icon-white.svg`
									: `${router.basePath}/assets/images/diginext-icon-black.svg`
							}
							alt="Diginext Logo"
						/>
					</Link>
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<Link href="/">
						<img
							src={
								isDarkMode
									? `${router.basePath}/assets/images/diginext_logo_white.svg`
									: `${router.basePath}/assets/images/diginext_logo.svg`
							}
							alt="Diginext Logo"
						/>
					</Link>
				</div>
			)}

			<Menu
				mode="inline"
				inlineCollapsed={sidebarCollapsed}
				defaultOpenKeys={[pageLv0]}
				defaultSelectedKeys={[pageLv0, menuPath]}
				items={items}
				onSelect={onMenuSelected}
			/>
		</Sider>
	);
};
