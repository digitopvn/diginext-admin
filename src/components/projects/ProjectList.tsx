import {
	AppstoreAddOutlined,
	BuildOutlined,
	CheckCircleOutlined,
	EditOutlined,
	EyeOutlined,
	GlobalOutlined,
	PauseCircleOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";

import { useProjectListWithAppsApi } from "@/api/api-project";
import type { IAppEnvironment } from "@/api/api-types";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	key?: React.Key;
	name?: string;
	cluster?: string;
	owner?: string;
	updatedAt?: string;
	status?: string;
	action?: string;
	url?: string;
	children?: DataType[];
}

const columns: ColumnsType<DataType> = [
	{
		title: "Project/app",
		width: 70,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
	},
	{
		title: "Cluster",
		width: 60,
		dataIndex: "cluster",
		key: "cluster",
		render: (value) => (
			<Button type="link" style={{ padding: 0 }}>
				{value}
			</Button>
		),
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.cluster && record.cluster.indexOf(value.toString()) > -1) || true,
	},
	{
		title: "Last updated by",
		dataIndex: "owner",
		key: "owner",
		width: 50,
		filterSearch: true,
		filters: [{ text: "goon", value: "goon" }],
		onFilter: (value, record) => (record.owner && record.owner.indexOf(value.toString()) > -1) || true,
		render: (value) => <>{value?.email}</>,
	},
	{
		title: "Last updated",
		dataIndex: "updatedAt",
		key: "updatedAt",
		width: 50,
		render: (value) => <>{(dayjs(value) as any).fromNow()}</>,
		sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
	},
	{
		title: "Status",
		dataIndex: "status",
		fixed: "right",
		key: "status",
		width: 30,
		filters: [{ text: "live", value: "live" }],
		render: (value) => (
			<Tag color="success" icon={<CheckCircleOutlined className="align-middle" />}>
				{value}
			</Tag>
		),
	},
	{
		title: "Action",
		key: "action",
		fixed: "right",
		width: 50,
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

// const data: DataType[] = [];
// for (let i = 0; i < 100; i++) {
// 	const apps = [{ name: "front-end" }, { name: "back-end" }];
// 	data.push({
// 		key: i,
// 		name: `Project #${i}`,
// 		cluster: `Cluster ${i}`,
// 		owner: `goon`,
// 		updatedAt: dayjs().format("LLL"),
// 		status: "live",
// 		action: "project",
// 		apps: apps.map((app, ai) => {
// 			const envs = [{ name: "dev" }, { name: "prod" }];
// 			return {
// 				key: `app-${i}-${ai}`,
// 				name: app.name,
// 				cluster: `Cluster ${i}`,
// 				owner: `goon`,
// 				updatedAt: dayjs().format("LLL"),
// 				status: "live",
// 				action: "app",
// 				apps: envs.map((e, ei) => {
// 					return {
// 						key: `env-${i}-${ai}-${ei}`,
// 						name: e.name.toUpperCase(),
// 						cluster: `Cluster ${i}`,
// 						owner: `goon`,
// 						updatedAt: dayjs().format("LLL"),
// 						status: "live",
// 						action: "env",
// 					};
// 				}),
// 			};
// 		}),
// 	});
// }

export const ProjectList = () => {
	const { data: projects } = useProjectListWithAppsApi();

	const displayedProjects = projects?.map((p) => {
		return {
			...p,
			action: "project",
			key: p._id,
			status: "live",
			children: p.apps
				? p.apps.map((app) => {
						const environmentNames = Object.keys(app.environment ?? {});
						const environments: DataType[] = environmentNames.map((envName) => {
							const envStr = app.environment ? (app.environment[envName] as string) : "[]";
							const envData = JSON.parse(envStr) as IAppEnvironment;
							return {
								name: envName.toUpperCase(),
								key: `${p.slug}-${app.slug}-${envName}`,
								action: envName !== "prod" ? "env" : "env-prod",
								status: "live",
								url: envData.domains ? envData.domains[0] : "",
								...(envData as any),
							};
						});

						return { ...(app as any), key: app._id, status: "live", action: "app", children: environments };
				  })
				: [],
		};
	}) as any;
	console.log({ displayedProjects });

	return (
		<div>
			<Table
				columns={columns}
				dataSource={displayedProjects}
				scroll={{ x: 1200 }}
				sticky={{ offsetHeader: 48 }}
				pagination={{ pageSize: 20 }}
			/>
		</div>
	);
};
