import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	CodeOutlined,
	EyeOutlined,
	InfoCircleOutlined,
	LoadingOutlined,
	RocketOutlined,
	StopOutlined,
} from "@ant-design/icons";
import { useSize } from "ahooks";
import { App, Button, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

import { useBuildListApi, useBuildStopApi } from "@/api/api-build";
import { useDeployFromAppApi, useDeployFromGitApi } from "@/api/api-deploy";
import { useCreateReleaseFromBuildApi } from "@/api/api-release";
import type { IBuild, IRelease, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const humanrizerLang = new HumanizeDurationLanguage();
const humanrizer = new HumanizeDuration(humanrizerLang);

const { useApp } = App;

interface DataType {
	id?: string;
	key?: React.Key;
	children?: DataType[];
}

const pageSize = 100;

type IBuildListProps = {
	project: string;
	app: string;
	env: string;
};

export const BuildList = () => {
	// query params
	const router = useRouter();
	const root = useApp();
	const [query, { setQuery }] = useRouterQuery();
	const { project, app, env } = query;

	// configuration
	const columns: ColumnsType<IBuild & DataType> = [
		{
			title: "Name",
			width: 70,
			dataIndex: "name",
			key: "name",
			// fixed: "left",
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
			render: (value, record) => (
				<>
					<p>
						<Link
							href={!record.env ? `/build/logs?build_slug=${record.slug}` : `/build/logs?build_slug=${record.slug}&env=${record.env}`}
						>
							<strong>{value}</strong>
						</Link>
					</p>
					<ul className="ml-4 list-disc">
						<li>
							Project: <Tag color="blue">{record.projectSlug}</Tag>
						</li>
						<li>
							App: <Tag color="cyan">{record.appSlug}</Tag>
						</li>
						{record.duration ? (
							<li>
								Duration:{" "}
								<Tag key="duration" color="gold" icon={<ClockCircleOutlined />}>
									{humanrizer.humanize(record.duration || 0, { round: true })}
								</Tag>
							</li>
						) : (
							<></>
						)}
						<li>
							Created{" "}
							<strong>
								<DateDisplay date={record.createdAt} />
							</strong>
						</li>
					</ul>
				</>
			),
		},
		{
			title: "Created by",
			dataIndex: "owner",
			key: "owner",
			width: 40,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.owner && ((record.owner as IUser).slug || "").indexOf(value.toString()) > -1) || true,
			render: (value) => <>{value?.name}</>,
		},
		{
			title: "Status",
			dataIndex: "status",
			// fixed: "right",
			key: "status",
			width: 30,
			filters: [{ text: "live", value: "live" }],
			render: (value) => {
				let color = "warning";
				let icon = <InfoCircleOutlined />;
				switch (value) {
					case "building":
						color = "processing";
						icon = <LoadingOutlined className="align-middle" />;
						break;
					case "failed":
						color = "error";
						icon = <CloseCircleOutlined className="align-middle" />;
						break;
					case "success":
						color = "success";
						icon = <CheckCircleOutlined className="align-middle" />;
						break;
					case "start":
					default:
						color = "default";
						icon = <InfoCircleOutlined />;
						break;
				}
				return (
					<Tag color={color} icon={icon}>
						{value}
					</Tag>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			width: 30,
			dataIndex: "action",
		},
	];

	const filter: any = {};
	if (project) filter.projectSlug = project;
	if (app) filter.appSlug = app;
	// if (env) filter.env = env;

	const [page, setPage] = useState(1);

	// APIs
	// const {} = useBuildSlugApi()
	const [buildAndDeployFromAppApi, buildAndDeployFromAppStatus] = useDeployFromAppApi();
	const [buildAndDeployFromGitApi, buildAndDeployFromGitStatus] = useDeployFromGitApi();
	const [stopBuildApi, stopBuildStatus] = useBuildStopApi();

	const { data, status } = useBuildListApi({ sort: "-createdAt", populate: "owner", pagination: { page, size: pageSize }, filter });
	const { list: builds, pagination } = data || {};
	const { total_items } = pagination || {};

	const openBuildLogs = (slug?: string, envStr?: string) => {
		const _query: any = { build_slug: slug };
		if (envStr) _query.env = envStr;

		if (!query.lv1) _query.lv1 = "build_logs";
		else _query.lv2 = "build_logs";

		setQuery(_query);
	};

	// release
	const [releaseCreateFromBuildApi] = useCreateReleaseFromBuildApi();
	const releaseBuild = async (buildId?: string) => {
		if (isEmpty(buildId)) {
			root.notification.error({
				message: `Failed to release the build.`,
				description: `Build not found: ${buildId}`,
				placement: "top",
			});
			return;
		}

		try {
			const createRes = await releaseCreateFromBuildApi({ build: buildId, env } as IRelease);

			if (createRes?.status) {
				const release = createRes?.data;
				root.notification.success({
					message: `Congrats, the release has been created successfully!`,
					description: (
						<>
							You can now preview it on <a href={`https://${release?.prereleaseUrl}`}>PRE-RELEASE</a> endpoint.
						</>
					),
					placement: "top",
				});
				return;
			}
		} catch (e) {
			console.error(`Could not process releasing this build:`, e);

			root.notification.error({
				message: `Failed to roll out.`,
				description: `Could not process releasing this build: ${e}`,
				placement: "top",
			});
		}
	};

	/**
	 * Re-run the build process.
	 * @param build - Build's slug
	 * @param deployEnv - Deploy environment: dev, prod,...
	 */
	const buildAndDeployAgain = async (build: string, deployEnv: string) => {
		// ...
	};

	/**
	 * Stop the current build.
	 * @param slug - Build's slug
	 */
	const stopBuild = async (slug?: string) => {
		const result = await stopBuildApi({ slug });
		console.log("[BuildList] stopBuild :>> ", result);

		if (!result?.status) {
			root.notification.error({
				message: `Failed to proceed.`,
				description: `Could not stop this build due to server issue. Please try again later.`,
				placement: "top",
			});
		}
	};

	const displayedBuilds = builds?.map((build) => {
		return {
			id: build._id,
			...build,
			action: (
				<Space.Compact>
					{build.status === "building" && (
						<Tooltip title="Stop building">
							<Button danger icon={<StopOutlined />} onClick={() => stopBuild(build?.slug)} />
						</Tooltip>
					)}
					<Tooltip title="View logs">
						<Button icon={<CodeOutlined />} onClick={() => openBuildLogs(build.slug, build.env)} />
					</Tooltip>
					<Tooltip title="Open image URL">
						<Button icon={<EyeOutlined />} href={`https://${build.image}`} target="_blank" />
					</Tooltip>
					{build.env === "prod" && (
						<Tooltip title="Create a release from this build">
							<Button icon={<RocketOutlined />} onClick={() => releaseBuild(build._id?.toString())} />
						</Tooltip>
					)}
				</Space.Compact>
			),
		} as IBuild & DataType;
	});

	// console.log({ builds });

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		// router.push(`${router.pathname}`, { query: { page: current ?? 1 } });
		setPage(current ?? 1);
	};

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title={`Builds (${total_items ?? "-"})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
			{/* Page Content */}
			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					size="small"
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedBuilds}
					scroll={{ x: 550, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
					sticky={{ offsetHeader: 0 }}
					pagination={{ current: page, pageSize, total: total_items, position: ["bottomCenter"] }}
					onChange={onTableChange}
				/>
			</div>
		</>
	);
};
