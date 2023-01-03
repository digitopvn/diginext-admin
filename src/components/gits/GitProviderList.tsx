import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

import { useGitProviderListApi } from "@/api/api-git-provider";
import type { IGitProvider, IUser } from "@/api/api-types";

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

const columns: ColumnsType<IGitProvider> = [
	{
		title: "Name",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Host",
		dataIndex: "host",
		key: "host",
		width: 50,
	},
	{
		title: "Namespace",
		width: 50,
		dataIndex: "gitWorkspace",
		key: "gitWorkspace",
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				{value.id}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.gitWorkspace ? record.gitWorkspace.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Created by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner ? ((record.owner as IUser).name || "").toLowerCase().indexOf(value.toString()) > -1 : true),
		render: (value, record) => <>{(record.owner as IUser).name}</>,
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
			</Space.Compact>
		),
	},
];

const data: DataType[] = [];
// for (let i = 0; i < 100; i++) {
// 	data.push({
// 		key: i,
// 		name: `Framework #${i}`,
// 		git: `Github`,
// 		version: "main",
// 		username: `goon`,
// 		createdAt: dayjs().format("LLL"),
// 	});
// }

export const GitProviderList = () => {
	const { data: gitProviders } = useGitProviderListApi({ populate: "owner" });
	console.log("gitProviders :>> ", gitProviders);
	return (
		<div>
			<Table
				columns={columns}
				dataSource={gitProviders || []}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize: 20 }}
			/>
		</div>
	);
};
