import {
	AlertOutlined,
	AppstoreAddOutlined,
	BuildOutlined,
	ClearOutlined,
	CloudUploadOutlined,
	DeleteOutlined,
	DeploymentUnitOutlined,
	EditOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	GlobalOutlined,
	ImportOutlined,
	InfoCircleOutlined,
	MoreOutlined,
	PlusCircleFilled,
	PlusOutlined,
	PoweroffOutlined,
	QrcodeOutlined,
	RocketOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSize } from "ahooks";
import { Button, Dropdown, notification, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import {
	useAppArchiveApi,
	useAppDeleteApi,
	useAppDeployEnvironmentAwakeApi,
	useAppDeployEnvironmentDeleteApi,
	useAppDeployEnvironmentDownApi,
	useAppDeployEnvironmentSleepApi,
	useAppUnarchiveApi,
} from "@/api/api-app";
import { useBuildStartApi, useBuildStopApi } from "@/api/api-build";
import { useProjectDeleteApi, useProjectListWithAppsApi } from "@/api/api-project";
import type { IApp, IDeployEnvironment, IUser } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import SearchBox from "@/commons/SearchBox";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { useModalProvider } from "@/providers/ModalProvider";
import { AppConfig } from "@/utils/AppConfig";

import AddDomainForm from "./AddDomainForm";
import NewAppModal from "./NewAppModal";

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
	archivedAt?: string;
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
	const { modal } = useModalProvider();

	// pagination
	const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);

	// fetch projects
	const queryClient = useQueryClient();
	const {
		data,
		status: apiStatus,
		refetch: refetchProjecAndApps,
	} = useProjectListWithAppsApi({ populate: "owner", pagination: { page, size: pageSize } });
	const { list: projects, pagination } = data || {};
	const { total_pages, total_items } = pagination || {};

	// table config
	const columns: ColumnsType<DataType> = [
		{
			title: "Project/app",
			width: responsive?.md ? 60 : 40,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			filters: projects?.map((item) => {
				return { text: item?.slug || "", value: item?.slug || "" };
			}),
			onFilter: (value, record) => (record?.slug ? record?.slug.indexOf(value.toString()) > -1 : true),
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
						<span
							className="cursor-pointer text-purple-300 transition-colors hover:text-purple-500 hover:transition-colors"
							onClick={() => setQuery({ lv1: "edit", type: "app", app: record.slug })}
						>
							{record.name}
						</span>{" "}
						<Tag>{record.slug}</Tag>
						<Tag color="cyan">{(record as IApp).git?.provider}</Tag>
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
			dataIndex: "lastUpdatedBy",
			key: "lastUpdatedBy",
			width: 35,
			filterSearch: true,
			// filters: [{ text: "goon", value: "goon" }],
			// onFilter: (value, record) => (record.owner && record.owner.indexOf(value.toString()) > -1) || true,
			render: (value, record) => <>{value || (record.owner as IUser)?.name}</>,
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
				{ text: "archived", value: "archived" },
				{ text: "healthy", value: "healthy" },
				{ text: "undeployed", value: "undeployed" },
				{ text: "partial_healthy", value: "partial_healthy" },
				{ text: "failed", value: "failed" },
				{ text: "crashed", value: "crashed" },
				{ text: "unknown", value: "unknown" },
			],
			filterSearch: true,
			onFilter: (value, record) => {
				if (value === "archived") return typeof record.archivedAt !== "undefined";
				if (record.type === "project" || record.type === "app") return true;
				console.log("record.status === value :>> ", record.status, value);
				if (record.status) return record.status === value;
				return false;
			},
			render: (value, record) => {
				let status = value;
				if (record.type === "app") {
					// check for "undeployed" status?
				}
				if (record?.archivedAt) status = "archived";
				return (
					<Tag
						// eslint-disable-next-line no-nested-ternary
						color={value === "healthy" ? "success" : value === "undeployed" ? "pink" : "default"}
						icon={<InfoCircleOutlined className="align-middle" />}
					>
						{status}
					</Tag>
				);
			},
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

	const [deleteProjectApi, deleteProjectApiStatus] = useProjectDeleteApi();
	const [deleteAppApi, deleteAppApiStatus] = useAppDeleteApi();
	const [deleteAppEnvApi, deleteAppEnvApiStatus] = useAppDeployEnvironmentDeleteApi();
	const [archiveAppApi, archiveAppApiStatus] = useAppArchiveApi();
	const [unarchiveAppApi, unarchiveAppApiStatus] = useAppUnarchiveApi();

	const [startBuildApi, startBuildApiStatus] = useBuildStartApi();
	const [stopBuildApi, stopBuildApiStatus] = useBuildStopApi();

	const [sleepDeployEnvApi, sleepDeployEnvApiStatus] = useAppDeployEnvironmentSleepApi();
	const [awakeDeployEnvApi, awakeDeployEnvApiStatus] = useAppDeployEnvironmentAwakeApi();
	const [takeDownDeployEnvApi, takeDownDeployEnvApiStatus] = useAppDeployEnvironmentDownApi();

	// modals
	// const [modal, contextHolder] = Modal.useModal();
	const openAddDomains = (app: string, env: string) => {
		console.log("env :>> ", env);
		const instance = modal?.info({
			title: "Add new domains",
			icon: <PlusCircleFilled />,
			content: (
				<AddDomainForm
					app={app}
					env={env}
					next={() => {
						instance?.destroy();
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

	const openNewApp = () => {
		const instance = modal?.info({
			// title: "Add new domains",
			className: "!p-0",
			// centered: true,
			style: { padding: 0 },
			bodyStyle: { padding: 0 },
			icon: null,
			// width: 500,
			content: <NewAppModal onClose={() => instance?.destroy()} />,
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
		refetchProjecAndApps();
		console.log("[deleteApp] result :>> ", result);
	};

	const deleteEnvironment = async (appId: string, env: string) => {
		const result = await deleteAppEnvApi({ _id: appId, env });
		console.log("[deleteEnvironment] result :>> ", result);

		// reload project & app list
		queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
		queryClient.invalidateQueries({ queryKey: ["apps", "list"] });
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
			// PROJECTS
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

			// DEPLOY ENVIRONMENTS
			children: p.apps
				? p.apps.map((app: any) => {
						const envList = Object.keys(app.deployEnvironment ?? {});
						const environments: DataType[] = envList.map((envName) => {
							// console.log("envStr :>> ", envStr);
							const deployEnvironment = ((app.deployEnvironment || {})[envName] || {}) as IDeployEnvironment;

							const record: any = {
								name: (
									<>
										<Button
											type="link"
											onClick={() => setQuery({ lv1: "deploy_environment", project: p.slug, app: app.slug, env: envName })}
										>
											{envName.toUpperCase()}
										</Button>
										{/* <Tag>{deployEnvironment.registry}</Tag> */}
										<Tag color="green">Namespace: {deployEnvironment.namespace}</Tag>
									</>
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
													// {
													// 	label: "Build now",
													// 	key: "build-now",
													// 	icon: <AimOutlined />,
													// 	onClick: () => startBuildApi({}),
													// },
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
													{
														label: "Sleep",
														key: "sleep",
														icon: <EyeInvisibleOutlined />,
														onClick: () => sleepDeployEnvApi({ slug: record.appSlug, env: envName }),
													},
													{
														label: "Awake",
														key: "awake",
														icon: <AlertOutlined />,
														onClick: () => awakeDeployEnvApi({ slug: record.appSlug, env: envName }),
													},
													{
														label: "Take down",
														key: "take-down",
														icon: <PoweroffOutlined />,
														onClick: () => takeDownDeployEnvApi({ slug: record.appSlug, env: envName }),
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
													// {
													// 	label: "Build now",
													// 	key: "build-now",
													// 	icon: <AimOutlined />,
													// 	onClick: () => startBuildApi({}),
													// },
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
													{
														label: "Sleep",
														key: "sleep",
														icon: <EyeInvisibleOutlined />,
														onClick: () => sleepDeployEnvApi({ slug: record.appSlug, env: envName }),
													},
													{
														label: "Awake",
														key: "awake",
														icon: <AlertOutlined />,
														onClick: () => awakeDeployEnvApi({ slug: record.appSlug, env: envName }),
													},
													{
														label: "Take down",
														key: "take-down",
														icon: <PoweroffOutlined />,
														onClick: () => takeDownDeployEnvApi({ slug: record.appSlug, env: envName }),
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

						// APPLICATIONS
						return {
							...(app as any),
							key: app._id,
							id: app._id,
							// status: "N/A",
							type: "app",
							children: environments,
							actions: (
								<Space.Compact>
									<Tooltip title="Edit app">
										<Button icon={<EditOutlined />} onClick={() => setQuery({ lv1: "edit", type: "app", app: app.slug })} />
									</Tooltip>
									{/* <Button icon={<PauseCircleOutlined />} /> */}
									<Tooltip title={typeof app.archiveAt !== "undefined" ? "Unarchive" : "Archive"}>
										<Button
											icon={typeof app.archiveAt !== "undefined" ? <CloudUploadOutlined /> : <ClearOutlined />}
											onClick={() =>
												typeof app.archiveAt !== "undefined"
													? unarchiveAppApi({ _id: app._id })?.then(() => refetchProjecAndApps())
													: archiveAppApi({ _id: app._id })?.then(() => refetchProjecAndApps())
											}
										/>
									</Tooltip>
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
			{/* Search */}
			<SearchBox
				commands={projects?.map((p) => ({
					label: `${p.name} (${p.slug})`,
					value: p,
					children: p.apps?.map((a) => ({
						value: a,
						label: (
							<>
								<Tag>{p.slug}</Tag>≫<Tag>{a.slug}</Tag>
							</>
						),
						children: Object.keys(a.deployEnvironment || {}).map((env) => {
							return {
								label: (
									<>
										<DeploymentUnitOutlined />
										{`Deploy environment ≫ ${env.toUpperCase()}`}
									</>
								),
								value: (a.deployEnvironment || {})[env],
								onSelect: (val) => setQuery({ lv1: "deploy_environment", project: p.slug, app: a.slug, env }),
							};
						}),
					})),
				}))}
			/>

			{/* Page title & desc here */}
			<PageTitle
				title="Projects & apps"
				breadcrumbs={[{ name: "Workspace" }]}
				actions={[
					<Button key="import-btn" icon={<ImportOutlined className="align-middle" />} href="/import">
						Import
					</Button>,
					<Button
						key="create-app-btn"
						icon={<PlusOutlined className="align-middle" />}
						onClick={() => openNewApp()}
						// href="/new-app"
					>
						Create app
					</Button>,
				]}
			/>

			{/* Page Content */}
			<div className="h-full flex-auto overflow-hidden" ref={ref}>
				<Table
					size="small"
					loading={apiStatus === "loading"}
					columns={columns}
					dataSource={displayedProjects}
					// scroll={{ x: window?.innerWidth >= 728 ? 1500 : 600 }}
					scroll={{ x: responsive?.md ? 1600 : 1200, y: typeof size?.height !== "undefined" ? size.height - 120 : undefined }}
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
			</div>
		</>
	);
};
