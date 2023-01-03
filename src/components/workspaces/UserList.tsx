import { DeleteOutlined, EditOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

import type { IRole, ITeam } from "@/api/api-types";
import { useUserListApi } from "@/api/api-user";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	key: React.Key;
	id: string;
	name: string;
	username?: string;
	email?: string;
	roles?: IRole[];
	teams?: ITeam[];
	createdAt?: string;
	updatedAt?: string;
}

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		width: 60,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => record.name.indexOf(value.toString()) > -1,
	},
	{
		title: "User name",
		dataIndex: "username",
		key: "username",
		width: 50,
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				{value}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.username ? record.username.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		width: 80,
	},
	{
		title: "Roles",
		dataIndex: "roles",
		key: "roles",
		width: 40,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => record.roles ? record.roles.indexOf(value.toString()) > -1,
	},
	{
		title: "Teams",
		dataIndex: "teams",
		key: "teams",
		width: 40,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => record.teams.indexOf(value.toString()) > -1,
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
				<Button icon={<StopOutlined />}></Button>
			</Space.Compact>
		),
	},
];

const data: DataType[] = [];
for (let i = 0; i < 20; i++) {
	data.push({
		key: i,
		id: i.toString(),
		name: `User #${i}`,
		username: `Github`,
		email: "name@example.com",
		roles: [],
		teams: [],
		updatedAt: dayjs().format("LLL"),
		createdAt: dayjs().format("LLL"),
	});
}

export const UserList = () => {
	const { data: users } = useUserListApi({ populate: "roles,teams" });

	const displayedUsers: DataType[] =
		users?.map((u, i) => {
			return {
				id: u._id ?? `user-${i}`,
				key: u._id ?? `user-${i}`,
				name: u.name ?? `User #${i}`,
				username: u.slug ?? "",
				email: u.email ?? "",
				roles: (u.roles as IRole[]) || [],
				teams: (u.teams as ITeam[]) || [],
				updatedAt: dayjs(u.updatedAt).format("LLL"),
				createdAt: dayjs(u.createdAt).format("LLL"),
			};
		}) || [];
	console.log("displayedUsers :>> ", displayedUsers);

	return (
		<div>
			<Table columns={columns} dataSource={displayedUsers} scroll={{ x: 1200 }} sticky={{ offsetHeader: 48 }} pagination={{ pageSize: 20 }} />
		</div>
	);
};
