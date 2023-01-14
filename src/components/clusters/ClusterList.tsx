import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import type { ICluster, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useRouterQuery } from "@/plugins/useRouterQuery";
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

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
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
		width: 30,
		render: (value, record) => <>{record.providerShortName}</>,
	},
	{
		title: "Created by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner ? ((record.owner as IUser).name || "").toLowerCase().indexOf(value.toString()) > -1 : true),
		render: (value, record) => <>{(record.owner as IUser).name}</>,
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

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const ClusterList = () => {
	const [page, setPage] = useState(1);
	const { data } = useClusterListApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: clusters, pagination } = data || {};
	const { total_pages } = pagination || {};
	console.log("clusters :>> ", clusters);

	const [query, { setQuery }] = useRouterQuery();

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
						<Button icon={<DeleteOutlined />}></Button>
					</Space.Compact>
				),
			} as DataType;
		}) || [];

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};

	return (
		<div>
			<Table
				columns={columns}
				dataSource={displayedData}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize, total: total_pages }}
				onChange={onTableChange}
			/>
		</div>
	);
};
