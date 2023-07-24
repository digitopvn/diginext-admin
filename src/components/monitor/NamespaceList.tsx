import { DeleteOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { TableCurrentDataSource } from "antd/es/table/interface";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorNamespaceApi, useMonitorNamespaceDeleteApi } from "@/api/api-monitor-namespace";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeNamespace } from "@/types/KubeNamespace";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeNamespace {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = 200;

export const NamespaceList = () => {
	const { responsive } = useLayoutProvider();

	// clusters
	const { data: clusterRes, status: clusterApiStatus } = useClusterListApi();
	const { list: clusters = [] } = clusterRes || {};

	const clusterSlug: string = "";

	const [amountFiltered, setAmountFiltered] = useState(0);
	const [page, setPage] = useState(1);
	const { data, status } = useMonitorNamespaceApi({ filter: { cluster: clusterSlug } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

	const [deleteNamespaceApi, deleteNamespaceApiStatus] = useMonitorNamespaceDeleteApi();

	const onTableChange = (_pagination: TablePaginationConfig, extra: TableCurrentDataSource<DataType>) => {
		const { current } = _pagination;
		setAmountFiltered(extra.currentDataSource?.length ?? 0);
		if (current) setPage(current);
	};
	useEffect(() => setAmountFiltered(list?.length ?? 0), [list]);

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 60,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			render: (value, record) => record.metadata?.name,
			filters: list?.map((item) => {
				return { text: item.metadata?.name || "", value: item.metadata?.name || "" };
			}),
			onFilter: (value, record) => (record.metadata?.name ? record.metadata?.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Cluster",
			dataIndex: "clusterSlug",
			key: "clusterSlug",
			width: 30,
			render: (value) => (
				<Button type="link" style={{ padding: 0 }}>
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
							onConfirm={() => deleteNamespaceApi({ cluster: item.cluster, name: item.metadata?.name })}
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
			<PageTitle title={`Namespaces (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />

			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					sticky
					size="small"
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedList}
					scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
					pagination={{
						pageSize,
						position: ["bottomCenter"],
					}}
					onChange={(_pagination, filters, sorter, extra) => onTableChange(_pagination, extra)}
				/>
			</div>
		</>
	);
};
