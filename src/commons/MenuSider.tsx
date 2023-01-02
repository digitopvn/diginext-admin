import {
	BranchesOutlined,
	CloudOutlined,
	CloudServerOutlined,
	ClusterOutlined,
	CodepenOutlined,
	DashboardOutlined,
	DatabaseOutlined,
	DeploymentUnitOutlined,
	HddOutlined,
	LockOutlined,
	ProjectOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useRouter } from "next/router";

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
		label: "Git Providers",
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
				key: `menu/infrastructure/cloud-provider`,
				icon: <CloudServerOutlined />,
				label: "Container Registries",
			},
			{
				key: `menu/infrastructure/cloud-provider`,
				icon: <HddOutlined />,
				label: "Cloud Storage",
			},
		],
	},
	{
		key: `menu/workspace`,
		icon: <DeploymentUnitOutlined />,
		label: "Workspace",
		children: [
			{
				key: `menu/workspace/user`,
				icon: <UserOutlined />,
				label: "Users",
			},
			{
				key: `menu/workspace/team`,
				icon: <TeamOutlined />,
				label: "Teams",
			},
			{
				key: `menu/workspace/role`,
				icon: <LockOutlined />,
				label: "Roles",
			},
			{
				key: `menu/workspace/setting`,
				icon: <SettingOutlined />,
				label: "Settings",
			},
		],
	},
];

export const MenuSider = () => {
	const router = useRouter();
	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();
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
					<img src={`${router.basePath}/assets/images/diginext-icon-black.svg`} alt="Diginext Logo" />
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<img src={`${router.basePath}/assets/images/diginext_logo.svg`} alt="Diginext Logo" />
				</div>
			)}

			<Menu mode="inline" inlineCollapsed={sidebarCollapsed} defaultSelectedKeys={["4"]} items={items} />
		</Sider>
	);
};
