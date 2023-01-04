import { BugOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useBuildListApi } from "@/api/api-build";
import type { IBuild, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { AppConfig } from "@/utils/AppConfig";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id?: string;
	key?: React.Key;
	children?: DataType[];
}

const columns: ColumnsType<IBuild & DataType> = [
	{
		title: "Name",
		width: 70,
		dataIndex: "name",
		key: "name",
		// fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
		render: (value, record) => (
			<>
				<p>
					<strong>{value}</strong>
				</p>
				<p>
					Created <DateDisplay date={record.createdAt} />
				</p>
			</>
		),
	},
	{
		title: "Created by",
		dataIndex: "owner",
		key: "owner",
		width: 40,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner && ((record.owner as IUser).slug || "").indexOf(value.toString()) > -1) || true,
		render: (value) => <>{value?.name}</>,
	},
	// {
	// 	title: "Created at",
	// 	dataIndex: "createdAt",
	// 	key: "createdAt",
	// 	width: 50,
	// 	render: (value) => <DateDisplay date={value} />,
	// 	sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
	// },
	{
		title: "Status",
		dataIndex: "status",
		// fixed: "right",
		key: "status",
		width: 30,
		filters: [{ text: "live", value: "live" }],
		render: (value) => {
			let color = "warning";
			let icon = <InfoCircleOutlined />;
			switch (value) {
				case "building":
					color = "processing";
					icon = <LoadingOutlined className="align-middle" />;
					break;
				case "failed":
					color = "error";
					icon = <CloseCircleOutlined className="align-middle" />;
					break;
				case "success":
					color = "success";
					icon = <CheckCircleOutlined className="align-middle" />;
					break;
				case "start":
				default:
					color = "default";
					icon = <InfoCircleOutlined />;
					break;
			}
			return (
				<Tag color={color} icon={icon}>
					{value}
				</Tag>
			);
		},
	},
	{
		title: "Action",
		key: "action",
		// fixed: "right",
		width: 30,
		dataIndex: "action",
		render: (value, record) => {
			return (
				<Space.Compact>
					<Tooltip title="View log">
						<Button icon={<BugOutlined />} />
					</Tooltip>
					<Tooltip title="Go to image link">
						<Button icon={<EyeOutlined />} href={`https://${record.image}`} target="_blank" />
					</Tooltip>
				</Space.Compact>
			);
		},
	},
];

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

type IBuildListProps = {
	project: string;
	app: string;
	env: string;
};

export const BuildList = (props: IBuildListProps = {} as IBuildListProps) => {
	const router = useRouter();
	// const [query] = useRouterQuery();

	const { project, app, env } = props;

	const filter: any = {};
	if (project) filter.projectSlug = project;
	if (app) filter.appSlug = app;
	if (env) filter.env = env;

	// const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);
	const [page, setPage] = useState(1);

	const { data } = useBuildListApi({ populate: "owner", pagination: { page, size: pageSize }, filter });
	const { list: builds, pagination } = data || {};
	const { total_pages } = pagination || {};

	// useEffect(() => {
	// 	if (!router.isReady) return;
	// 	const newPage = query.page ? parseInt(query.page.toString(), 10) : 1;
	// 	setPage(newPage);
	// }, [query.page]);

	// console.log({ builds });

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		// router.push(`${router.pathname}`, { query: { page: current ?? 1 } });
		setPage(current ?? 1);
	};

	return (
		<div>
			<Table
				columns={columns}
				dataSource={builds}
				scroll={{ x: 600 }}
				sticky={{ offsetHeader: 0 }}
				pagination={{ current: page, pageSize, total: total_pages }}
				onChange={onTableChange}
			/>
		</div>
	);
};
