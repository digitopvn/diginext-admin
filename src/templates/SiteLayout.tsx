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
			{props.meta}

			{/* Sidebar here */}
			<MenuSider />

			<Layout className="transition-all" style={{ marginLeft: sidebarCollapsed ? 80 : 200 }}>
				{/* Page title & desc here */}
				<SiteHeader />

				<PageTitle />

				<div>{props.children}</div>

				{/* Page content here */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
