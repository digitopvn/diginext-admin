/* eslint-disable no-nested-ternary */
import { DeleteOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { TableCurrentDataSource } from "antd/es/table/interface";
import dayjs from "dayjs";
import { toInteger } from "lodash";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorPodApi, useMonitorPodDeleteApi } from "@/api/api-monitor-pod";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubePod } from "@/types/KubePod";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubePod {
	key?: React.Key;
	id?: string;
	actions?: any;
}

export interface MonitoringProps {
	/**
	 * @default false
	 */
	hideHeader?: boolean;
	/**
	 * @default false
	 */
	hidePagination?: boolean;
	/**
	 * @default false
	 */
	autoHeight?: boolean;
}

const pageSize = 200;

export const PodList = (props?: MonitoringProps) => {
	const { responsive } = useLayoutProvider();
	const [query, { setQuery }] = useRouterQuery();
	const { namespace: namespaceName, cluster: clusterSlug } = query;

	// clusters
	const { data: clusterRes, status: clusterApiStatus } = useClusterListApi();
	const { list: clusters = [] } = clusterRes || {};

	const [amountFiltered, setAmountFiltered] = useState(0);
	const [page, setPage] = useState(1);
	const { data, status } = useMonitorPodApi({ filter: { cluster: clusterSlug, namespace: namespaceName } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

	const [deletePodApi, deletePodApiStatus] = useMonitorPodDeleteApi();

	const onTableChange = (_pagination: TablePaginationConfig, extra: TableCurrentDataSource<DataType>) => {
		const { current } = _pagination;
		setAmountFiltered(extra.currentDataSource?.length ?? 0);
		if (current) setPage(current);
	};
	useEffect(() => setAmountFiltered(list?.length ?? 0), [list]);

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
							onConfirm={() => deletePodApi({ cluster: item.cluster, namespace: item.metadata.namespace, name: item.metadata.name })}
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

	const phaseFilterList = list
		?.map((record) => {
			const phase = record.status?.containerStatuses?.find((cont) => cont.ready === false) ? "Crashed" : record.status?.phase;
			return { text: phase || "", value: phase || "" };
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
			title: "Status",
			dataIndex: "phase",
			key: "phase",
			width: 18,
			render: (value, record) => {
				const phase = record.status?.containerStatuses?.find((cont) => cont.ready === false) ? "Crashed" : record.status?.phase;
				return (
					<Tag
						color={
							phase === "Running" || phase === "Succeeded" ? "success" : phase === "Crashed" || phase === "Failed" ? "error" : "blue"
						}
					>
						{phase}
					</Tag>
				);
			},
			filterSearch: true,
			filters: phaseFilterList,
			onFilter: (value, record) => {
				const phase = record.status?.containerStatuses?.find((cont) => cont.ready === false) ? "Crashed" : record.status?.phase;
				return value === phase;
			},
		},
		{
			title: "CPU",
			dataIndex: "cpu",
			key: "cpu",
			width: 17,
			render: (value, record) => <Tag>{record.cpu}</Tag>,
			// filterSearch: true,
			// filters: namespaceFilterList,
			// onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
			sorter: (a, b) => toInteger(a.cpu?.replace("m", "")) - toInteger(b.cpu?.replace("m", "")),
		},
		{
			title: "MEM",
			dataIndex: "memory",
			key: "memory",
			width: 17,
			render: (value, record) => <Tag>{record.memory}</Tag>,
			// filterSearch: true,
			// filters: namespaceFilterList,
			// onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
			sorter: (a, b) => toInteger(a.memory?.replace("Mi", "")) - toInteger(b.memory?.replace("Mi", "")),
		},
		{
			title: "Namespace",
			dataIndex: "namespace",
			key: "namespace",
			width: 25,
			render: (value, record) => (
				<Link
					href="#"
					onClick={(e) => {
						e.preventDefault();
						setQuery({ ...query, namespace: record.metadata?.namespace });
					}}
				>
					{record.metadata?.namespace}
				</Link>
			),
			filterSearch: true,
			filters: namespaceFilterList,
			onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Node",
			dataIndex: "node",
			key: "node",
			width: 25,
			render: (value, record) => <Link href="#">{record.spec?.nodeName}</Link>,
			// filterSearch: true,
			// filters: namespaceFilterList,
			// onFilter: (value, record) => (record.metadata?.namespace ? record.metadata?.namespace.indexOf(value.toString()) > -1 : true),
		},

		{
			title: "Cluster",
			dataIndex: "clusterSlug",
			key: "clusterSlug",
			width: 25,
			render: (value) => (
				<Button
					type="link"
					style={{ padding: 0 }}
					onClick={(e) => {
						setQuery({ ...query, cluster: value });
					}}
				>
					{value}
				</Button>
			),
			filterSearch: true,
			filters: clusters.map((cluster) => {
				return { text: cluster.slug || "", value: cluster.slug || "" };
			}),
			onFilter: (value, record) => (record.clusterSlug ? record.clusterSlug.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Created at",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 25,
			render: (value, record) => <DateDisplay date={record.metadata?.creationTimestamp} />,
			sorter: (a, b) => dayjs(a.metadata?.creationTimestamp).diff(dayjs(b.metadata?.creationTimestamp)),
		},
		{
			title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
			key: "action",
			fixed: "right",
			width: responsive?.md ? 22 : 18,
			render: (value, record) => record.actions,
		},
	];

	const ref = useRef(null);
	const size = useSize(ref);

	/**
	 * @type {HTMLAttributes}
	 */
	const classNames = props?.autoHeight ? "flex-auto h-auto" : "h-full flex-auto overflow-hidden";
	const scrollY = !props?.autoHeight ? (typeof size?.height !== "undefined" ? size.height - 140 : undefined) : undefined;

	return (
		<>
			{/* Page title & desc here */}
			{props?.hideHeader ? <></> : <PageTitle title={`Pods (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />}
			<div className={classNames} ref={ref}>
				<Table
					sticky
					size="small"
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedList}
					scroll={{ x: 1000, y: scrollY }}
					pagination={{
						pageSize,
						position: ["bottomCenter"],
						hideOnSinglePage: true,
					}}
					onChange={(_pagination, filters, sorter, extra) => onTableChange(_pagination, extra)}
				/>
			</div>
		</>
	);
};
