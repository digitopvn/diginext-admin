import { useSize } from "ahooks";
import { Button, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

import { useCloudProviderListApi } from "@/api/api-cloud-provider";
import type { ICluster, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id: string;
	key: React.Key;
	name: string;
	shortName: string;
	clusters?: ICluster[];
	owner?: IUser;
	createdAt: string;
	updatedAt: string;
}

// const data: DataType[] = [];
// for (let i = 0; i < 100; i++) {
// 	data.push({
// 		key: i,
// 		name: `Cloud Provider #${i}`,
// 		git: `Github`,
// 		version: "main",
// 		username: `goon`,
// 		createdAt: dayjs().format("LLL"),
// 	});
// }

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const CloudProviderList = () => {
	const { responsive } = useLayoutProvider();

	// config

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			width: 70,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => record.name.indexOf(value.toString()) > -1,
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
			onFilter: (value, record) => record.shortName.indexOf(value.toString()) > -1,
		},
		// {
		// 	title: "Clusters",
		// 	dataIndex: "clusters",
		// 	key: "clusters",
		// 	width: 30,
		// },
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
		// {
		// 	title: "Action",
		// 	key: "action",
		// 	width: 50,
		// 	fixed: "right",
		// 	render: () => (
		// 		<Space.Compact>
		// 			<Button icon={<EditOutlined />}></Button>
		// 			<Button icon={<DeleteOutlined />}></Button>
		// 		</Space.Compact>
		// 	),
		// },
	];

	const [page, setPage] = useState(1);
	const { data, status } = useCloudProviderListApi({ pagination: { page, size: pageSize } });
	const { list: cloudProviders, pagination } = data || {};
	const { total_items } = pagination || {};
	console.log("cloudProviders :>> ", cloudProviders);

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		if (current) setPage(current);
	};

	const displayedCloudProviders: DataType[] =
		cloudProviders?.map((provider, i) => {
			return {
				id: provider._id ?? i.toString(),
				key: provider._id ?? i.toString(),
				name: provider.name ?? "",
				shortName: provider.shortName ?? "",
				// clusters: (provider.clusters as ICluster[]) ?? [],
				// owner: provider.owner as IUser,
				updatedAt: dayjs(provider.updatedAt).format("LLL"),
				createdAt: dayjs(provider.createdAt).format("LLL"),
			};
		}) || [];

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<div className="h-full flex-auto overflow-hidden" ref={ref}>
			<Table
				sticky
				size="small"
				loading={status === "loading"}
				columns={columns}
				dataSource={displayedCloudProviders}
				scroll={{ x: 1200, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
				pagination={{ pageSize, total: total_items, position: ["bottomCenter"] }}
				onChange={onTableChange}
			/>
		</div>
	);
};
