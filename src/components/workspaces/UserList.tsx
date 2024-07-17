import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import type { IUser } from "@/api/api-types";
import { useUserDeleteApi, useUserListApi } from "@/api/api-user";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends IUser {
	key?: React.Key;
	id?: string;
	actions?: any;
}

// const data: DataType[] = [];
// for (let i = 0; i < 20; i++) {
// 	data.push({
// 		key: i,
// 		id: i.toString(),
// 		name: `User #${i}`,
// 		username: `Github`,
// 		email: "name@example.com",
// 		roles: [],
// 		teams: [],
// 		updatedAt: dayjs().format("LLL"),
// 		createdAt: dayjs().format("LLL"),
// 	});
// }
const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const UserList = () => {
	const { responsive } = useLayoutProvider();

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 60,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "User name",
			dataIndex: "slug",
			key: "slug",
			width: 50,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			render: (value) => (
				<Button type="link" style={{ padding: 0 }}>
					{value}
				</Button>
			),
			onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
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
			render: (value) => <>{value[0]?.name}</>,
			// onFilter: (value, record) => record.roles ? record.roles.indexOf(value.toString()) > -1,
		},
		// {
		// 	title: "Teams",
		// 	dataIndex: "teams",
		// 	key: "teams",
		// 	width: 40,
		// 	filterSearch: true,
		// 	filters: [{ text: "goon", value: "goon" }],
		// 	// onFilter: (value, record) => record.teams.indexOf(value.toString()) > -1,
		// },
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
			title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
			key: "action",
			fixed: "right",
			width: responsive?.md ? 30 : 26,
			render: (value, record) => record.actions,
		},
	];

	const [page, setPage] = useState(1);
	const { data, status } = useUserListApi({ populate: "roles,teams", pagination: { page, size: pageSize } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};
	// console.log("users :>> ", list);

	const [deleteApi] = useUserDeleteApi();
	const [query, { setQuery }] = useRouterQuery();

	const deleteItem = async (id: string) => {
		const res = await deleteApi({ _id: id });
		if (res?.status) notification.success({ message: `Item deleted successfully.` });
	};

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};

	const displayedList: DataType[] =
		list?.map((item, i) => {
			return {
				...item,
				actions: (
					<Space.Compact>
						<Button icon={<EditOutlined />} onClick={() => setQuery({ lv1: "edit", type: "user", user: item.slug })}></Button>
						<Popconfirm
							title="Are you sure to delete this item?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							onConfirm={() => deleteItem(item._id as string)}
							okText="Yes"
							cancelText="No"
						>
							<Button icon={<DeleteOutlined />}></Button>
						</Popconfirm>
					</Space.Compact>
				),
			};
		}) || [];

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<div className="h-full flex-auto overflow-hidden" ref={ref}>
			<Table
				sticky
				size="small"
				loading={status === "loading"}
				columns={columns}
				dataSource={displayedList}
				scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
				pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
				onChange={onTableChange}
			/>
		</div>
	);
};
