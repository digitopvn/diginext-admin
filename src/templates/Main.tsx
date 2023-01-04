import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";
import { useDarkMode } from "usehooks-ts";

import { SiteLayout } from "@/layouts/SiteLayout";
import Compose from "@/providers/Compose";
import LayoutProvider from "@/providers/LayoutProvider";

type IMainProps = {
	meta: ReactNode;
	children: ReactNode;
};

const Main = (props: IMainProps) => {
	const { isDarkMode } = useDarkMode();

	return (
		<Compose components={[LayoutProvider]}>
			<ConfigProvider
				theme={{
					algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
				}}
			>
				<SiteLayout meta={props.meta}>{props.children}</SiteLayout>
			</ConfigProvider>
		</Compose>
	);
};

export { Main };
