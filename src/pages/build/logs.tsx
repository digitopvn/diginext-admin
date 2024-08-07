/* eslint-disable no-nested-ternary */

import dayjs from "dayjs";

import { useAuthApi } from "@/api/api-auth";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const BuildDetailPage = () => {
	const auth = useAuthApi();

	return (
		<Main meta={<Meta title="Build Detail" description="View the details of your build logs." />} useSidebar={auth.status === "success"}>
			{/* Page Content */}
			<div className="flex-auto overflow-hidden">
				<BuildLogs />
			</div>
		</Main>
	);
};

export default BuildDetailPage;
