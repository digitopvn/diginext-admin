/* eslint-disable no-nested-ternary */
import { DeleteOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { toInteger } from "lodash";
import Link from "next/link";
import React, { useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorDeploymentApi } from "@/api/api-monitor-deployment";
import { useUserDeleteApi } from "@/api/api-user";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeDeployment } from "@/types/KubeDeployment";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeDeployment {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = 200;

export const DeploymentList = () => {
	const { responsive } = useLayoutProvider();

	// clusters
	const { data: clusterRes, status: clusterApiStatus } = useClusterListApi();
	const { list: clusters = [] } = clusterRes || {};

	const clusterShortName: string = "";

	const [amountFiltered, setAmountFiltered] = useState(0);
	const [page, setPage] = useState(1);
	const { data, status } = useMonitorDeploymentApi({ filter: { clusterShortName } });
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

	const nameFilterList = list
		?.map((item) => {
			return { text: item.metadata?.name || "", value: item.metadata?.name || "" };
		})
		// filter empty values
		.filter((item) => item.value !== "")
		// filter unique values
		.filter((current, index, self) => index === self.findIndex((item) => item.text === current.text));

	const namespaceFilterList = list
		?.map((item) => {
			return { text: item.metadata?.namespace || "", value: item.metadata?.namespace || "" };
		})
		// filter empty values
		.filter((item) => item.value !== "")
		// filter unique values
		.filter((current, index, self) => index === self.findIndex((item) => item.text === current.text));

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 60,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			render: (value, record) => record.metadata?.name,
			filters: nameFilterList,
			onFilter: (value, record) => (record.metadata?.name ? record.metadata?.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Pods",
			dataIndex: "pods",
			key: "pods",
			width: 15,
			render: (value, record) => {
				const ready =
					record.status?.availableReplicas ??
					record.status?.readyReplicas ??
					(record.status?.replicas ?? 0) - (record.status?.unavailableReplicas ?? 0);
				const total = record.status?.replicas ?? 0;
				return (
					<Tag color={ready === 0 ? "error" : ready < total ? "warning" : "default"}>
						{ready}/{total}
					</Tag>
				);
			},
			filterSearch: true,
			filters: [
				{ text: "Ready", value: "ready" },
				{ text: "Partial", value: "partial" },
				{ text: "Failed", value: "failed" },
			],
			onFilter: (value, record) => {
				const ready =
					record.status?.availableReplicas ??
					record.status?.readyReplicas ??
					(record.status?.replicas ?? 0) - (record.status?.unavailableReplicas ?? 0);
				const total = record.status?.replicas ?? 0;
				if (value === "failed") return ready === 0;
				if (value === "partial") return ready > 0 && ready < total;
				return ready === total;
			},
		},
		{
			title: "CPU",
			dataIndex: "cpu",
			key: "cpu",
			width: 17,
			render: (value, record) => {
				const cpu = toInteger(record.cpuAvg?.replace("m", "")) || 0;
				const cpuMax = toInteger(record.cpuCapacity?.replace("m", "")) || 0;
				return cpuMax === 0 ? (
					<Tooltip overlay={<>Recommend: {record.cpuRecommend}</>}>
						<Tag color={cpuMax === 0 ? "default" : cpu > cpuMax * 0.8 ? "warning" : "success"}>{record.cpuAvg}</Tag>
					</Tooltip>
				) : (
					<Tag color={cpuMax === 0 ? "default" : cpu > cpuMax * 0.8 ? "warning" : "success"}>{record.cpuAvg}</Tag>
				);
			},
			// filterSearch: true,
			// filters: namespaceFilterList,
			// onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
			sorter: (a, b) => toInteger(a.cpuAvg?.replace("m", "")) - toInteger(b.cpuAvg?.replace("m", "")),
		},
		{
			title: "MEM",
			dataIndex: "memory",
			key: "memory",
			width: 17,
			render: (value, record) => {
				const mem = toInteger(record.memoryAvg?.replace("Mi", "")) || 0;
				const memMax = toInteger(record.memoryCapacity?.replace("Mi", "")) || 0;
				return memMax === 0 ? (
					<Tooltip overlay={<>Recommend: {record.memoryRecommend}</>}>
						<Tag color={memMax === 0 ? "default" : mem > memMax * 0.8 ? "warning" : "success"}>{record.memoryAvg}</Tag>
					</Tooltip>
				) : (
					<Tag color={memMax === 0 ? "default" : mem > memMax * 0.8 ? "warning" : "success"}>{record.memoryAvg}</Tag>
				);
			},
			// filterSearch: true,
			// filters: namespaceFilterList,
			// onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
			sorter: (a, b) => toInteger(a.memoryAvg?.replace("Mi", "")) - toInteger(b.memoryAvg?.replace("Mi", "")),
		},
		{
			title: "Namespace",
			dataIndex: "namespace",
			key: "namespace",
			width: 30,
			render: (value, record) => <Link href="#">{record.metadata?.namespace}</Link>,
			filterSearch: true,
			filters: namespaceFilterList,
			onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
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

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title={`Deployments (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
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
