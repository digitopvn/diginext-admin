import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useFrameworkDeleteApi, useFrameworkListApi } from "@/api/api-framework";
import type { IFramework, IGitProvider, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends IFramework {
	key?: React.Key;
	id?: string;
	actions?: any;
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
		onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Git",
		width: 60,
		dataIndex: "git",
		key: "git",
		render: (value, record) => (
			<>
				{record.git?.name ? (
					<Button type="link" style={{ padding: 0 }}>
						{record.git?.name}
					</Button>
				) : (
					<Button type="link" style={{ padding: 0 }}>
						{record.gitProvider}
					</Button>
				)}
			</>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.git ? ((record.git as IGitProvider).name || "").indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Version",
		dataIndex: "version",
		key: "version",
		width: 30,
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
		render: (value) => <DateDisplay date={value} />,
		sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
	},
	{
		title: "Action",
		key: "action",
		width: 50,
		fixed: "right",
		render: (value, record) => record.actions,
	},
];

// const data: DataType[] = [];
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
const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const FrameworkList = () => {
	const [page, setPage] = useState(1);
	const { data, status } = useFrameworkListApi({ populate: "git,owner", pagination: { page, size: pageSize } });
	const { list: frameworks, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("frameworks :>> ", frameworks);

	const [deleteApi] = useFrameworkDeleteApi();

	const [query, { setQuery }] = useRouterQuery();

	const deleteItem = async (id: string) => {
		const res = await deleteApi({ _id: id });
		// console.log("deleteItem :>> ", res);
		if (res?.status) notification.success({ message: `Item deleted successfully.` });
	};

	const displayedData =
		frameworks?.map((framework) => {
			return {
				...framework,
				actions: (
					<Space.Compact>
						<Button
							icon={<EditOutlined />}
							onClick={() => setQuery({ lv1: "edit", type: "framework", framework_slug: framework.slug })}
						></Button>
						<Popconfirm
							title="Are you sure to delete this framework?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							onConfirm={() => deleteItem(framework._id as string)}
							okText="Yes"
							cancelText="No"
						>
							<Button icon={<DeleteOutlined />}></Button>
						</Popconfirm>
					</Space.Compact>
				),
			} as DataType;
		}) || [];

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle
				title="Frameworks"
				breadcrumbs={[{ name: "Workspace" }]}
				actions={[
					<Button
						key="workspace-setting-btn"
						type="default"
						icon={<PlusOutlined className="align-middle" />}
						onClick={() => setQuery({ lv1: "new", type: "framework" })}
					>
						New
					</Button>,
				]}
			/>

			{/* Page Content */}
			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					size="small"
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedData}
					scroll={{ x: 1200, y: typeof size?.height !== "undefined" ? size.height - 100 : undefined }}
					sticky
					pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
					onChange={onTableChange}
				/>
			</div>
		</>
	);
};
