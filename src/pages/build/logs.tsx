/* eslint-disable no-nested-ternary */

import dayjs from "dayjs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { useRouter } from "next/router";

import { BuildLogs } from "@/components/deployments/BuildLogs";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const humanrizerLang = new HumanizeDurationLanguage();
const humanrizer = new HumanizeDuration(humanrizerLang);

const BuildDetailPage = () => {
	const router = useRouter();

	return (
		<Main meta={<Meta title="Build Detail" description="View the details of your build logs." />}>
			{/* Page Content */}
			<div className="flex-auto overflow-hidden">
				<BuildLogs />
			</div>
		</Main>
	);
};

export default BuildDetailPage;
