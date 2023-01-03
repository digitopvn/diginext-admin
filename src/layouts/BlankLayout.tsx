import { Layout } from "antd";
import type { ReactNode } from "react";

import { PageFooter } from "@/commons/PageFooter";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
};

export const BlankLayout = (props: ISiteLayoutProps) => {
	return (
		<Layout className="flex min-h-screen flex-col">
			{/* Meta tags */}
			{props.meta}

			{/* Page content here */}
			<div className="grow px-2">{props.children}</div>

			{/* Site/Page Footer */}
			<PageFooter />
		</Layout>
	);
};
