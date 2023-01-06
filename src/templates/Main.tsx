import { App, ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";
import { useDarkMode } from "usehooks-ts";

import { SiteLayout } from "@/layouts/SiteLayout";
import Compose from "@/providers/Compose";
import DrawerProvider from "@/providers/DrawerProvider";
import LayoutProvider from "@/providers/LayoutProvider";

type IMainProps = {
	meta: ReactNode;
	children: ReactNode;
};

const Main = (props: IMainProps) => {
	const { isDarkMode } = useDarkMode();

	return (
		<Compose components={[LayoutProvider, DrawerProvider]}>
			<ConfigProvider
				theme={{
					algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
				}}
			>
				<App>
					<SiteLayout meta={props.meta}>{props.children}</SiteLayout>
				</App>
			</ConfigProvider>
		</Compose>
	);
};

export { Main };
