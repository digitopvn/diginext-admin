/* eslint-disable no-nested-ternary */
import { CloudUploadOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useRef, useState } from "react";

import { useCloudDatabaseActionRestoreApi, useCloudDatabaseBackupDeleteApi, useCloudDatabaseBackupListApi } from "@/api/api-cloud-database";
import type { ICloudDatabaseBackup } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends ICloudDatabaseBackup {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const DatabaseBackupList = () => {
	// layout & query params
	const { responsive } = useLayoutProvider();
	const [query, { setQuery }] = useRouterQuery();
	const { database } = query;

	// list & pagination
	const [page, setPage] = useState(1);
	const { data, status } = useCloudDatabaseBackupListApi({
		filter: { dbSlug: database },
		populate: "owner,database",
		pagination: { page, size: pageSize },
	});
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

	// actions
	const [restoreApi] = useCloudDatabaseActionRestoreApi();
	const [deleteApi] = useCloudDatabaseBackupDeleteApi();

	const columns: ColumnsType<DataType> = [
		{
			title: "No.",
			width: 7,
			key: "no",
			dataIndex: "no",
			render: (value, record, index) => <>{(page - 1) * pageSize + index + 1}</>,
			// fixed: responsive?.md ? "left" : undefined,
		},
		{
			title: "Name",
			width: 50,
			dataIndex: "name",
			key: "name",
			render: (value, record) => (
				<Link href={record.url || "#"} target="_blank">
					{value}
				</Link>
			),
			// fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: 18,
			render: (value, record) => <Tag>{value}</Tag>,
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Database",
			dataIndex: "dbSlug",
			key: "dbSlug",
			width: 22,
			render: (value, record) => (record.dbSlug ? <Tag color="success">{record.dbSlug}</Tag> : <Tag color="error">-</Tag>),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Created by",
			dataIndex: "owner",
			key: "owner",
			width: 30,
			render: (value, record) => <>{record?.owner.name}</>,
		},
		{
			title: "Created at",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 25,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
		},
		{
			title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
			key: "action",
			fixed: "right",
			width: responsive?.md ? 20 : 20,
			render: (value, record) => record.actions,
		},
	];

	const deleteItem = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to delete this item.` });
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
						<Tooltip overlay="Download">
							<Button icon={<DownloadOutlined />} href={item.url} target="_blank" />
						</Tooltip>
						<Tooltip overlay="Restore">
							<Button disabled icon={<CloudUploadOutlined />} onClick={() => restoreApi({ id: item?._id })} />
						</Tooltip>
						<Popconfirm
							title="Are you sure to delete this item?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							onConfirm={() => deleteItem(item._id)}
							okText="Yes"
							cancelText="No"
						>
							<Button icon={<DeleteOutlined />} />
						</Popconfirm>
					</Space.Compact>
				),
			};
		}) || [];

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle
				title={`Database Backups (${total_items ?? "-"})`}
				breadcrumbs={[{ name: "Workspace" }]}
				actions={
					[
						// <Button
						// 	key="workspace-setting-btn"
						// 	type="default"
						// 	icon={<PlusOutlined className="align-middle" />}
						// 	onClick={() => setQuery({ lv1: "new", type: "database" })}
						// >
						// 	Add
						// </Button>,
					]
				}
			>
				<Tag color="success">{database}</Tag>
			</PageTitle>
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
		</>
	);
};
