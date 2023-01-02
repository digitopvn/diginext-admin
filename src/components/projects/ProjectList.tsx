import { BuildOutlined, CheckCircleOutlined, EditOutlined, EyeOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

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
		onFilter: (value, record) => record.username.indexOf(value.toString()) > -1,
	},
	{
		title: "Cluster",
		width: 60,
		dataIndex: "cluster",
		key: "cluster",
		render: (value) => <Button type="link">{value}</Button>,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.username.indexOf(value.toString()) > -1,
	},
	{
		title: "Last updated by",
		dataIndex: "username",
		key: "1",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.username.indexOf(value.toString()) > -1,
	},
	{
		title: "Last updated",
		dataIndex: "updatedAt",
		key: "2",
		width: 50,
		render: (value) => <>{(dayjs(value) as any).fromNow()}</>,
		sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
	},
	{
		title: "Status",
		dataIndex: "status",
		fixed: "right",
		key: "3",
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
						<Space size={2}>
							<Button icon={<EditOutlined />} type="text"></Button>
							<Button icon={<PauseCircleOutlined />} type="text"></Button>
						</Space>
					);

				case "env":
					return (
						<Space size={2}>
							<Button icon={<EyeOutlined />} type="text"></Button>
							<Button icon={<PauseCircleOutlined />} type="text"></Button>
							<Button icon={<BuildOutlined />} type="text" />
							<Button icon={<EditOutlined />} type="text"></Button>
						</Space>
					);

				case "project":
					return (
						<Space size={2}>
							<Button icon={<EditOutlined />} type="text"></Button>
							<Button icon={<PauseCircleOutlined />} type="text"></Button>
						</Space>
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
	return (
		<div>
			<Table columns={columns} dataSource={data} scroll={{ x: 1400 }} sticky={{ offsetHeader: 48 }} pagination={{ pageSize: 20 }} />
		</div>
	);
};
