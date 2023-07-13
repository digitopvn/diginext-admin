import {
	AppstoreAddOutlined,
	BuildOutlined,
	CheckCircleOutlined,
	EditOutlined,
	EyeOutlined,
	GlobalOutlined,
	PauseCircleOutlined,
} from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import { useAppListApi } from "@/api/api-app";
import type { IApp, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends IApp {
	key?: React.Key;
	cluster?: string;
	status?: string;
	action?: string;
	url?: string;
	children?: DataType[];
}

const pageSize = 200;

export const AppList = () => {
	const router = useRouter();
	const { project: projectSlug } = router.query;

	// Config
	const columns: ColumnsType<DataType> = [
		{
			title: "App name",
			width: 70,
			dataIndex: "name",
			key: "name",
			fixed: "left",
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
		},
		{
			title: "Project",
			width: 60,
			dataIndex: "project",
			key: "project",
			render: (value, record) => (
				<Button type="link" style={{ padding: 0 }}>
					{record.projectSlug}
				</Button>
			),
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.cluster ? record.cluster.indexOf(value.toString()) > -1 : true),
		},
		{
			title: "Last updated by",
			dataIndex: "owner",
			key: "owner",
			width: 50,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.owner ? ((record.owner as IUser).slug || "").indexOf(value.toString()) > -1 : true),
			render: (value) => <>{value?.slug}</>,
		},
		{
			title: "Last updated",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 50,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
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
			title: "Status",
			dataIndex: "status",
			fixed: "right",
			key: "status",
			width: 30,
			filters: [{ text: "live", value: "live" }],
			render: (value) =>
				value ? (
					<Tag color="success" icon={<CheckCircleOutlined className="align-middle" />}>
						{value}
					</Tag>
				) : (
					"-"
				),
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			width: 60,
			dataIndex: "action",
			render: (value, record) => {
				switch (value) {
					case "app":
						return (
							<Space.Compact>
								<Button icon={<EditOutlined />} />
								<Button icon={<PauseCircleOutlined />} />
							</Space.Compact>
						);

					case "env":
						return (
							<Space.Compact>
								<Button icon={<EyeOutlined />} href={record.url} target="_blank" />
								<Button icon={<PauseCircleOutlined />} />
								<Button icon={<BuildOutlined />} />
								<Button icon={<EditOutlined />} />
							</Space.Compact>
						);

					case "env-prod":
						return (
							<Space.Compact>
								<Button icon={<EyeOutlined />} />
								<Button icon={<GlobalOutlined />} />
								<Button icon={<PauseCircleOutlined />} />
								<Button icon={<AppstoreAddOutlined />} />
								<Button icon={<EditOutlined />} />
							</Space.Compact>
						);

					case "project":
						return (
							<Space.Compact>
								<Button icon={<EditOutlined />} />
								<Button icon={<PauseCircleOutlined />} />
							</Space.Compact>
						);

					default:
						return <></>;
				}
			},
		},
	];

	// APIs
	let filter: any = {};
	if (projectSlug) filter = { projectSlug };
	const { data: appResponse, status } = useAppListApi({ filter, populate: "owner,project" });
	const { list: apps } = appResponse || {};

	const displayedApps: DataType[] = (apps || []).map((app) => {
		const envList = Object.keys(app.deployEnvironment ?? {});
		const environments: DataType[] = envList.map((envName) => {
			const deployEnvironment = (app.deployEnvironment || {})[envName] || {};
			return {
				name: envName.toUpperCase(),
				key: `${app.slug}-${envName}`,
				id: envName,
				slug: envName,
				action: envName !== "prod" ? "env" : "env-prod",
				status: "live",
				url: deployEnvironment.domains ? `https://${deployEnvironment.domains[0]}` : "",
				...(deployEnvironment as any),
			};
		});
		return { ...app, children: environments };
	});

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title="Apps" breadcrumbs={[{ name: "Workspace" }]} />

			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedApps}
					scroll={{ x: 1000, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
					pagination={{
						pageSize,
						position: ["bottomCenter"],
					}}
					expandable={{
						defaultExpandAllRows: true,
					}}
					// onChange={(_pagination, filters, sorter, extra) => onTableChange(_pagination, extra)}
				/>
			</div>
		</>
	);
};
