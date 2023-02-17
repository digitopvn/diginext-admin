import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	CodeOutlined,
	EyeOutlined,
	InfoCircleOutlined,
	LoadingOutlined,
	RocketOutlined,
	StopOutlined,
} from "@ant-design/icons";
import { App, Button, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useBuildListApi, useBuildStopApi } from "@/api/api-build";
import { useCreateReleaseFromBuildApi } from "@/api/api-release";
import type { IBuild, IRelease, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const { useApp } = App;

interface DataType {
	id?: string;
	key?: React.Key;
	children?: DataType[];
}

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
					<Link href={{ pathname: `/build/[...slugs]`, query: { slugs: [record.slug as string] } }}>
						<strong>{value}</strong>
					</Link>
				</p>
				<p>
					Created <DateDisplay date={record.createdAt} />
				</p>
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
	// {
	// 	title: "Created at",
	// 	dataIndex: "createdAt",
	// 	key: "createdAt",
	// 	width: 50,
	// 	render: (value) => <DateDisplay date={value} />,
	// 	sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
	// },
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

const pageSize = 100;

type IBuildListProps = {
	project: string;
	app: string;
	env: string;
};

export const BuildList = () => {
	const router = useRouter();
	const root = useApp();

	const [query, { setQuery }] = useRouterQuery();
	const { project, app, env } = query;

	const filter: any = {};
	if (project) filter.projectSlug = project;
	if (app) filter.appSlug = app;
	if (env) filter.env = env;

	// const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);
	const [page, setPage] = useState(1);

	const [stopBuildApi, stopBuildStatus] = useBuildStopApi();

	const { data } = useBuildListApi({ populate: "owner", pagination: { page, size: pageSize }, filter });
	const { list: builds, pagination } = data || {};
	const { total_items } = pagination || {};

	const openBuildLogs = (slug?: string) => {
		setQuery({ lv2: "build_logs", build_slug: slug });
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
			const release = await releaseCreateFromBuildApi({ build: buildId } as IRelease);

			root.notification.success({
				message: `Congrats, the release has been created successfully!`,
				description: (
					<>
						You can now preview it on <a href={`https://${release?.prereleaseUrl}`}>PRE-RELEASE</a> endpoint.
					</>
				),
				placement: "top",
			});
		} catch (e) {
			console.error(`Could not process releasing this build:`, e);

			root.notification.error({
				message: `Failed to roll out.`,
				description: `Could not process releasing this build: ${e}`,
				placement: "top",
			});
		}
	};

	const stopBuild = async (slug?: string) => {
		const result = await stopBuildApi({ slug });
		console.log("[BuildList] stopBuild :>> ", result);

		if (!result.status) {
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
						<Button icon={<CodeOutlined />} onClick={() => openBuildLogs(build.slug)} />
					</Tooltip>
					<Tooltip title="Open image URL">
						<Button icon={<EyeOutlined />} href={`https://${build.image}`} target="_blank" />
					</Tooltip>
					{build.env === "prod" && (
						<Tooltip title="Roll out this build">
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

	return (
		<div className="h-full overflow-auto">
			<Table
				columns={columns}
				dataSource={displayedBuilds}
				scroll={{ x: 600 }}
				sticky={{ offsetHeader: 0 }}
				pagination={{ current: page, pageSize, total: total_items }}
				onChange={onTableChange}
			/>
		</div>
	);
};
