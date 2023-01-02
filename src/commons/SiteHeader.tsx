import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
import React, { useEffect } from "react";

import { useLayoutProvider } from "@/providers/LayoutProvider";

const { Header } = Layout;

type ISiteHeaderProps = { onSidebarChange?: (value: boolean) => void };

export const SiteHeader = (props: ISiteHeaderProps = {}) => {
	const { onSidebarChange } = props;

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();

	useEffect(() => onSidebarChange && onSidebarChange(sidebarCollapsed), [sidebarCollapsed]);

	return (
		<Header
			className="w-full"
			style={{ position: "sticky", top: 0, paddingInline: 24, lineHeight: "48px", height: 48, zIndex: 100, background: colorBgContainer }}
		>
			{React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
				className: "trigger",
				onClick: () => toggleSidebar && toggleSidebar(),
			})}
		</Header>
	);
};
