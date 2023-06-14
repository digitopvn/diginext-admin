/* eslint-disable no-nested-ternary */
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

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

	const [buildDuration, setBuildDuration] = useState("0");

	// console.log("router.asPath :>> ", router.asPath);
	// const { slugs = [] } = router.query;
	// const [buildSlug = ""] = slugs as string[];

	const [{ build_slug }] = useRouterQuery();
	// console.log("build_slug :>> ", build_slug);
	const { data: build } = useBuildSlugApi(build_slug);

	useInterval(
		() => {
			if (build?.startTime) setBuildDuration(humanrizer.humanize(dayjs(build.startTime).diff(dayjs()), { round: true }));
			if (build?.duration) setBuildDuration(humanrizer.humanize(build?.duration || 0, { round: true }));
		},
		build?.duration ? null : 1000
	);

	useEffect(() => {
		if (build?.duration) setBuildDuration(humanrizer.humanize(build?.duration || 0, { round: true }));
	}, [build?.duration]);

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
					<Tag key="cli-version" color="gold" icon={<ClockCircleOutlined />}>
						CLI: {build?.cliVersion || "unknown"}
					</Tag>,
					<Tag key="duration" color="gold" icon={<ClockCircleOutlined />}>
						Duration: {buildDuration}
					</Tag>,
					<Tag key="created-date" color="geekblue" icon={<CalendarOutlined />}>
						{dayjs(build?.createdAt).format("LLL")}
					</Tag>,
					<Tag
						key="status"
						color="green"
						icon={
							build?.status === "success" ? (
								<CheckCircleOutlined />
							) : build?.status === "building" ? (
								<LoadingOutlined />
							) : build?.status === "failed" ? (
								<ExclamationCircleOutlined />
							) : (
								<></>
							)
						}
					>
						{build?.status}
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
