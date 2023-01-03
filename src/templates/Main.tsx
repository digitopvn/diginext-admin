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
			<SiteLayout meta={props.meta}>{props.children}</SiteLayout>
		</Compose>
	);
};

export { Main };
