import {
	ApartmentOutlined,
	BranchesOutlined,
	BuildOutlined,
	ClockCircleOutlined,
	CloudOutlined,
	CloudServerOutlined,
	ClusterOutlined,
	CodepenOutlined,
	DashboardOutlined,
	DatabaseOutlined,
	DeploymentUnitOutlined,
	FundOutlined,
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
import { trimEnd, trimStart } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
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
		label: "Projects & apps",
	},
	{
		key: `menu/build`,
		icon: <BuildOutlined />,
		label: "Builds & deploys",
	},
	// {
	// 	key: `menu/release`,
	// 	icon: <RocketOutlined />,
	// 	label: "Releases",
	// },
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
		key: `menu/cronjob`,
		icon: <ClockCircleOutlined />,
		label: "Cronjobs",
	},
	{
		key: `menu/monitor`,
		icon: <FundOutlined />,
		label: "Monitoring",
		children: [
			{
				key: `menu/monitor/cluster`,
				label: "Clusters",
				disabled: true,
			},
			{
				key: `menu/monitor/node`,
				label: "Nodes",
			},
			{
				key: `menu/monitor/namespace`,
				label: "Namespaces",
			},
			{
				key: `menu/monitor/service`,
				label: "Services",
			},
			{
				key: `menu/monitor/ingress`,
				label: "Ingresses",
			},
			{
				key: `menu/monitor/deployment`,
				label: "Deployments",
			},
			{
				key: `menu/monitor/pod`,
				label: "Pods",
			},
			{
				key: `menu/monitor/secret`,
				label: "Secrets",
				disabled: true,
			},
			{
				key: `menu/monitor/configmap`,
				label: "ConfigMaps",
				disabled: true,
			},
			{
				key: `menu/monitor/volume`,
				label: "Persistent Volumes",
				disabled: true,
			},
			{
				key: `menu/monitor/certmanager`,
				label: "Cert-Manager CRDs",
				disabled: true,
			},
		],
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
			{
				key: `menu/infrastructure/storage`,
				icon: <HddOutlined />,
				label: "Cloud Storages",
			},
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
	const { sidebarCollapsed, toggleSidebar, responsive } = useLayoutProvider();
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

	// logo
	const [logoSrc, setLogoSrc] = useState(`${router.basePath}/assets/images/diginext_logo_white.svg`);
	const [iconSrc, setIconSrc] = useState(`${router.basePath}/assets/images/diginext-icon-white.svg`);

	useEffect(() => {
		setLogoSrc(isDarkMode ? `${router.basePath}/assets/images/diginext_logo_white.svg` : `${router.basePath}/assets/images/diginext_logo.svg`);
		setIconSrc(
			isDarkMode ? `${router.basePath}/assets/images/diginext-icon-white.svg` : `${router.basePath}/assets/images/diginext-icon-black.svg`
		);
	}, [isDarkMode]);

	// mount
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted ? (
		<Sider
			theme="light"
			collapsible={isCollapsible}
			collapsed={sidebarCollapsed}
			onCollapse={(value) => toggleSidebar && toggleSidebar(value)}
			breakpoint="lg"
			width={250}
			style={{ height: "100%" }}
			collapsedWidth={responsive?.md ? "50" : "0"}
		>
			{sidebarCollapsed ? (
				<div className="mx-auto my-5 w-[32px]">
					<Link href="/">
						<img src={iconSrc} alt="Diginext Logo" />
					</Link>
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<Link href="/">
						<img src={logoSrc} alt="Diginext Logo" />
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
				// className="md:w-[250px] md:min-w-[250px] md:max-w-[250px] md:flex-[0_0_250px]"
			/>
		</Sider>
	) : null;
};
