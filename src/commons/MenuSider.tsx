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
import { useRouter } from "next/router";
import { useDarkMode } from "usehooks-ts";

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
			{
				key: `menu/workspace/settings`,
				icon: <SettingOutlined />,
				label: "Settings",
			},
		],
	},
];

export const MenuSider = () => {
	const router = useRouter();
	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();
	const { isDarkMode } = useDarkMode();

	const pageLv0 = `menu/${trimStart(router.pathname, "/").split("/")[0]}`;
	const menuPath = `menu${trimEnd(router.pathname, "/")}`;
	// console.log("menuPath :>> ", menuPath);

	const onMenuSelected: MenuProps["onSelect"] = (e) => {
		// console.log("e", e);
		const path = trimStart(e.key, "menu");
		router.push(path);
	};

	return (
		<Sider
			theme="light"
			collapsible
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
				<div className="mx-auto my-5 w-8">
					<img
						src={
							isDarkMode
								? `${router.basePath}/assets/images/diginext-icon-white.svg`
								: `${router.basePath}/assets/images/diginext-icon-black.svg`
						}
						alt="Diginext Logo"
					/>
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<img
						src={
							isDarkMode
								? `${router.basePath}/assets/images/diginext_logo_white.svg`
								: `${router.basePath}/assets/images/diginext_logo.svg`
						}
						alt="Diginext Logo"
					/>
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
