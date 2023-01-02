import type { ReactNode } from "react";

import Compose from "@/providers/Compose";
import LayoutProvider from "@/providers/LayoutProvider";

import { SiteLayout } from "./SiteLayout";

type IMainProps = {
	meta: ReactNode;
	children: ReactNode;
};

const Main = (props: IMainProps) => (
	<Compose components={[LayoutProvider]}>
		<SiteLayout meta={props.meta}>{props.children}</SiteLayout>
	</Compose>
);

export { Main };
