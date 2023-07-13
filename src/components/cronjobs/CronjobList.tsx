/* eslint-disable no-nested-ternary */
import { CloseSquareOutlined, DeleteOutlined, HistoryOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Col, notification, Popconfirm, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useCronjobCancelApi, useCronjobDeleteApi, useCronjobListApi } from "@/api/api-cronjob";
import type { ICronjob } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends ICronjob {
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

export const CronjobList = () => {
	const { responsive } = useLayoutProvider();

	const [page, setPage] = useState(1);
	const { data, status } = useCronjobListApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("[CRONJOB] list :>> ", list);

	const [deleteApi] = useCronjobDeleteApi();
	const [cancelApi] = useCronjobCancelApi();
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
					onClick={() => setQuery({ lv1: "edit", type: "cronjob", cronjob: record.slug })}
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
			render: (value, record) => (record.repeat && record.repeat.range ? <Tag color="blue">recurrent</Tag> : <Tag color="green">once</Tag>),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Repeat",
			dataIndex: "repeat",
			key: "repeat",
			width: 30,
			render: (value, record) =>
				record.repeat && record.repeat.range ? (
					<Tooltip overlay={<>Next run at: {dayjs(record.nextRunAt).format("llll")}</>}>
						<Tag>
							Every {record.repeat.range} {record.repeat.unit}
						</Tag>
					</Tooltip>
				) : (
					<>-</>
				),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: 20,
			render: (value, record) =>
				!record.nextRunAt ? (
					record.active ? (
						<Tag color="success">finished</Tag>
					) : (
						<Tag color="error">cancelled</Tag>
					)
				) : (
					<Tag color="processing">waiting</Tag>
				),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.slug ? record.slug.indexOf(value.toString()) > -1 : true),
		},
		// {
		// 	title: "Next run at",
		// 	dataIndex: "nextRunAt",
		// 	key: "nextRunAt",
		// 	width: 35,
		// 	render: (value) => (value ? <>{dayjs(value).format("llll")}</> : <>-</>),
		// },
		{
			title: "HTTP Request",
			dataIndex: "request",
			key: "request",
			width: 44,
			render: (value, record) => (
				<Row>
					<Col>
						<Tag>{record?.method}</Tag>
					</Col>
					<Col span={16}>
						<Typography.Text ellipsis>{record?.url}</Typography.Text>
					</Col>
				</Row>
			),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => record.roles ? record.roles.indexOf(value.toString()) > -1,
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

	const cancelJob = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to cancel this job.` });
		const res = await cancelApi({ _id: id });
		if (res?.status) notification.success({ message: `Cronjob has been cancelled successfully.` });
	};

	const deleteItem = async (id?: string) => {
		if (!id) notification.error({ message: `Unable to cancel this job.` });
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
						<Tooltip overlay="Cancel cronjob">
							<Button icon={<CloseSquareOutlined />} onClick={() => cancelJob(item?._id)} />
						</Tooltip>
						<Tooltip overlay="View history">
							<Button
								icon={<HistoryOutlined />}
								onClick={() => notification.warning({ message: "This feature is under development." })}
							/>
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
			<PageTitle title={`Cronjobs (${total_items ?? "-"})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
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
