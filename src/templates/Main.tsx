import { App, ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";
import { useDarkMode } from "usehooks-ts";

import GtagScript from "@/commons/measure/GtagScript";
import { SiteLayout } from "@/layouts/SiteLayout";
import Compose from "@/providers/Compose";
import DrawerProvider from "@/providers/DrawerProvider";
import LayoutProvider from "@/providers/LayoutProvider";

type IMainProps = {
	meta?: ReactNode;
	children?: ReactNode;
	useSidebar?: boolean;
};

// const SiteLayout = dynamic(() => import("../layouts/SiteLayout").then((mod) => mod.SiteLayout), { ssr: false });

const Main = (props: IMainProps) => {
	const { isDarkMode } = useDarkMode();
	const { useSidebar = true } = props;

	return (
		<ConfigProvider
			theme={{
				hashed: false,
				algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
			}}
		>
			<App>
				<Compose components={[LayoutProvider, DrawerProvider]}>
					<SiteLayout meta={props.meta} useSidebar={useSidebar}>
						{props.children}
					</SiteLayout>
				</Compose>
			</App>

			{/* Tracking Code */}
			<GtagScript gaIds={["G-QC4124805Q"]} />
		</ConfigProvider>
	);
};

export { Main };
