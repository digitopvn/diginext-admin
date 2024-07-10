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
		label: <Link href="/">Dashboard</Link>,
	},
	{
		key: `menu/project`,
		icon: <ProjectOutlined />,
		label: <Link href="/project">Projects & apps</Link>,
	},
	{
		key: `menu/build`,
		icon: <BuildOutlined />,
		// eslint-disable-next-line @next/next/no-html-link-for-pages
		label: <a href="/build">Builds & deploys</a>,
	},
	// {
	// 	key: `menu/release`,
	// 	icon: <RocketOutlined />,
	// 	label: <Link href="/">Releases</Link>,
	// },
	{
		key: `menu/framework`,
		icon: <CodepenOutlined />,
		label: <Link href="/framework">Frameworks</Link>,
	},
	{
		key: `menu/git`,
		icon: <BranchesOutlined />,
		label: <Link href="/git">Git Providers</Link>,
	},
	{
		key: `menu/cronjob`,
		icon: <ClockCircleOutlined />,
		label: <Link href="/cronjob">Cronjobs</Link>,
	},
	{
		key: `menu/monitor`,
		icon: <FundOutlined />,
		label: <>Monitoring</>,
		children: [
			// {
			// 	key: `menu/monitor/cluster`,
			// 	label: <Link href="/monitor/cluster">Clusters</Link>,
			// 	disabled: true,
			// },
			{
				key: `menu/monitor/node`,
				label: <Link href="/monitor/node">Nodes</Link>,
			},
			{
				key: `menu/monitor/namespace`,
				label: <Link href="/monitor/namespace">Namespaces</Link>,
			},
			{
				key: `menu/monitor/service`,
				label: <Link href="/monitor/service">Services</Link>,
			},
			{
				key: `menu/monitor/ingress`,
				label: <Link href="/monitor/ingress">Ingresses</Link>,
			},
			{
				key: `menu/monitor/deployment`,
				label: <Link href="/monitor/deployment">Deployments</Link>,
			},
			{
				key: `menu/monitor/pod`,
				label: <Link href="/monitor/pod">Pods</Link>,
			},
			{
				key: `menu/monitor/secret`,
				label: <Link href="/monitor/secret">Secrets</Link>,
				disabled: true,
			},
			{
				key: `menu/monitor/configmap`,
				label: <Link href="/monitor/configmap">ConfigMaps</Link>,
				disabled: true,
			},
			{
				key: `menu/monitor/volume`,
				label: <Link href="/monitor/volume">Persistent Volumes</Link>,
				disabled: true,
			},
			{
				key: `menu/monitor/certmanager`,
				label: <Link href="/monitor/certmanager">Cert-Manager CRDs</Link>,
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
				label: <Link href="/infrastructure/cloud-provider">Cloud Providers</Link>,
			},
			{
				key: `menu/infrastructure/cluster`,
				icon: <ClusterOutlined />,
				label: <Link href="/infrastructure/cluster">K8S Clusters</Link>,
			},
			{
				key: `menu/infrastructure/database`,
				icon: <DatabaseOutlined />,
				label: <Link href="/infrastructure/database">Databases</Link>,
			},
			{
				key: `menu/infrastructure/registry`,
				icon: <CloudServerOutlined />,
				label: <Link href="/infrastructure/registry">Container Registries</Link>,
			},
			{
				key: `menu/infrastructure/storage`,
				icon: <HddOutlined />,
				label: <Link href="/infrastructure/storage">Cloud Storages</Link>,
			},
		],
	},
	{
		key: `menu/workspace`,
		icon: <ApartmentOutlined />,
		label: <>Workspace</>,
		children: [
			{
				key: `menu/workspace/users`,
				icon: <UserOutlined />,
				label: <Link href="/workspace/users">Users</Link>,
			},
			{
				key: `menu/workspace/teams`,
				icon: <TeamOutlined />,
				label: <Link href="/workspace/teams">Teams</Link>,
			},
			{
				key: `menu/workspace/roles`,
				icon: <LockOutlined />,
				label: <Link href="/workspace/roles">Roles</Link>,
			},
		],
	},
	{
		key: `menu/settings`,
		icon: <SettingOutlined />,
		label: <Link href="/settings">Settings</Link>,
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
	// console.log("pageLv0 :>> ", pageLv0);
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
		if (path.startsWith("/build")) {
			if (typeof window !== "undefined") window.open(path, "_self");
		} else {
			router.push(path);
		}
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
					<Link href="/" legacyBehavior={true}>
						<img src={iconSrc} alt="Diginext Logo" />
					</Link>
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<Link href="/" legacyBehavior={true}>
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
				// onSelect={onMenuSelected}
				// className="md:w-[250px] md:min-w-[250px] md:max-w-[250px] md:flex-[0_0_250px]"
			/>
		</Sider>
	) : null;
};
