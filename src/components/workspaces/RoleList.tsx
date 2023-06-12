import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

import { useRoleDeleteApi, useRoleListApi } from "@/api/api-role";
import type { IRole, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends IRole {
	key?: React.Key;
	id?: string;
	actions?: any;
}

// const data: DataType[] = [];
// for (let i = 0; i < 20; i++) {
// 	data.push({
// 		key: i,
// 		name: `Role #${i}`,
// 		username: `Github`,
// 		email: "name@example.com",
// 		roles: "",
// 		teams: "",
// 		updatedAt: dayjs().format("LLL"),
// 		createdAt: dayjs().format("LLL"),
// 	});
// }

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const RoleList = () => {
	const { responsive } = useLayoutProvider();

	// config

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 40,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Created by",
			dataIndex: "owner",
			key: "owner",
			width: 50,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.owner ? ((record.owner as IUser).name ?? "").indexOf(value.toString()) > -1 : true),
			render: (value, record) => <>{record.owner ? (record.owner as IUser).name : "System"}</>,
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
			title: "Updated at",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 50,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
		},
		{
			title: "Action",
			key: "action",
			width: responsive?.md ? 26 : 18,
			fixed: "right",
			render: (value, record) => record.actions,
		},
	];

	//

	const [page, setPage] = useState(1);
	const { data, status } = useRoleListApi({ populate: "owner,workspace", pagination: { page, size: pageSize } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};
	// console.log("list :>> ", list);

	const [deleteApi] = useRoleDeleteApi();

	const [query, { setQuery }] = useRouterQuery();

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};

	const deleteItem = async (id: string) => {
		const res = await deleteApi({ _id: id });
		if (res?.status) notification.success({ message: `Item deleted successfully.` });
	};

	const displayedList: DataType[] =
		list?.map((item, i) => {
			return {
				...item,
				actions: (
					<Space.Compact>
						<Button icon={<EditOutlined />} onClick={() => setQuery({ lv1: "edit", type: "role", role: item.slug })}></Button>
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
	console.log("displayedList :>> ", displayedList);

	return (
		<div>
			<Table
				loading={status === "loading"}
				columns={columns}
				dataSource={displayedList}
				scroll={{ x: 1000 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize, total: total_items }}
				onChange={onTableChange}
			/>
		</div>
	);
};
