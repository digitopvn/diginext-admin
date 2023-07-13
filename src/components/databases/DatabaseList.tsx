/* eslint-disable no-nested-ternary */
import { CloudUploadOutlined, DeleteOutlined, FieldTimeOutlined, HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import React, { useRef, useState } from "react";

import {
	useCloudDatabaseActionAutoBackupApi,
	useCloudDatabaseActionBackupApi,
	useCloudDatabaseActionRestoreApi,
	useCloudDatabaseDeleteApi,
	useCloudDatabaseListApi,
} from "@/api/api-cloud-database";
import type { ICloudDatabase } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends ICloudDatabase {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const DatabaseList = () => {
	const { responsive } = useLayoutProvider();

	const [page, setPage] = useState(1);
	const { data, status } = useCloudDatabaseListApi({ populate: "owner,autoBackup", pagination: { page, size: pageSize } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

	const [deleteApi] = useCloudDatabaseDeleteApi();
	const [backupApi] = useCloudDatabaseActionBackupApi();
	const [restoreApi] = useCloudDatabaseActionRestoreApi();
	const [autoBackupApi] = useCloudDatabaseActionAutoBackupApi();
	const [query, { setQuery }] = useRouterQuery();

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 50,
			dataIndex: "name",
			key: "name",
			render: (value, record) => (
				<Button
					type="link"
					onClick={() => setQuery({ lv1: "edit", type: "database", database: record.slug })}
					style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap", textAlign: "left" }}
				>
					{value}
				</Button>
			),
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: 20,
			render: (value, record) => <Tag>{value}</Tag>,
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Verified",
			dataIndex: "verified",
			key: "verified",
			width: 20,
			render: (value, record) => (record.verified ? <Tag color="success">YES</Tag> : <Tag color="error">NO</Tag>),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Auto-backup",
			dataIndex: "auto-backup",
			key: "auto-backup",
			width: 20,
			render: (value, record) =>
				!isEmpty(record.autoBackup) ? (
					(record.autoBackup as any).active ? (
						<Tag color="success">YES</Tag>
					) : (
						<Tag color="volcano">STOPPED</Tag>
					)
				) : (
					<Tag color="error">NO</Tag>
				),
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
			width: responsive?.md ? 30 : 26,
			render: (value, record) => record.actions,
		},
	];

	const backupDatabase = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to backup.` });
		const res = await backupApi({ _id: id });
		if (res?.status) notification.success({ message: `Database has been backed up successfully.` });
	};

	const restoreDatabase = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to restore.` });
		const res = await restoreApi({ _id: id });
		if (res?.status) notification.success({ message: `Database has been restored successfully.` });
	};

	const autoBackupDatabase = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to auto backup.` });
		const res = await autoBackupApi({ _id: id });
		if (res?.status) notification.success({ message: `Database has been enabled auto-backup.` });
	};

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
						<Tooltip overlay="Run backup">
							<Button icon={<CloudUploadOutlined />} onClick={() => backupDatabase(item?._id)} />
						</Tooltip>
						<Tooltip overlay="Enable auto-backup">
							<Button icon={<FieldTimeOutlined />} onClick={() => autoBackupDatabase(item?._id)} />
						</Tooltip>
						<Tooltip overlay="Backup history">
							<Button icon={<HistoryOutlined />} onClick={() => setQuery({ lv1: "db_backups", database: item?.slug })} />
						</Tooltip>
						<Popconfirm
							title="Are you sure to delete this item?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							onConfirm={() => deleteItem(item._id)}
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
		<>
			{/* Page title & desc here */}
			<PageTitle
				title={`Databases (${total_items ?? "-"})`}
				breadcrumbs={[{ name: "Workspace" }]}
				actions={[
					<Button
						key="workspace-setting-btn"
						type="default"
						icon={<PlusOutlined className="align-middle" />}
						onClick={() => setQuery({ lv1: "new", type: "database" })}
					>
						Add
					</Button>,
				]}
			/>
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
