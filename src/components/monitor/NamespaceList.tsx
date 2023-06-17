import { DeleteOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import { useMonitorNamespaceApi } from "@/api/api-monitor-namespace";
import { useUserDeleteApi } from "@/api/api-user";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeNamespace } from "@/types/KubeNamespace";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeNamespace {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const NamespaceList = () => {
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
			render: (value, record) => record.metadata?.name,
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
	const { data, status } = useMonitorNamespaceApi({ filter: { clusterShortName } });
	const { list, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("users :>> ", list);

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
			<PageTitle title={`Namespaces (${amountFiltered})`} breadcrumbs={[{ name: "Workspace" }]} actions={[]} />
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
