import {
	BuildOutlined,
	EditOutlined,
	EyeOutlined,
	GlobalOutlined,
	InfoCircleOutlined,
	PauseCircleOutlined,
	QrcodeOutlined,
	RocketOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useProjectListWithAppsApi } from "@/api/api-project";
import type { IAppEnvironment } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { AppConfig } from "@/utils/AppConfig";

import { BuildList } from "../deployments/BuildList";
import { ReleaseList } from "../deployments/ReleaseList";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id?: string;
	key?: React.Key;
	name?: string;
	slug?: string;
	cluster?: string;
	owner?: string;
	updatedAt?: string;
	createdAt?: string;
	status?: string;
	type?: string;
	actions?: string;
	url?: string;
	prereleaseUrl?: string;
	children?: DataType[];
}

const columns: ColumnsType<DataType> = [
	{
		title: "Project/app",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
		render: (value, record) => (record.type === "project" ? <Link href={`/project/${record.slug}`}>{value}</Link> : <>{value}</>),
	},
	{
		title: "Cluster",
		width: 60,
		dataIndex: "cluster",
		key: "cluster",
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				{value}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.cluster && record.cluster.indexOf(value.toString()) > -1) || true,
	},
	{
		title: "Last updated by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner && record.owner.indexOf(value.toString()) > -1) || true,
		render: (value) => <>{value?.name}</>,
	},
	{
		title: "Last updated",
		dataIndex: "updatedAt",
		key: "updatedAt",
		width: 50,
		render: (value) => <DateDisplay date={value} />,
		sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
	},
	{
		title: "Created at",
		dataIndex: "createdAt",
		key: "createdAt",
		width: 50,
		render: (value) => <DateDisplay date={value} />,
		sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
	},
	{
		title: "Status",
		dataIndex: "status",
		fixed: "right",
		key: "status",
		width: 30,
		filters: [{ text: "live", value: "live" }],
		render: (value) => (
			// <Tag color="success" icon={<CheckCircleOutlined className="align-middle" />}>
			<Tag color="warning" icon={<InfoCircleOutlined className="align-middle" />}>
				{value}
			</Tag>
		),
	},
	{
		title: "Action",
		key: "action",
		fixed: "right",
		width: 70,
		dataIndex: "action",
		render: (value, record) => record.actions,
	},
];

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const ProjectList = () => {
	const router = useRouter();
	const [query, { setQuery, deleteQuery }] = useRouterQuery();

	// pagination
	const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);

	// build drawer
	const [open, setOpen] = useState(false);

	// fetch projects
	const { data } = useProjectListWithAppsApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: projects, pagination } = data || {};
	const { total_pages } = pagination || {};

	// builds
	const onClose = () => {
		setOpen(false);
		deleteQuery(["type", "project", "app", "env"]);
	};

	const openBuildList = (project: string, app: string, env: string) => {
		setOpen(true);
		setQuery({ type: "build", project, app, env });
	};

	const openReleaseList = (project: string, app: string) => {
		setOpen(true);
		setQuery({ type: "release", project, app });
	};

	// table pagination
	useEffect(() => {
		if (!router.isReady) return;
		const newPage = query.page ? parseInt(query.page.toString(), 10) : 1;
		setPage(newPage);
	}, [query.page]);

	const displayedProjects = projects?.map((p) => {
		return {
			...p,
			type: "project",
			actions: (
				<Space.Compact>
					<Tooltip title="Edit project">
						<Button icon={<EditOutlined />} />
					</Tooltip>
					<Button icon={<PauseCircleOutlined />} />
				</Space.Compact>
			),
			key: p._id,
			id: p._id,
			status: "N/A",
			children: p.apps
				? p.apps.map((app) => {
						const environmentNames = Object.keys(app.environment ?? {});
						const environments: DataType[] = environmentNames.map((envName) => {
							const envStr = app.environment ? (app.environment[envName] as string) : "[]";
							const envData = JSON.parse(envStr) as IAppEnvironment;

							const record: any = {
								name: envName.toUpperCase(),
								key: `${p.slug}-${app.slug}-${envName}`,
								id: envName,
								slug: envName,
								projectSlug: p.slug,
								appSlug: app.slug,
								type: envName !== "prod" ? "env" : "env-prod",
								status: "N/A",
								url: envData.domains ? `https://${envData.domains[0]}` : "",
								prereleaseUrl: envName === "prod" ? `https://${p.slug}-${app.slug}.prerelease.diginext.site`.toLowerCase() : "",
								...(envData as any),
							};

							record.actions =
								envName === "prod" ? (
									<Space.Compact>
										<Tooltip title="Preview pre-release site">
											<Button
												icon={<EyeOutlined />}
												href={record.prereleaseUrl}
												target="_blank"
												disabled={isEmpty(record.prereleaseUrl)}
											/>
										</Tooltip>
										<Tooltip title="View live website">
											<Button icon={<GlobalOutlined />} href={record.url} target="_blank" disabled={isEmpty(record.url)} />
										</Tooltip>
										{/* <Tooltip title="Take down">
											<Button icon={<PauseCircleOutlined />} />
										</Tooltip> */}
										<Tooltip title="List of builds">
											<Button
												icon={<BuildOutlined />}
												onClick={() => openBuildList(record.projectSlug, record.appSlug, record.id)}
											/>
										</Tooltip>
										<Tooltip title="All releases">
											<Button icon={<RocketOutlined />} onClick={() => openReleaseList(record.projectSlug, record.appSlug)} />
										</Tooltip>
										<Tooltip title="Modify environment variables (coming soon)" placement="topRight">
											<Button icon={<QrcodeOutlined />} disabled />
										</Tooltip>
									</Space.Compact>
								) : (
									<Space.Compact>
										<Tooltip title="View website">
											<Button icon={<EyeOutlined />} href={record.url} target="_blank" disabled={isEmpty(record.url)} />
										</Tooltip>
										{/* <Button icon={<PauseCircleOutlined />} /> */}
										<Tooltip title="List of builds">
											<Button
												icon={<BuildOutlined />}
												onClick={() => openBuildList(record.projectSlug, record.appSlug, record.id)}
											/>
										</Tooltip>
										<Tooltip title="Modify environment variables (coming soon)" placement="topRight">
											<Button icon={<QrcodeOutlined />} disabled />
										</Tooltip>
									</Space.Compact>
								);

							return record;
						});

						return {
							...(app as any),
							key: app._id,
							id: app._id,
							status: "N/A",
							type: "app",
							children: environments,
							actions: (
								<Space.Compact>
									<Tooltip title="Edit app">
										<Button icon={<EditOutlined />} />
									</Tooltip>
									<Button icon={<PauseCircleOutlined />} />
								</Space.Compact>
							),
						};
				  })
				: [],
		};
	}) as any;
	// console.log({ displayedProjects });

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		setQuery({ page: current ?? 1 });
	};

	return (
		<div>
			<Table
				columns={columns}
				dataSource={displayedProjects}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ current: page, pageSize, total: total_pages }}
				onChange={onTableChange}
			/>
			<Drawer title={query.type === "build" ? "Builds" : "Releases"} placement="right" onClose={onClose} open={open} size="large">
				{query.type === "build" && <BuildList project={query.project} app={query.app} env={query.env} />}
				{query.type === "release" && <ReleaseList project={query.project} app={query.app} />}
			</Drawer>
		</div>
	);
};
