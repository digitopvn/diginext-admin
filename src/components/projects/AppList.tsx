import {
	AppstoreAddOutlined,
	BuildOutlined,
	CheckCircleOutlined,
	EditOutlined,
	EyeOutlined,
	GlobalOutlined,
	PauseCircleOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React from "react";

import { useAppListApi } from "@/api/api-app";
import { useProjectListApi } from "@/api/api-project";
import type { IApp, IProject, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends IApp {
	key?: React.Key;
	cluster?: string;
	status?: string;
	action?: string;
	url?: string;
	children?: DataType[];
}

const columns: ColumnsType<DataType> = [
	{
		title: "App name",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
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
		onFilter: (value, record) => (record.cluster ? record.cluster.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Last updated by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner ? ((record.owner as IUser).slug || "").indexOf(value.toString()) > -1 : true),
		render: (value) => <>{value?.slug}</>,
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
			<Tag color="success" icon={<CheckCircleOutlined className="align-middle" />}>
				{value}
			</Tag>
		),
	},
	{
		title: "Action",
		key: "action",
		fixed: "right",
		width: 50,
		dataIndex: "action",
		render: (value, record) => {
			switch (value) {
				case "app":
					return (
						<Space.Compact>
							<Button icon={<EditOutlined />} />
							<Button icon={<PauseCircleOutlined />} />
						</Space.Compact>
					);

				case "env":
					return (
						<Space.Compact>
							<Button icon={<EyeOutlined />} href={record.url} target="_blank" />
							<Button icon={<PauseCircleOutlined />} />
							<Button icon={<BuildOutlined />} />
							<Button icon={<EditOutlined />} />
						</Space.Compact>
					);

				case "env-prod":
					return (
						<Space.Compact>
							<Button icon={<EyeOutlined />} />
							<Button icon={<GlobalOutlined />} />
							<Button icon={<PauseCircleOutlined />} />
							<Button icon={<AppstoreAddOutlined />} />
							<Button icon={<EditOutlined />} />
						</Space.Compact>
					);

				case "project":
					return (
						<Space.Compact>
							<Button icon={<EditOutlined />} />
							<Button icon={<PauseCircleOutlined />} />
						</Space.Compact>
					);

				default:
					return <></>;
			}
		},
	},
];

export const AppList = () => {
	const router = useRouter();
	const { slugs } = router.query;

	const [projectSlug] = (slugs as string[]) || [];
	// console.log("projectSlug :>> ", projectSlug);

	const { data } = useProjectListApi({ filter: { slug: projectSlug || "undefined" } });
	const { list: projects } = data || {};
	// console.log("projects :>> ", projects);

	const [project] = projects || [];

	const { data: appResponse } = useAppListApi({
		filter: { project: project ? (project as IProject)._id : "undefined" },
		populate: "owner,project",
	});
	const { list: apps } = appResponse || {};

	const displayedApps: DataType[] = (apps || []).map((app) => {
		const envList = Object.keys(app.deployEnvironment ?? {});
		const environments: DataType[] = envList.map((envName) => {
			const deployEnvironment = (app.deployEnvironment || {})[envName] || {};
			return {
				name: envName.toUpperCase(),
				key: `${project?.slug}-${app.slug}-${envName}`,
				id: envName,
				slug: envName,
				action: envName !== "prod" ? "env" : "env-prod",
				status: "live",
				url: deployEnvironment.domains ? `https://${deployEnvironment.domains[0]}` : "",
				...(deployEnvironment as any),
			};
		});
		return { ...app, children: environments };
	});

	if (isEmpty(slugs)) return <>Project not found.</>;

	return (
		<div>
			<Table
				columns={columns}
				dataSource={displayedApps}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize: 20 }}
				expandable={{
					defaultExpandAllRows: true,
				}}
			/>
		</div>
	);
};
