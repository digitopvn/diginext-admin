import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

import { useCloudProviderListApi } from "@/api/api-cloud-provider";
import type { ICluster, IUser } from "@/api/api-types";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id: string;
	key: React.Key;
	name: string;
	shortName: string;
	clusters?: ICluster[];
	owner?: IUser;
	createdAt: string;
	updatedAt: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.name.indexOf(value.toString()) > -1,
	},
	{
		title: "Short name",
		width: 60,
		dataIndex: "shortName",
		key: "shortName",
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				{value}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.shortName.indexOf(value.toString()) > -1,
	},
	{
		title: "Clusters",
		dataIndex: "clusters",
		key: "clusters",
		width: 30,
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
		title: "Updated at",
		dataIndex: "updatedAt",
		key: "updatedAt",
		width: 50,
		render: (value) => <>{(dayjs(value) as any).fromNow()}</>,
		sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
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

// const data: DataType[] = [];
// for (let i = 0; i < 100; i++) {
// 	data.push({
// 		key: i,
// 		name: `Cloud Provider #${i}`,
// 		git: `Github`,
// 		version: "main",
// 		username: `goon`,
// 		createdAt: dayjs().format("LLL"),
// 	});
// }

export const CloudProviderList = () => {
	const { data: cloudProviders } = useCloudProviderListApi({ populate: "owner,clusters" });

	const displayedCloudProviders: DataType[] =
		cloudProviders?.map((provider, i) => {
			return {
				id: provider._id ?? i.toString(),
				key: provider._id ?? i.toString(),
				name: provider.name ?? "",
				shortName: provider.shortName ?? "",
				clusters: (provider.clusters as ICluster[]) ?? [],
				owner: provider.owner as IUser,
				updatedAt: dayjs(provider.updatedAt).format("LLL"),
				createdAt: dayjs(provider.createdAt).format("LLL"),
			};
		}) || [];

	return (
		<div>
			<Table
				columns={columns}
				dataSource={displayedCloudProviders}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize: 20 }}
			/>
		</div>
	);
};
