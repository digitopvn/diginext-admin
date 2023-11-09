import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useCloudStorageDeleteApi, useCloudStorageListApi } from "@/api/api-storage";
import type { ICloudStorage, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends ICloudStorage {
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
		// filterSearch: true,
		// filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Bucket",
		width: 50,
		dataIndex: "bucket",
		key: "bucket",
		// filterSearch: true,
		// filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Host",
		width: 60,
		dataIndex: "host",
		key: "host",
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				<Typography.Text className="w-[120px]" ellipsis={{ tooltip: value }}>
					{value}
				</Typography.Text>
			</Button>
		),
		// filterSearch: true,
		// filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => (record.host ? record.host.indexOf(value.toString()) > -1 : true),
	},
	{
		title: "Provider",
		dataIndex: "provider",
		key: "provider",
		width: 30,
		render: (value, record) => <>{record.provider}</>,
	},
	{
		title: "Verified",
		dataIndex: "verified",
		key: "verified",
		width: 30,
		render: (value, record) => <>{record.verified ? "✅" : "❌"}</>,
	},
	{
		title: "Created by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		// filterSearch: true,
		// filters: [{ text: "goon", value: "goon" }],
		// onFilter: (value, record) => (record.owner ? ((record.owner as IUser).name ?? "").indexOf(value.toString()) > -1 : true),
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
		width: 50,
		fixed: "right",
		render: (value, record) => record.actions,
	},
];

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const CloudStorageList = () => {
	const [page, setPage] = useState(1);
	const { data, status } = useCloudStorageListApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: containerRegistries, pagination } = data || {};
	const { total_items } = pagination || {};
	// console.log("containerRegistries :>> ", containerRegistries);

	const [deleteApi] = useCloudStorageDeleteApi();

	const [query, { setQuery }] = useRouterQuery();

	const deleteItem = async (id: string) => {
		const res = await deleteApi({ _id: id });
		if (res?.status) notification.success({ message: `Item deleted successfully.` });
	};

	const displayedData =
		containerRegistries?.map((item) => {
			return {
				...item,
				actions: (
					<Space.Compact>
						<Button
							icon={<EditOutlined />}
							onClick={() => setQuery({ lv1: "edit", type: "registry", registry_slug: item.slug })}
						></Button>
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
			} as DataType;
		}) || [];

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
				dataSource={displayedData}
				scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
				pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
				onChange={onTableChange}
			/>
		</div>
	);
};
