import Link from "next/link";
import type { ReactNode } from "react";

import { useStatsVersionApi } from "@/api/api-stats";
import { AppConfig } from "@/utils/AppConfig";

export const PageFooter = (props: { children?: ReactNode } = {}) => {
	const { data } = useStatsVersionApi();
	return (
		<div>
			{props.children}
			<div className="border-t border-gray-300 py-4 text-center text-xs">
				Version <strong className="text-brand">{data?.data?.version}</strong>
				<br />
				Copyright {new Date().getFullYear()} ©{" "}
				<Link href="https://diginext.site/?ref=diginext-dashboard" target="_blank">
					{AppConfig.title.toUpperCase()}
				</Link>
				. Powered by{" "}
				<a href="https://wearetopgroup.com/en?ref=diginext-dashboard" target="_blank" rel="noreferrer">
					TOP GROUP
				</a>
				.
			</div>
		</div>
	);
};
