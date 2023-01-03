import { BuildOutlined, CheckCircleOutlined, EditOutlined, EyeOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

import { useProjectListApi } from "@/api/api-project";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	key: React.Key;
	name: string;
	cluster: string;
	username: string;
	updatedAt: string;
	status: string;
	action: string;
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
		onFilter: (value, record) => record.name.indexOf(value.toString()) > -1,
	},
	{
		title: "Cluster",
		width: 60,
		dataIndex: "cluster",
		key: "cluster",
		render: (value) => <Button type="link">{value}</Button>,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.cluster.indexOf(value.toString()) > -1,
	},
	{
		title: "Last updated by",
		dataIndex: "username",
		key: "username",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.username.indexOf(value.toString()) > -1,
	},
	{
		title: "Last updated",
		dataIndex: "updatedAt",
		key: "updatedAt",
		width: 50,
		render: (value) => <>{(dayjs(value) as any).fromNow()}</>,
		sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
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
		render: (value) => {
			switch (value) {
				case "app":
					return (
						<Space.Compact>
							<Button icon={<EditOutlined />}></Button>
							<Button icon={<PauseCircleOutlined />}></Button>
						</Space.Compact>
					);

				case "env":
					return (
						<Space.Compact>
							<Button icon={<EyeOutlined />}></Button>
							<Button icon={<PauseCircleOutlined />}></Button>
							<Button icon={<BuildOutlined />} />
							<Button icon={<EditOutlined />}></Button>
						</Space.Compact>
					);

				case "project":
					return (
						<Space.Compact>
							<Button icon={<EditOutlined />}></Button>
							<Button icon={<PauseCircleOutlined />}></Button>
						</Space.Compact>
					);

				default:
					return <></>;
			}
		},
	},
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
	const apps = [{ name: "front-end" }, { name: "back-end" }];
	data.push({
		key: i,
		name: `Project #${i}`,
		cluster: `Cluster ${i}`,
		username: `goon`,
		updatedAt: dayjs().format("LLL"),
		status: "live",
		action: "project",
		children: apps.map((app, ai) => {
			const envs = [{ name: "dev" }, { name: "prod" }];
			return {
				key: `app-${i}-${ai}`,
				name: app.name,
				cluster: `Cluster ${i}`,
				username: `goon`,
				updatedAt: dayjs().format("LLL"),
				status: "live",
				action: "app",
				children: envs.map((e, ei) => {
					return {
						key: `env-${i}-${ai}-${ei}`,
						name: e.name.toUpperCase(),
						cluster: `Cluster ${i}`,
						username: `goon`,
						updatedAt: dayjs().format("LLL"),
						status: "live",
						action: "env",
					};
				}),
			};
		}),
	});
}

export const ProjectList = () => {
	const { data: projects } = useProjectListApi();

	console.log({ projects });

	return (
		<div>
			<Table columns={columns} dataSource={data} scroll={{ x: 1200 }} sticky={{ offsetHeader: 48 }} pagination={{ pageSize: 20 }} />
		</div>
	);
};
