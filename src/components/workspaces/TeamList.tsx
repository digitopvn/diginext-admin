import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useTeamListApi } from "@/api/api-team";
import type { ITeam, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	key: React.Key;
	name: string;
	username: string;
	email: string;
	roles: string;
	teams: string;
	createdAt: string;
	updatedAt: string;
}

const columns: ColumnsType<ITeam> = [
	{
		title: "Name",
		width: 60,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Owner",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		render: (value, record) => (
			<Button type="link" style={{ padding: 0 }}>
				{(record.owner as IUser).slug}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner ? ((record.owner as IUser).slug || "").indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
		width: 80,
	},
	{
		title: "Updated at",
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
// for (let i = 0; i < 20; i++) {
// 	data.push({
// 		key: i,
// 		name: `Team #${i}`,
// 		username: `Github`,
// 		email: "name@example.com",
// 		roles: "",
// 		teams: "",
// 		updatedAt: dayjs().format("LLL"),
// 		createdAt: dayjs().format("LLL"),
// 	});
// }
const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const TeamList = () => {
	const [page, setPage] = useState(1);
	const { data, status } = useTeamListApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: teams, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("teams :>> ", teams);

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};
	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<div className="h-full flex-auto overflow-hidden" ref={ref}>
			<Table
				sticky
				size="small"
				loading={status === "loading"}
				columns={columns}
				dataSource={teams}
				scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 100 : undefined }}
				pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
				onChange={onTableChange}
			/>
		</div>
	);
};
