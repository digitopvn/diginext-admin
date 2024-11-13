import { DeploymentUnitOutlined, ImportOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSize } from "ahooks";
import { Button, notification, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
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
	useAppListApi,
	useAppUnarchiveApi,
} from "@/api/api-app";
import { useBuildStartApi, useBuildStopApi } from "@/api/api-build";
import { useClusterListApi } from "@/api/api-cluster";
import { usePromoteDeployEnvironmentApi } from "@/api/api-deploy";
import { useProjectDeleteApi } from "@/api/api-project";
import type { IApp, IDeployEnvironment, IProject } from "@/api/api-types";
import { DateDisplay } from "@/commons/DateDisplay";
import { PageTitle } from "@/commons/PageTitle";
import SearchBox from "@/commons/SearchBox";
import { filterUniqueItems } from "@/plugins/array-utils";
import { containerCpus, containerMemories } from "@/plugins/container-utils";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import { useModalProvider } from "@/providers/ModalProvider";
import { AppConfig } from "@/utils/AppConfig";

import AddDomainForm from "../projects/AddDomainForm";
import NewAppModal from "../projects/NewAppModal";
import PromoteDeployEnvironmentModal from "../projects/PromoteDeployEnvironmentModal";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends Omit<IDeployEnvironment, "project"> {
	id?: string;
	key?: React.Key;
	deployEnvironment: string;
	app?: {
		id: string;
		name: string;
		slug: string;
	};
	project?: IProject;
}

const pageSize = AppConfig.tableConfig.defaultPageSize ?? 20;

export const DeployEnvironmentList = () => {
	const router = useRouter();
	const [query, { setQuery }] = useRouterQuery();

	const { responsive } = useLayoutProvider();
	const { modal } = useModalProvider();

	// pagination
	const [page, setPage] = useState(query.page ? parseInt(query.page as string, 10) : 1);

	// fetch apps
	const queryClient = useQueryClient();
	const {
		data,
		status: apiStatus,
		refetch: refetchApps,
	} = useAppListApi({
		populate: "owner,project",
		pagination: { page, size: pageSize },
		// filter: {
		// 	status: true,
		// },
	});
	const { list: apps, pagination } = data || {};
	const { total_pages, total_items } = pagination || {};

	// flatten apps & deploy environments
	const displayedDeployEnvironments = apps?.flatMap((app: IApp) => {
		return Object.entries(app.deployEnvironment || {}).map(([envName, envData]) => ({
			name: envData.deploymentName,
			deployEnvironment: envName,
			app: {
				id: app.id,
				name: app.name,
				slug: app.slug,
				// Add other relevant app properties here
			},
			project: app.project,
			...envData,
		}));
	}) as DataType[];
	console.log({ displayedDeployEnvironments });

	// FIXME: page size -> all or pagination?
	// fetch clusters
	const { data: dataCluster, status: listClusterApiStatus } = useClusterListApi({ pagination: { page, size: 50 } });
	const { list: clusters } = dataCluster || {};
	// const { total_items } = pagination || {};

	// table config
	const columns: ColumnsType<DataType> = [
		{
			title: "Deployment",
			width: 30,
			dataIndex: "name",
			key: "name",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			render: (value, record) => {
				return (
					<Link href={`?lv1=deploy_environment&project=${record.project?.slug}&app=${record.app?.slug}&env=${record.deployEnvironment}`}>
						{value}
					</Link>
				);
			},
		},
		{
			title: "ENV",
			width: 15,
			dataIndex: "deployEnvironment",
			key: "deployEnvironment",
			render: (value) => <Tag color={value === "prod" ? "success" : "default"}>{value}</Tag>,
			filters: filterUniqueItems(
				displayedDeployEnvironments?.map((item) => ({
					text: item.deployEnvironment,
					value: item.deployEnvironment,
				})) || []
			).filter((item, index, self) => index === self.findIndex((t) => t.value === item.value)),
			onFilter: (value, record) => {
				// setQuery({ env: value });
				return record.deployEnvironment === value;
			},
		},
		{
			title: "Project",
			width: 30,
			dataIndex: "project",
			key: "project",
			render: (project) => (
				<>
					<span>{project.name}</span> <Tag>{project.slug}</Tag>
				</>
			),
			filters: filterUniqueItems(
				(
					displayedDeployEnvironments?.map((item) => ({
						text: (item.project as IProject)?.name ?? "",
						value: (item.project as IProject)?.slug ?? "",
					})) || []
				).filter((item): item is { text: string; value: string } => item.text !== "" && item.value !== "")
			).filter((item, index, self) => index === self.findIndex((t) => t.value === item.value)),
			onFilter: (value, record) => {
				return (record.project as IProject)?.slug === value;
			},
		},
		{
			title: "App",
			width: 30,
			dataIndex: "app",
			key: "app",
			render: (app) => (
				<>
					<span>{app.name}</span> <Tag>{app.slug}</Tag>
				</>
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
			filters: filterUniqueItems(clusters?.map((item) => ({ text: item.name, value: item.slug })) || []).filter(
				(item): item is { text: string; value: string } => item.text !== "" && item.value !== ""
			),
			onFilter: (value, record) => {
				return record.cluster === value;
			},
		},
		// {
		// 	title: "Size",
		// 	dataIndex: "size",
		// 	width: 15,
		// 	key: "size",
		// 	render: (value) => <Tag color={value === "none" ? "default" : "success"}>{value}</Tag>,
		// },
		{
			title: "CPU",
			dataIndex: "cpu",
			width: 15,
			key: "cpu",
			render: (value) => (value ? <Tag>{value}</Tag> : "-"),
			sorter: (a, b) => containerCpus.indexOf(a.cpu || "") - containerCpus.indexOf(b.cpu || ""),
		},
		{
			title: "Memory",
			dataIndex: "memory",
			key: "memory",
			width: 15,
			render: (value) => (value ? <Tag>{value}</Tag> : "-"),
			sorter: (a, b) => containerMemories.indexOf(a.memory || "") - containerMemories.indexOf(b.memory || ""),
		},
		{
			title: "Replicas",
			dataIndex: "replicas",
			key: "replicas",
			width: 15,
		},
		{
			title: "Last updated by",
			dataIndex: "lastUpdatedBy",
			key: "lastUpdatedBy",
			width: 25,
			filterSearch: true,
		},
		{
			title: "Last updated",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 20,
			render: (value) => <DateDisplay date={value} />,
			sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
		},
		// {
		// 	title: <Typography.Text className="text-xs md:text-sm">Action</Typography.Text>,
		// 	key: "action",
		// 	fixed: "right",
		// 	width: responsive?.md ? 18 : 13,
		// 	dataIndex: "action",
		// 	render: (value, record) => record.actions,
		// },
	];

	const [deleteProjectApi, deleteProjectApiStatus] = useProjectDeleteApi();
	const [deleteAppApi, deleteAppApiStatus] = useAppDeleteApi();
	const [deleteAppEnvApi, deleteAppEnvApiStatus] = useAppDeployEnvironmentDeleteApi();
	const [archiveAppApi, archiveAppApiStatus] = useAppArchiveApi();
	const [unarchiveAppApi, unarchiveAppApiStatus] = useAppUnarchiveApi();

	const [startBuildApi, startBuildApiStatus] = useBuildStartApi();
	const [stopBuildApi, stopBuildApiStatus] = useBuildStopApi();

	const [promoteToDeployEnvApi, promoteToEnvApiStatus] = usePromoteDeployEnvironmentApi();

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

	const openPromoteDeployEnvironmentModal = (_app: IApp, fromEnv: string, toEnv?: string, options?: { title?: string }) => {
		// console.log("modal :>> ", modal);
		const instance = modal?.info({
			title: (
				<Typography.Title level={3}>
					{options?.title || `Promote to ${toEnv ? toEnv.toUpperCase() : "another"} deploy environment`}
				</Typography.Title>
			),
			icon: null,
			content: (
				<PromoteDeployEnvironmentModal
					app={_app}
					fromEnv={fromEnv}
					toEnv={toEnv}
					next={() => {
						instance?.destroy();
						// reload project & app list
						refetchApps();
					}}
				/>
			),
			footer: null,
			closable: true,
			maskClosable: true,
			width: 500,
			styles: { body: { margin: 0, width: "100%", justifyContent: "stretch" } },
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
		refetchApps();
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

	const onTableChange = (_pagination: TablePaginationConfig) => {
		console.log("Table changed!");
		const { current } = _pagination;
		setQuery({ page: current ?? 1 });
	};

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Search */}
			<SearchBox
				commands={apps?.map((app) => ({
					label: `${app.name} (${app.slug})`,
					value: app,
					children: Object.keys(app.deployEnvironment || {}).map((env) => {
						return {
							value: app,
							label: (
								<>
									<Tag>{app.slug}</Tag>≫<Tag>{env}</Tag>
								</>
							),
							children: Object.keys(app.deployEnvironment || {}).map((_env) => {
								return {
									label: (
										<>
											<DeploymentUnitOutlined />
											{`Deploy environment ≫ ${_env.toUpperCase()}`}
										</>
									),
									value: (app.deployEnvironment || {})[_env],
									onSelect: (val) => setQuery({ lv1: "deploy_environment", project: app.slug, app: app.slug, env: _env }),
								};
							}),
						};
					}),
				}))}
			/>

			{/* Page title & desc here */}
			<PageTitle
				title="Deploy environments"
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
					dataSource={displayedDeployEnvironments}
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
