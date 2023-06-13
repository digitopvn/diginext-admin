import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { useRouter } from "next/router";

import { useBuildSlugApi } from "@/api/api-build";
import { PageTitle } from "@/commons/PageTitle";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import { useRouterQuery } from "@/plugins/useRouterQuery";
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

	// console.log("router.asPath :>> ", router.asPath);
	// const { slugs = [] } = router.query;
	// const [buildSlug = ""] = slugs as string[];

	const [{ build_slug }] = useRouterQuery();
	// console.log("build_slug :>> ", build_slug);
	const { data: build } = useBuildSlugApi(build_slug);

	if (!router.isReady || !build_slug) return <></>;

	return (
		<Main meta={<Meta title="Build Detail" description="View the details of your build logs." />}>
			{/* Page title & desc here */}
			<PageTitle
				title={`Build Logs: ${build_slug}`}
				breadcrumbs={[
					{ name: "Builds", url: "/build" },
					{ name: `Project "${build?.projectSlug}"` },
					{ name: `App "${build?.appSlug}"` },
					build?.env ? { name: `Env "${build?.env}"` } : {},
				]}
				actions={[
					<Tag key="duration" color="gold" icon={<ClockCircleOutlined />}>
						Duration: {humanrizer.humanize(build?.duration || 0, { round: true })}
					</Tag>,
					<Tag key="created-date" color="geekblue" icon={<CalendarOutlined />}>
						{dayjs(build?.createdAt).format("LLL")}
					</Tag>,
				]}
			/>

			{/* Page Content */}
			<div className="p-5">
				<BuildLogs />
			</div>
		</Main>
	);
};

export default BuildDetailPage;
