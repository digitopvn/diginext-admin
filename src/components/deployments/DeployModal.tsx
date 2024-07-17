/* eslint-disable no-nested-ternary */
import { ArrowRightOutlined, CodeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Radio, Select, theme, Typography } from "antd";
import { flatMap } from "lodash";
import React, { useState } from "react";

import { useAppListApi } from "@/api/api-app";
import { useBuildListApi } from "@/api/api-build";
import { useClusterListApi } from "@/api/api-cluster";
import { useDeployFromAppApi } from "@/api/api-deploy";
import { useGitRepoBranchListApi } from "@/api/api-git-provider";
import { useProjectListWithAppsApi } from "@/api/api-project";
import { useContainerRegistryListApi } from "@/api/api-registry";
import type { IApp, IBuild, IDeployEnvironment } from "@/api/api-types";
import { parseGitRepoDataFromRepoSSH } from "@/plugins/git-utils";
import { useRouterQuery } from "@/plugins/useRouterQuery";

export type DeployModalProps = {
	className?: string;
};
const DeployModal = (props: DeployModalProps) => {
	const { className = "" } = props;
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const [form] = Form.useForm();

	// query
	const [query, { setQuery }] = useRouterQuery();
	const {
		project: projectSlug,
		app: appSlug,
		env: deployEnv,
		registry: registrySlug,
		cluster: clusterShortname,
		build: buildSlug,
		branch: gitBranch,
		port,
	} = query;

	// States
	const [selectedApp, setSelectedApp] = useState<IApp>();
	const [selectedBuild, setSelectedBuild] = useState<IBuild>();
	const [selectedDeployEnv, setSelectedDeployEnv] = useState<IDeployEnvironment>();
	const [selectedDeployEnvStr, setSelectedDeployEnvStr] = useState<string>();
	const [buildURL, setBuildURL] = useState<string>();

	// APIs
	// const { data: app } = useAppSlugApi(appSlug, { populate: "project" });
	// const deployEnvironment = (app?.deployEnvironment || {})[deployEnv];

	const { data: { list: projects = [] } = {}, status } = useProjectListWithAppsApi({ populate: "owner", pagination: { page: 1, size: 100 } });
	const { data: { list: apps } = {} } = useAppListApi();
	const { data: { list: registries } = {} } = useContainerRegistryListApi();
	const { data: { list: clusters } = {} } = useClusterListApi();
	const { data: { list: builds } = {} } = useBuildListApi({ filter: { appSlug: selectedApp?.slug } });

	const [deployFromAppApi, deployFromAppStatus] = useDeployFromAppApi();

	// git
	const gitData = parseGitRepoDataFromRepoSSH(selectedApp?.git?.repoSSH || "");
	const { data: { list: branches } = {} } = useGitRepoBranchListApi(gitData.repoSlug || "", {
		enabled: typeof gitData.repoSlug !== "undefined" && typeof selectedApp?.gitProvider !== "undefined",
		filter: { _id: selectedApp?.gitProvider },
	});
	// console.log("gitData.repoSlug :>> ", gitData.repoSlug);
	// console.log("selectedApp?.gitProvider :>> ", selectedApp?.gitProvider);
	// console.log("branches :>> ", branches);

	const allApps = flatMap(projects, "apps");

	// Form submission
	const onFinish = async (values: any) => {
		console.log("Submit:", values);

		deployFromAppApi({
			appSlug: values.app,
			gitBranch: values.gitBranch,
			deployParams: { env: values.env, cluster: values.cluster, registry: values.registry },
		}).then((res) => {
			console.log("res.data?.logURL :>> ", res.data?.logURL);
			setBuildURL(res.data?.logURL);
		});
	};
	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Card
			bordered={false}
			title={
				<Typography.Title level={4} className="!mb-0 text-center">
					{deployFromAppStatus === "success"
						? "A deployment is being processed!"
						: deployFromAppStatus === "loading"
						? "Processing..."
						: "Deploy your app"}
				</Typography.Title>
			}
		>
			{deployFromAppStatus === "loading" && <LoadingOutlined />}
			{deployFromAppStatus !== "success" ? (
				<Form
					className={["h-full", "overflow-x-hidden", className].join(" ")}
					layout="vertical"
					// name="edit"
					// initialValues={initialValues}
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item name="app" rules={[{ required: true, message: "Please select app." }]} className="mb-2" initialValue={appSlug}>
						<Select
							placeholder="Select app"
							onSelect={(value) => {
								const _selectedApp = allApps.find((_app) => _app.slug === value);
								setSelectedApp(_selectedApp);
							}}
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={projects?.map((_project) => ({
								label: _project.name,
								options: _project.apps?.map((_app) => ({ label: _app.name, value: _app.slug })),
							}))}
						/>
					</Form.Item>

					<Form.Item
						name="env"
						label="Deploy environment"
						rules={[{ required: true, message: "Please select deploy environment." }]}
						className="mb-2"
						initialValue={deployEnv}
					>
						<Radio.Group
							// options={[
							// 	{ label: "dev", value: "dev" },
							// 	{ label: "prod", value: "prod" },
							// ]}
							onChange={(value) => {
								setSelectedDeployEnvStr(value.target.value);
								setSelectedDeployEnv((selectedApp?.deployEnvironment || {})[value.target.value]);
							}}
							// value={value4}
							// optionType="button"
							// buttonStyle="solid"
						>
							<Radio value="dev">dev</Radio>
							<Radio value="prod">prod</Radio>
							<Radio value="other">
								{selectedDeployEnvStr === "other" ? (
									<Input
										style={{ width: 100, marginLeft: 10 }}
										onChange={(e) => {
											setSelectedDeployEnv((selectedApp?.deployEnvironment || {})[e.target.value]);
										}}
									/>
								) : (
									<>+ other</>
								)}
							</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						name="registry"
						rules={[{ required: true, message: "Please select container registry." }]}
						className="mb-2"
						initialValue={selectedDeployEnv?.registry || registrySlug || (registries || [])[0]?.slug}
					>
						<Select
							placeholder="Container registry"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={registries?.map((_registry) => ({ label: _registry.name, value: _registry.slug }))}
							onSelect={(value) => console.log("Select container registry > value :>> ", value)}
						/>
					</Form.Item>

					<Form.Item
						name="cluster"
						rules={[{ required: true, message: "Please select cluster." }]}
						className="mb-2"
						initialValue={clusterShortname}
					>
						<Select
							placeholder="Cluster"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={clusters?.map((_cluster) => ({ label: _cluster.name, value: _cluster.shortName }))}
						/>
					</Form.Item>

					<Form.Item name="build" className="mb-2">
						<Select
							placeholder="Start new build"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={[
								{ label: "Start new build", value: "new" },
								...(builds?.map((_build) => ({ label: _build.name, value: _build.slug })) || []),
							]}
							onSelect={(value) => setSelectedBuild(builds?.find((_build) => _build.slug === value))}
						/>
					</Form.Item>

					{typeof selectedBuild === "undefined" ? (
						<div className="grid grid-cols-2 gap-2">
							<Form.Item name="gitBranch" rules={[{ required: true, message: "Please git branch." }]} initialValue="main">
								<Select
									placeholder="Git branch"
									showSearch
									filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
									options={branches?.map((_branch) => ({ label: _branch.name, value: _branch.name }))}
								/>
							</Form.Item>
							<Form.Item
								name="port"
								rules={[{ required: true, message: "Please enter exposed port." }]}
								initialValue={selectedDeployEnv?.port || port || "3000"}
							>
								<Input placeholder="Port" autoComplete="off" autoCorrect="off" autoCapitalize="off" />
							</Form.Item>
						</div>
					) : (
						<></>
					)}

					<Form.Item style={{ marginBottom: 0 }} className="text-center">
						<Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} size="large" shape="round">
							Deploy Now
						</Button>
					</Form.Item>
				</Form>
			) : (
				<div className="text-center">
					<Button href={buildURL} icon={<CodeOutlined />} size="large" shape="round">
						View build logs
					</Button>
				</div>
			)}
		</Card>
	);
};

export default DeployModal;
