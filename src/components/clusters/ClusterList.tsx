import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useClusterDeleteApi, useClusterListApi } from "@/api/api-cluster";
import type { ICluster, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends ICluster {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const ClusterList = () => {
	const { responsive } = useLayoutProvider();

	//
	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 70,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name ? record.name.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Short name",
			width: 60,
			dataIndex: "shortName",
			key: "shortName",
			render: (value) => (
				<Button type="link" style={{ padding: 0 }}>
					{value}
				</Button>
			),
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.shortName ? record.shortName.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Provider",
			dataIndex: "provider",
			key: "provider",
			width: 40,
			render: (value, record) => <>{record.providerShortName}</>,
		},
		{
			title: "Verified",
			dataIndex: "isVerified",
			key: "isVerified",
			width: 30,
			render: (value, record) => <>{record.isVerified ? "YES" : "NO"}</>,
		},
		{
			title: "Created by",
			dataIndex: "owner",
			key: "owner",
			width: 50,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.owner ? ((record.owner as IUser).name || "").toLowerCase().indexOf(value.toString()) > -1 : true),
			render: (value, record) => <>{record.owner && (record.owner as IUser).name}</>,
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
	//
	const [page, setPage] = useState(1);
	const { data, status } = useClusterListApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: clusters, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("clusters :>> ", clusters);

	const [deleteApi] = useClusterDeleteApi();

	const [query, { setQuery }] = useRouterQuery();

	const deleteCluster = async (id: string) => {
		const res = await deleteApi({ _id: id });
		console.log("deleteCluster :>> ", res);
	};

	const displayedData =
		clusters?.map((cluster) => {
			return {
				...cluster,
				actions: (
					<Space.Compact>
						<Button
							icon={<EditOutlined />}
							onClick={() => setQuery({ lv1: "edit", type: "cluster", cluster_slug: cluster.slug })}
						></Button>
						<Popconfirm
							title="Are you sure to delete this cluster?"
							description={<span className="text-red-500">Caution: this is permanent and cannot be rolled back.</span>}
							onConfirm={() => deleteCluster(cluster._id as string)}
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
				scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 100 : undefined }}
				pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
				onChange={onTableChange}
			/>
		</div>
	);
};
