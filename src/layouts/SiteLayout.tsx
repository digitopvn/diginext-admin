import { Layout } from "antd";
import type { ReactNode } from "react";

import { MenuSider } from "@/commons/MenuSider";
import { PageFooter } from "@/commons/PageFooter";
import { PageTitle } from "@/commons/PageTitle";
import { SiteHeader } from "@/commons/SiteHeader";
import { useLayoutProvider } from "@/providers/LayoutProvider";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
	showMenu?: boolean;
};

export const SiteLayout = (props: ISiteLayoutProps) => {
	const { sidebarCollapsed } = useLayoutProvider();
	return (
		<Layout hasSider>
			{/* Meta tags */}
			{props.meta}

			{/* Sidebar here */}
			<MenuSider />

			<Layout className="min-h-screen transition-all" style={{ marginLeft: sidebarCollapsed ? 80 : 200 }}>
				{/* Site Header */}
				<SiteHeader />

				{/* Page title & desc here */}
				<PageTitle />

				{/* Page content here */}
				<div className="grow px-2">{props.children}</div>

				{/* Site/Page Footer */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
