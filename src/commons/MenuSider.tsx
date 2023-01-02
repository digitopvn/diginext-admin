import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { useRouter } from "next/router";

import { useLayoutProvider } from "@/providers/LayoutProvider";

const items: MenuProps["items"] = [
	{
		key: `menu-1`,
		icon: <UserOutlined />,
		label: "Menu 1",
	},
	{
		key: `menu-2`,
		icon: <UserOutlined />,
		label: "Menu 2",
	},
	{
		key: `menu-1`,
		icon: <UserOutlined />,
		label: "Menu 3",
	},
];

export const MenuSider = () => {
	const router = useRouter();
	const { sidebarCollapsed } = useLayoutProvider();
	return (
		<Sider
			theme="light"
			collapsible
			collapsed={sidebarCollapsed}
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
