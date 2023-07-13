import {
	AppstoreAddOutlined,
	BuildOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	GlobalOutlined,
	InfoCircleOutlined,
	MoreOutlined,
	PlusCircleFilled,
	PlusOutlined,
	QrcodeOutlined,
	RocketOutlined,
} from "@ant-design/icons";
import { useSize } from "ahooks";
import { Button, Dropdown, Modal, notification, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { useAppDeleteApi, useAppEnvVarsDeleteApi } from "@/api/api-app";
import { useProjectDeleteApi, useProjectListWithAppsApi } from "@/api/api-project";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { AppConfig } from "@/utils/AppConfig";

import AddDomainForm from "./AddDomainForm";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType {
	id?: string;
	key?: React.Key;
	name?: string;
	slug?: string;
	cluster?: string;
	replicas?: number;
	owner?: string;
	updatedAt?: string;
	createdAt?: string;
	status?: string;
	type?: string;
	actions?: string;
	url?: string;
	prereleaseUrl?: string;
	children?: DataType[];
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const ProjectList = () => {
	const router = useRouter();
	const [query, { setQuery }] = useRouterQuery();

	const { responsive } = useLayoutProvider();

	// table config
	const columns: ColumnsType<DataType> = [
		{
			title: "Project/app",
			width: responsive?.md ? 60 : 40,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			// filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.name && record.name.indexOf(value.toString()) > -1) || true,
			render: (value, record) =>
				// eslint-disable-next-line no-nested-ternary
				record.type === "project" ? (
					<>
						<Link href={`/apps?project=${record.slug}`}>
							<strong>{record.name}</strong>
						</Link>{" "}
						<Tag>{record.slug}</Tag>
					</>
				) : record.type === "app" ? (
					<>
						<span className="text-purple-300">{record.name}</span> <Tag>{record.slug}</Tag>
					</>
				) : (
					value
				),
		},
		{
			title: "Cluster",
			width: 30,
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
			title: "Ready",
			width: 20,
			dataIndex: "readyCount",
			key: "readyCount",
			render: (value, record) =>
				value && record.replicas ? (
					<Tag>
						{value}/{record.replicas}
					</Tag>
				) : (
					<></>
				),
		},
		{
			title: "Last updated by",
			dataIndex: "owner",
			key: "owner",
			width: 35,
			filterSearch: true,
			filters: [{ text: "goon", value: "goon" }],
			onFilter: (value, record) => (record.owner && record.owner.indexOf(value.toString()) > -1) || true,
			render: (value) => <>{value?.name}</>,
		},
		{
			title: "Last updated",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 30,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
		},
		{
			title: "Created at",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 30,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
		},
		{
			title: "Status",
			dataIndex: "status",
			fixed: responsive?.md ? "right" : undefined,
			key: "status",
			width: responsive?.md ? 20 : 15,
			filters: [
				{ text: "healthy", value: "healthy" },
				{ text: "undeployed", value: "undeployed" },
				{ text: "partial_healthy", value: "partial_healthy" },
				{ text: "failed", value: "failed" },
				{ text: "crashed", value: "crashed" },
				{ text: "unknown", value: "unknown" },
			],
			filterSearch: true,
			onFilter: (value, record) => {
				if (record.type === "project" || record.type === "app") return true;
				console.log("record.status === value :>> ", record.status, value);
				if (record.status) return record.status === value;
				return false;
			},
			render: (value) => (
				// <Tag color="success" icon={<CheckCircleOutlined className="align-middle" />}>
				<Tag
					// eslint-disable-next-line no-nested-ternary
					color={value === "healthy" ? "success" : value === "undeployed" ? "pink" : "default"}
					icon={<InfoCircleOutlined className="align-middle" />}
				>
					{value}
				</Tag>
			),
		},
		{
			title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
			key: "action",
			fixed: "right",
			width: responsive?.md ? 18 : 13,
			dataIndex: "action",
			render: (value, record) => record.actions,
		},
	];

	// pagination
	const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);

	// fetch projects
	const { data, status } = useProjectListWithAppsApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: projects, pagination } = data || {};
	const { total_pages, total_items } = pagination || {};

	const [deleteProjectApi, deleteProjectApiStatus] = useProjectDeleteApi();
	const [deleteAppApi, deleteAppApiStatus] = useAppDeleteApi();
	const [deleteAppEnvApi, deleteAppEnvApiStatus] = useAppEnvVarsDeleteApi();

	// modals
	const [modal, contextHolder] = Modal.useModal();
	const openAddDomains = (app: string, env: string) => {
		console.log("env :>> ", env);
		const instance = modal.info({
			title: "Add new domains",
			icon: <PlusCircleFilled />,
			content: (
				<AddDomainForm
					app={app}
					env={env}
					next={() => {
						instance.destroy();
						notification.success({ message: "Congrats!", description: `New domain was added successfully!` });
					}}
				/>
			),
			footer: null,
			closable: true,
			maskClosable: true,
			onOk() {},
		});
	};

	// console.log({ total_pages });
	const openBuildList = (project: string, app: string, env: string) => {
		setQuery({ lv1: "build", project, app });
	};

	const openReleaseList = (project: string, app: string, env: string) => {
		setQuery({ lv1: "release", project, app, env });
	};

	const openEnvVarsEdit = (project: string, app: string, env: string) => {
		setQuery({ lv1: "env_vars", project, app, env });
	};

	const deleteProject = async (id: string) => {
		const result = await deleteProjectApi({ _id: id });
		console.log("[deleteProject] result :>> ", result);
	};

	const deleteApp = async (id: string) => {
		const result = await deleteAppApi({ _id: id });
		console.log("[deleteApp] result :>> ", result);
	};

	const deleteEnvironment = async (appId: string, env: string) => {
		const result = await deleteAppEnvApi({ _id: appId, env });
		console.log("[deleteEnvironment] result :>> ", result);
	};

	// table pagination
	useEffect(() => {
		if (!router.isReady) return;
		const newPage = query.page ? parseInt(query.page.toString(), 10) : 1;
		setPage(newPage);
	}, [query.page]);

	const displayedProjects = projects?.map((p: any) => {
		return {
			...p,
			type: "project",
			actions: (
				<Space.Compact>
					{/* <Tooltip title="Edit project">
						<Button icon={<EditOutlined />} />
					</Tooltip> */}
					{/* <Button icon={<PauseCircleOutlined />} /> */}
					<Popconfirm
						title="Are you sure to delete this project?"
						description={
							<span className="text-red-500">Caution: all of the related apps & deployed environments will be also deleted.</span>
						}
						onConfirm={() => deleteProject(p._id as string)}
						okText="Yes"
						cancelText="No"
					>
						<Button icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space.Compact>
			),
			key: p._id,
			id: p._id,
			status: "N/A",
			children: p.apps
				? p.apps.map((app: any) => {
						const envList = Object.keys(app.deployEnvironment ?? {});
						const environments: DataType[] = envList.map((envName) => {
							// console.log("envStr :>> ", envStr);
							const deployEnvironment = (app.deployEnvironment || {})[envName] || {};

							const record: any = {
								name: (
									<Button
										type="link"
										onClick={() => setQuery({ lv1: "deploy_environment", project: p.slug, app: app.slug, env: envName })}
									>
										{envName.toUpperCase()}
									</Button>
								),
								key: `${p.slug}-${app.slug}-${envName}`,
								id: envName,
								slug: envName,
								projectSlug: p.slug,
								appSlug: app.slug,
								type: envName !== "prod" ? "env" : "env-prod",
								status: "N/A",
								url: deployEnvironment.domains ? `https://${deployEnvironment.domains[0]}` : "",
								prereleaseUrl:
									envName === "prod"
										? deployEnvironment.prereleaseUrl ?? `https://${app.slug}.prerelease.diginext.site`.toLowerCase()
										: "",
								...(deployEnvironment as any),
							};

							record.actions =
								envName === "prod" ? (
									<Space.Compact>
										<Tooltip title="Preview pre-release site">
											<Button
												icon={<EyeOutlined />}
												href={record.prereleaseUrl}
												target="_blank"
												disabled={isEmpty(record.prereleaseUrl)}
											/>
										</Tooltip>
										<Tooltip title="View live website">
											<Button icon={<GlobalOutlined />} href={record.url} target="_blank" disabled={isEmpty(record.url)} />
										</Tooltip>
										{/* <Tooltip title="Take down">
											<Button icon={<PauseCircleOutlined />} />
										</Tooltip> */}
										<Dropdown
											menu={{
												items: [
													{
														label: "Deploy now",
														key: "deploy-now",
														icon: <RocketOutlined />,
														onClick: () => {
															let path = `/deploy?app=${app.slug}&env=${envName}`;
															if (deployEnvironment.registry) path += `&registry=${deployEnvironment.registry}`;
															if (deployEnvironment.cluster) path += `&cluster=${deployEnvironment.cluster}`;
															if (deployEnvironment.port) path += `&port=${deployEnvironment.port}`;
															router.push(path);
														},
													},
													{
														label: "List of builds",
														key: "list-of-builds",
														icon: <BuildOutlined />,
														onClick: () => openBuildList(record.projectSlug, record.appSlug, record.id),
													},
													{
														label: "List of releases",
														key: "list-of-releases",
														icon: <RocketOutlined />,
														onClick: () => openReleaseList(record.projectSlug, record.appSlug, envName),
													},
													{
														label: "Modify environment variables",
														key: "env-vars",
														icon: <QrcodeOutlined />,
														onClick: () => openEnvVarsEdit(record.projectSlug, record.appSlug, envName),
													},
													{
														label: "Add domains",
														key: "add-domains",
														icon: <AppstoreAddOutlined />,
														onClick: () => openAddDomains(record.appSlug, envName),
													},
												],
											}}
										>
											<Button style={{ padding: "4px 4px" }}>
												<MoreOutlined />
											</Button>
										</Dropdown>
										<Popconfirm
											title="Are you sure to delete this environment?"
											description={
												<span className="text-red-500">
													Caution: this is permanent and cannot be rolled back (excepts re-deploying).
												</span>
											}
											onConfirm={() => deleteEnvironment(app._id as string, envName)}
											okText="Yes"
											cancelText="No"
										>
											<Button icon={<DeleteOutlined />} />
										</Popconfirm>
									</Space.Compact>
								) : (
									<Space.Compact>
										<Tooltip title="View website">
											<Button icon={<EyeOutlined />} href={record.url} target="_blank" disabled={isEmpty(record.url)} />
										</Tooltip>
										{/* <Button icon={<PauseCircleOutlined />} /> */}
										<Dropdown
											menu={{
												items: [
													{
														label: "Deploy now",
														key: "deploy-now",
														icon: <RocketOutlined />,
														onClick: () =>
															router.push(
																`/deploy?app=${app.slug}&env=${envName}&registry=${deployEnvironment.registry}&cluster=${deployEnvironment.cluster}`
															),
													},
													{
														label: "List of builds",
														key: "list-of-builds",
														icon: <BuildOutlined />,
														onClick: () => openBuildList(record.projectSlug, record.appSlug, record.id),
													},
													{
														label: "Modify environment variables",
														key: "env-vars",
														icon: <QrcodeOutlined />,
														onClick: () => openEnvVarsEdit(record.projectSlug, record.appSlug, envName),
													},
													{
														label: "Add domains",
														key: "add-domains",
														icon: <AppstoreAddOutlined />,
														onClick: () => openAddDomains(record.appSlug, envName),
													},
												],
											}}
										>
											<Button style={{ padding: "4px 4px" }}>
												<MoreOutlined />
											</Button>
										</Dropdown>
										<Popconfirm
											title="Are you sure to delete this environment?"
											description={
												<span className="text-red-500">
													Caution: this is permanent and cannot be rolled back (excepts re-deploying).
												</span>
											}
											onConfirm={() => deleteEnvironment(app._id as string, envName)}
											okText="Yes"
											cancelText="No"
										>
											<Button icon={<DeleteOutlined />} />
										</Popconfirm>
									</Space.Compact>
								);

							return record;
						});

						return {
							...(app as any),
							key: app._id,
							id: app._id,
							status: "N/A",
							type: "app",
							children: environments,
							actions: (
								<Space.Compact>
									<Tooltip title="Edit app">
										<Button icon={<EditOutlined />} />
									</Tooltip>
									{/* <Button icon={<PauseCircleOutlined />} /> */}
									<Popconfirm
										title="Are you sure to delete this app?"
										description={
											<span className="text-red-500">
												Caution: all of the related deployed environments will be also deleted.
											</span>
										}
										onConfirm={() => deleteApp(app._id as string)}
										okText="Yes"
										cancelText="No"
									>
										<Button icon={<DeleteOutlined />} />
									</Popconfirm>
								</Space.Compact>
							),
						};
				  })
				: [],
		};
	}) as any;
	// console.log({ displayedProjects });

	const onTableChange = (_pagination: TablePaginationConfig) => {
		const { current } = _pagination;
		setQuery({ page: current ?? 1 });
	};

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle
				title="Projects"
				breadcrumbs={[{ name: "Workspace" }]}
				actions={[
					<Button key="import-btn" icon={<PlusOutlined className="align-middle" />}>
						Import
					</Button>,
				]}
			/>

			{/* Page Content */}
			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					size="small"
					loading={status === "loading"}
					columns={columns}
					dataSource={displayedProjects}
					// scroll={{ x: window?.innerWidth >= 728 ? 1500 : 600 }}
					scroll={{ x: responsive?.md ? 1600 : 1200, y: typeof size?.height !== "undefined" ? size.height - 140 : undefined }}
					sticky={{ offsetHeader: 0 }}
					pagination={{
						showSizeChanger: true,
						current: page,
						// defaultCurrent: page,
						defaultPageSize: pageSize,
						total: total_items,
						// total: total_pages,
						// , pageSize
						position: ["bottomCenter"],
					}}
					onChange={onTableChange}
				/>
				{contextHolder}
			</div>
		</>
	);
};
