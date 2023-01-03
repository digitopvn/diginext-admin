import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";

import { SiteLayout } from "@/layouts/SiteLayout";
import Compose from "@/providers/Compose";
import LayoutProvider from "@/providers/LayoutProvider";

type IMainProps = {
	meta: ReactNode;
	children: ReactNode;
};

const Main = (props: IMainProps) => {
	// TODO: auth here?

	return (
		<Compose components={[LayoutProvider]}>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<SiteLayout meta={props.meta}>{props.children}</SiteLayout>
			</ConfigProvider>
		</Compose>
	);
};

export { Main };
