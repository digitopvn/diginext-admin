import { CheckCircleOutlined, CloseCircleOutlined, CrownOutlined, InfoCircleOutlined, LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { App, Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isArray, isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useAppSlugApi } from "@/api/api-app";
import { usePreviewPrereleaseApi, useReleaseListApi, useReleaseRollOutApi } from "@/api/api-release";
import type { DeployStatus, IApp, IRelease, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";

import PromoteDeployEnvironmentModal from "../projects/PromoteDeployEnvironmentModal";

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

const columns: ColumnsType<IRelease & DataType> = [
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
					<strong>{value}</strong>
				</p>
				<p>
					Revision: {record.message ?? "-"}
					<br />
					Author: {(record.owner as IUser)?.name ?? "-"}
					<br />
					Created <DateDisplay date={record.createdAt} />
				</p>
			</>
		),
	},
	{
		title: "Deploy status",
		dataIndex: "status",
		// fixed: "right",
		key: "status",
		width: 30,
		filters: [
			{ text: "start", value: "start" },
			{ text: "failed", value: "failed" },
			{ text: "success", value: "success" },
			{ text: "building", value: "building" },
		],
		render: (value: DeployStatus) => {
			let color = "warning";
			let icon = <InfoCircleOutlined />;
			switch (value) {
				case "in_progress":
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
				case "cancelled":
					color = "warning";
					icon = <CloseCircleOutlined className="align-middle" />;
					break;
				case "pending":
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
		title: "Active",
		dataIndex: "active",
		key: "active",
		width: 20,
		// filterSearch: true,
		filters: [{ text: "active", value: true }],
		onFilter: (value, record) => record.active === value,
		render: (value) =>
			value === true ? (
				<Tag color="blue" icon={<CheckCircleOutlined />}>
					active
				</Tag>
			) : (
				"-"
			),
	},
	{
		title: "Action",
		key: "action",
		// fixed: "right",
		width: 30,
		dataIndex: "action",
		render: (value) => value,
	},
];

const pageSize = 100;

type IReleaseListProps = {
	project: string;
	app: string;
	env: string;
	offsetHeader?: number;
};

export const ReleaseList = () => {
	const router = useRouter();
	const root = useApp();
	const [query] = useRouterQuery();
	// const { modal } = useModalProvider();
	const { modal } = App.useApp();

	const { project, app: appSlug, offsetHeader = 0, env = "prod" } = query;

	const filter: any = {};
	if (project) filter.projectSlug = project;
	if (appSlug) filter.appSlug = appSlug;
	if (env) filter.env = env;

	// const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);
	const [page, setPage] = useState(1);

	// release
	const { data, status, refetch } = useReleaseListApi({
		filter,
		sort: "-createdAt",
		populate: "owner",
		pagination: { page, size: pageSize },
	});
	const { list: releases = [], pagination } = data || {};
	const { total_items } = pagination || {};

	// app
	const useSlugApi = useAppSlugApi(appSlug, { populate: "owner" });
	const { data: app } = useSlugApi;

	// roll out api
	const [rolloutApi, rolloutApiStatus] = useReleaseRollOutApi();
	const [releaseId, setReleaseId] = useState("");

	const [previewApi] = usePreviewPrereleaseApi();

	const rollout = async (id: string) => {
		// show loading ?
		refetch();

		if (isEmpty(id)) {
			root.notification.error({
				message: `Failed to roll out.`,
				description: `Release not found: ${id}`,
				placement: "top",
			});
			return;
		}

		setReleaseId(id);

		try {
			const res = await rolloutApi({ id });
			const release = isArray(res?.data) ? res?.data[0] : res?.data;

			if (res?.status) {
				refetch();
				root.notification.success({
					message: `Congrats, the release has been rolled out successfully!`,
					description: (
						<>
							Your website is ready to access on PRODUCTION environment:{" "}
							<a href={`https://${release?.productionUrl}`} target="_blank" rel="noreferrer">
								{release?.productionUrl}
							</a>
						</>
					),
					placement: "top",
				});
			}
		} catch (e) {
			console.error(`Could not process rolling out this release:`, e);

			root.notification.error({
				message: `Failed to roll out.`,
				description: `Could not process rolling out this release: ${e}`,
				placement: "top",
			});
		}

		setReleaseId("");
	};

	const previewPrerelease = async (id: string) => {
		if (isEmpty(id)) {
			root.notification.error({
				message: `Failed to preview.`,
				description: `Release not found: ${id}`,
				placement: "top",
			});
			return;
		}

		try {
			const releaseRes = await previewApi({ id });
			const release = isArray(releaseRes?.data) ? releaseRes?.data[0] : releaseRes?.data;

			if (releaseRes?.status)
				root.notification.success({
					message: `Congrats!`,
					description: (
						<>
							The PRE-RELEASE environment has been setup successfully at:{" "}
							<a href={`https://${release?.prereleaseUrl}`} target="_blank" rel="noreferrer">
								{release?.prereleaseUrl}
							</a>
						</>
					),
					placement: "top",
				});
		} catch (e) {
			root.notification.error({
				message: `Failed to start preview.`,
				description: `Could not set up the pre-release environment of this release: ${e}`,
				placement: "top",
			});
		}
	};

	const openPromoteDeployEnvironmentModal = (_app: IApp, fromEnv: string, toEnv?: string) => {
		// console.log("modal :>> ", modal);
		const instance = modal?.info({
			title: <Typography.Title level={3}>Promote to {toEnv ? toEnv.toUpperCase() : "another"} deploy environment</Typography.Title>,
			icon: null,
			content: (
				<PromoteDeployEnvironmentModal
					app={_app}
					fromEnv={fromEnv}
					toEnv={toEnv}
					next={() => {
						instance?.destroy();
						// reload project & app list
						// refetchProjecAndApps();
					}}
				/>
			),
			footer: null,
			closable: true,
			maskClosable: true,
			width: 500,
			bodyStyle: { margin: 0, width: "100%", justifyContent: "stretch" },
			onOk() {},
		});
	};

	const displayedReleases = releases.map((release) => {
		return {
			...release,
			id: release._id,
			status: releaseId === release._id && rolloutApiStatus === "loading" ? "in_progress" : release.status,
			action: (
				<>
					<Space.Compact>
						<Tooltip title="Roll out">
							<Button
								disabled={releaseId === release._id && rolloutApiStatus === "loading"}
								icon={<RocketOutlined />}
								onClick={() => rollout(release._id as string)}
							/>
						</Tooltip>
						{/* <Tooltip title="Preview">
						<Button icon={<EyeOutlined />} onClick={() => previewPrerelease(release._id as string)} target="_blank" />
					</Tooltip> */}
						<Tooltip title="Promote to another deploy environment" arrow={false}>
							<Button
								icon={<CrownOutlined />}
								onClick={() => {
									if (app) {
										openPromoteDeployEnvironmentModal(app, env);
									} else {
										console.log(`App "${appSlug}" not found.`);
									}
								}}
								target="_blank"
							/>
						</Tooltip>
					</Space.Compact>
				</>
			),
		} as IRelease & DataType;
	});
	console.log({ displayedReleases });

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		// router.push(`${router.pathname}`, { query: { page: current ?? 1 } });
		setPage(current ?? 1);
	};

	return (
		<div>
			<Table
				loading={status === "loading"}
				columns={columns}
				dataSource={displayedReleases}
				scroll={{ x: 600 }}
				sticky={{ offsetHeader }}
				pagination={{ current: page, pageSize, total: total_items }}
				onChange={onTableChange}
			/>
		</div>
	);
};
