import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, InfoCircleOutlined, LoadingOutlined, RocketOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useReleaseListApi } from "@/api/api-release";
import type { IRelease, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id?: string;
	key?: React.Key;
	children?: DataType[];
}

const columns: ColumnsType<IRelease & DataType> = [
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
		dataIndex: "buildStatus",
		// fixed: "right",
		key: "buildStatus",
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
					<Tooltip title="Roll out">
						<Button icon={<RocketOutlined />} />
					</Tooltip>
					<Tooltip title="Preview">
						<Button icon={<EyeOutlined />} href={`https://${record.prereleaseUrl}`} target="_blank" />
					</Tooltip>
				</Space.Compact>
			);
		},
	},
];

const pageSize = 100;

type IReleaseListProps = {
	project: string;
	app: string;
	offsetHeader?: number;
};

export const ReleaseList = (props: IReleaseListProps = {} as IReleaseListProps) => {
	const router = useRouter();
	// const [query] = useRouterQuery();

	const { project, app, offsetHeader = 0 } = props;

	const filter: any = {};
	if (project) filter.projectSlug = project;
	if (app) filter.appSlug = app;

	// const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);
	const [page, setPage] = useState(1);

	const { data } = useReleaseListApi({ populate: "owner", pagination: { page, size: pageSize }, filter });
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
				sticky={{ offsetHeader }}
				pagination={{ current: page, pageSize, total: total_pages }}
				onChange={onTableChange}
			/>
		</div>
	);
};
