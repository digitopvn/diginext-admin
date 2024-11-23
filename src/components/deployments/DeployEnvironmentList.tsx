import { ImportOutlined, PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSize } from "ahooks";
import { Button, notification, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";
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
	useAppUnarchiveApi,
} from "@/api/api-app";
import { useBuildStartApi, useBuildStopApi } from "@/api/api-build";
import { useClusterListApi } from "@/api/api-cluster";
import { usePromoteDeployEnvironmentApi } from "@/api/api-deploy";
import { useDeployEnvironmentListApi } from "@/api/api-deploy-environment";
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
		refetch: refetchDeployEnvironments,
	} = useDeployEnvironmentListApi({
		// populate: "owner,project",
		pagination: { page, size: pageSize },
		filter: {
			status: true,
			cluster: query.cluster,
		},
	});
	const { list: deployEnvironments, pagination } = data || {};
	const { total_pages, total_items } = pagination || {};

	// flatten apps & deploy environments
	const displayedDeployEnvironments = deployEnvironments?.map((deployEnvironment, index) => ({
		...deployEnvironment,
		key: `${deployEnvironment.projectSlug}-${deployEnvironment.appSlug}-${deployEnvironment.env}-${index}`,
	})) as DataType[];

	console.log({ displayedDeployEnvironments });

	// fetch all clusters (for filter)
	const { data: dataCluster, status: listClusterApiStatus } = useClusterListApi();
	const { list: clusters } = dataCluster || {};
	// const { total_items } = pagination || {};

	// table config
	const columns: ColumnsType<DataType> = [
		{
			title: "Deployment",
			width: 30,
			dataIndex: "deploymentName",
			key: "deploymentName",
			fixed: responsive?.md ? "left" : undefined,
			filterSearch: true,
			render: (value, record) => {
				return <Link href={`?lv1=deploy_environment&project=${record.projectSlug}&app=${record.appSlug}&env=${record.env}`}>{value}</Link>;
			},
		},
		{
			title: "ENV",
			width: 15,
			dataIndex: "env",
			key: "env",
			render: (value) => <Tag color={value === "prod" ? "success" : "default"}>{value}</Tag>,
			filters: filterUniqueItems(
				displayedDeployEnvironments?.map((item) => ({
					text: item.env ?? "",
					value: item.env ?? "",
				})) || []
			).filter((item, index, self) => index === self.findIndex((t) => t.value === item.value)),
			onFilter: (value, record) => {
				// setQuery({ env: value });
				return record.env === value;
			},
		},
		{
			title: "Project",
			width: 30,
			dataIndex: "projectSlug",
			key: "projectSlug",
			render: (projectSlug) => (
				<>
					<Tag>{projectSlug}</Tag>
				</>
			),
			filters: filterUniqueItems(
				(
					displayedDeployEnvironments?.map((item) => ({
						text: item.projectName ?? "",
						value: item.projectSlug ?? "",
					})) || []
				).filter((item): item is { text: string; value: string } => item.text !== "" && item.value !== "")
			).filter((item, index, self) => index === self.findIndex((t) => t.value === item.value)),
			onFilter: (value, record) => {
				// setQuery({ project: value });
				return record.projectSlug === value;
			},
		},
		{
			title: "App",
			width: 30,
			dataIndex: "appSlug",
			key: "appSlug",
			render: (appSlug) => (
				<>
					<Tag>{appSlug}</Tag>
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
			filterMultiple: false,
			onFilter: (value, record) => {
				// console.log("value :>> ", value);
				// if (query.cluster === value) return true;
				// setQuery({ cluster: value });
				// return true;
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
			render: (value, record) => (
				<Tag color={record.resources?.limits?.cpu ? "success" : "default"}>
					{record.resources?.usage?.cpu || value || "-"}
					{" / "}
					{record.resources?.limits?.cpu ? `${record.resources?.limits?.cpu}` : "-"}
				</Tag>
			),
			sorter: (a, b) => containerCpus.indexOf(a.cpu || "") - containerCpus.indexOf(b.cpu || ""),
		},
		{
			title: "Memory",
			dataIndex: "memory",
			key: "memory",
			width: 15,
			render: (value, record) => (
				<Tag color={record.resources?.limits?.memory ? "success" : "default"}>
					{record.resources?.usage?.memory || value || "-"}
					{" / "}
					{record.resources?.limits?.memory ? `${record.resources?.limits?.memory}` : "-"}
				</Tag>
			),
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
						refetchDeployEnvironments();
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
		refetchDeployEnvironments();
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

	const onTableChange = (_pagination: TablePaginationConfig, _filters: Record<string, FilterValue | null>) => {
		console.log("Table changed: ", _pagination, _filters);
		const { current } = _pagination;
		setQuery({ page: current ?? 1, ..._filters });
	};

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Search */}
			<SearchBox
				commands={displayedDeployEnvironments?.map((deployEnvironment) => ({
					label: `${deployEnvironment.app?.name} (${deployEnvironment.app?.slug})`,
					value: deployEnvironment.deploymentName,
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
