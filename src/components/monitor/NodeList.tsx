/* eslint-disable no-nested-ternary */
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, notification, Popconfirm, Progress, Row, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { round, toInteger } from "lodash";
import React, { useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorNodeApi } from "@/api/api-monitor-node";
import { useUserDeleteApi } from "@/api/api-user";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeNode } from "@/types/KubeNode";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeNode {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const NodeList = () => {
	const { responsive } = useLayoutProvider();

	// clusters
	const { data: clusterRes, status: clusterApiStatus } = useClusterListApi();
	const { list: clusters = [] } = clusterRes || {};

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 60,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			render: (value, record) => {
				return (
					<>
						<Typography.Text strong className="leading-8">
							{record.metadata?.name}
						</Typography.Text>
						<br />
						<Tag color="cyan">{record.status.nodeInfo?.osImage}</Tag>
						<Tag color="cyan">{record.status.nodeInfo?.architecture}</Tag>
						<Tag color="cyan">CPU: {record.status.capacity?.cpu}</Tag>
						<Tag color="cyan">MEM: {round(toInteger(record.status.capacity?.memory?.replace("Ki", "")) / 1024 / 1024)}Gb</Tag>
						<Tag color="cyan">
							Pods: {record.podCount}/{record.status.capacity?.pods}
						</Tag>
					</>
				);
			},
			// filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.metadata?.name ? record.metadata?.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Cluster",
			dataIndex: "clusterShortName",
			key: "clusterShortName",
			width: 30,
			render: (value) => (
				<Button type="link" style={{ padding: 0 }}>
					{value}
				</Button>
			),
			filterSearch: true,
			filters: clusters.map((cluster) => {
				return { text: cluster.shortName || "", value: cluster.shortName || "" };
			}),
			onFilter: (value, record) => (record.clusterShortName ? record.clusterShortName.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Capacity",
			dataIndex: "capacity",
			key: "capacity",
			width: 35,
			render: (value, record) => {
				const cpuPer = toInteger(record.cpuPercent?.replace("%", ""));
				const memPer = toInteger(record.memoryPercent?.replace("%", ""));
				return (
					<>
						<Row gutter={[0, 0]}>
							<Col>
								<Tag style={{ width: 44, textAlign: "center" }}>CPU</Tag>
							</Col>
							<Col flex="auto">
								<Progress percent={cpuPer} size="small" strokeColor={cpuPer > 90 ? "red" : cpuPer > 70 ? "orange" : "#1668dc"} />
							</Col>
						</Row>
						<Row gutter={[0, 0]}>
							<Col>
								<Tag>MEM</Tag>
							</Col>
							<Col flex="auto">
								<Progress
									percent={memPer > 99 ? 99 : memPer}
									size="small"
									strokeColor={memPer > 90 ? "red" : memPer > 70 ? "orange" : "#1668dc"}
								/>
							</Col>
						</Row>
					</>
				);
			},
		},
		{
			title: "Created at",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 30,
			render: (value, record) => <DateDisplay date={record.metadata?.creationTimestamp} />,
			sorter: (a, b) => dayjs(a.metadata?.creationTimestamp).diff(dayjs(b.metadata?.creationTimestamp)),
		},
		{
			title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
			key: "action",
			fixed: "right",
			width: responsive?.md ? 30 : 26,
			render: (value, record) => record.actions,
		},
	];

	const clusterShortName: string = "";

	const [amountFiltered, setAmountFiltered] = useState(0);
	const [page, setPage] = useState(1);
	const { data, status } = useMonitorNodeApi({ filter: { clusterShortName } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

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
				key: `ns-${i}`,
				actions: (
					<Space.Compact>
						{/* <Button icon={<EditOutlined />} onClick={() => setQuery({ lv1: "edit", type: "user", user: item.metadata?.name })}></Button> */}
						<Popconfirm
							title="Are you sure to delete this item?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							// onConfirm={() => deleteItem(item._id as string)}
							okText="Yes"
							cancelText="No"
						>
							<Button icon={<DeleteOutlined />}></Button>
						</Popconfirm>
					</Space.Compact>
				),
			};
		}) || [];

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title={`Nodes (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
			<div>
				<Table
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedList}
					scroll={{ x: 1000 }}
					sticky={{ offsetHeader: 48 }}
					pagination={{
						pageSize,
						total: total_items,
						showTotal: (total) => {
							setAmountFiltered(total);
							return <>{total} items</>;
						},
					}}
					onChange={onTableChange}
				/>
			</div>
		</>
	);
};
