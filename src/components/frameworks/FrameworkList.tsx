import { BuildOutlined, DeleteOutlined, EditOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
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
	git: string;
	version: string;
	username: string;
	createdAt: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: "Framework",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.name.indexOf(value.toString()) > -1,
	},
	{
		title: "Git",
		width: 60,
		dataIndex: "git",
		key: "git",
		render: (value) => <Button type="link">{value}</Button>,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.git.indexOf(value.toString()) > -1,
	},
	{
		title: "Version",
		dataIndex: "version",
		key: "version",
		width: 30,
	},
	{
		title: "Created by",
		dataIndex: "username",
		key: "username",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.username.indexOf(value.toString()) > -1,
	},
	{
		title: "Created at",
		dataIndex: "createdAt",
		key: "createdAt",
		width: 50,
		render: (value) => <>{(dayjs(value) as any).fromNow()}</>,
		sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
	},
	{
		title: "Action",
		key: "action",
		width: 50,
		fixed: "right",
		render: () => (
			<Space.Compact>
				<Button icon={<EditOutlined />}></Button>
				<Button icon={<DeleteOutlined />}></Button>
				<Button icon={<PauseCircleOutlined />}></Button>
				<Button icon={<BuildOutlined />} />
			</Space.Compact>
		),
	},
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
	data.push({
		key: i,
		name: `Framework #${i}`,
		git: `Github`,
		version: "main",
		username: `goon`,
		createdAt: dayjs().format("LLL"),
	});
}

export const FrameworkList = () => {
	return (
		<div>
			<Table columns={columns} dataSource={data} scroll={{ x: 1200 }} sticky={{ offsetHeader: 48 }} pagination={{ pageSize: 20 }} />
		</div>
	);
};
