import { DeleteOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, notification, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { TableCurrentDataSource } from "antd/es/table/interface";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorServiceApi } from "@/api/api-monitor-service";
import { useUserDeleteApi } from "@/api/api-user";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeService } from "@/types/KubeService";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeService {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = 200;

export const ServiceList = () => {
	const { responsive } = useLayoutProvider();

	// clusters
	const { data: clusterRes, status: clusterApiStatus } = useClusterListApi();
	const { list: clusters = [] } = clusterRes || {};

	const clusterShortName: string = "";

	const [amountFiltered, setAmountFiltered] = useState(0);
	const [page, setPage] = useState(1);
	const { data, status } = useMonitorServiceApi({ filter: { clusterShortName } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};

	const [deleteApi] = useUserDeleteApi();
	const [query, { setQuery }] = useRouterQuery();

	const deleteItem = async (id: string) => {
		const res = await deleteApi({ _id: id });
		if (res?.status) notification.success({ message: `Item deleted successfully.` });
	};

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

	const ref = useRef(null);
	const size = useSize(ref);
	// console.log("size :>> ", size);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title={`Services (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
			<div className="flex-auto overflow-auto" ref={ref}>
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
