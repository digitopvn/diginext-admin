/* eslint-disable no-nested-ternary */
import { ForkOutlined, HomeOutlined, ImportOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, theme, Typography } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";

import { useAppImportGitApi } from "@/api/api-app";
import { useGitProviderListApi, useGitRepoBranchListApi } from "@/api/api-git-provider";
import { useProjectListApi } from "@/api/api-project";
import type { IGitProvider } from "@/api/api-types";
import { parseGitRepoDataFromRepoSSH } from "@/plugins/git-utils";
import { useRouterQuery } from "@/plugins/useRouterQuery";

export type ImportGitProps = {
	className?: string;
};
const ImportGitModal = (props: ImportGitProps) => {
	const { className = "" } = props;
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const [form] = Form.useForm();

	// query
	const [query, { setQuery }] = useRouterQuery();
	const { sshUrl, branch: gitBranch } = query;

	// States
	const [selectedGitProvider, setSelectedGitProvider] = useState<IGitProvider>();
	const [curSshURL, setCurSshURL] = useState<string>(sshUrl);
	useEffect(() => setCurSshURL(sshUrl), [sshUrl]);

	// APIs
	const { data: { list: projects = [] } = {}, status: projectListStatus } = useProjectListApi({
		populate: "owner",
		pagination: { page: 1, size: 100 },
	});
	const { data: { list: gitProviders } = {}, status: gitProviderrListStatus } = useGitProviderListApi();

	const [importGitApi, importGitStatus] = useAppImportGitApi();

	// git
	const gitData = parseGitRepoDataFromRepoSSH(curSshURL);
	const { data: { list: branches } = {} } = useGitRepoBranchListApi(gitData.repoSlug || "", {
		enabled: typeof gitData.repoSlug !== "undefined" && typeof selectedGitProvider?._id !== "undefined" && !isEmpty(curSshURL),
		filter: { _id: selectedGitProvider?._id },
	});
	console.log("curSshURL :>> ", curSshURL);
	console.log("gitData :>> ", gitData);
	console.log("gitData.repoSlug :>> ", gitData.repoSlug);
	// console.log("selectedApp?.gitProvider :>> ", selectedApp?.gitProvider);
	// console.log("branches :>> ", branches);

	// Form submission
	const onFinish = async (values: any) => {
		console.log("Submit:", values);

		importGitApi({
			name: values.name,
			projectID: values.projectID,
			gitProviderID: values.gitProviderID,
			sshUrl: curSshURL,
			gitBranch: values.gitBranch,
		}).then((res) => {
			console.log("res.data :>> ", res.data);
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
					{importGitStatus === "success" ? "Imported successfully!" : importGitStatus === "loading" ? "Importing..." : "Import GIT repo"}
				</Typography.Title>
			}
		>
			{importGitStatus === "loading" && (
				<div className="p-4 text-center">
					<LoadingOutlined />
				</div>
			)}
			{importGitStatus !== "success" && importGitStatus !== "loading" ? (
				<Form
					className={["h-full", "overflow-x-hidden", className].join(" ")}
					layout="vertical"
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					preserve={false}
				>
					<Form.Item name="sshUrl" rules={[{ required: true, message: "Please enter the repo SSH url." }]} initialValue={curSshURL}>
						<Input
							size="large"
							prefix={<ForkOutlined />}
							placeholder="git@github.com:organization/repo.git"
							status="warning"
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							onChange={(e) => {
								console.log("e.currentTarget.value :>> ", e.currentTarget.value);
								setCurSshURL(e.currentTarget.value);
							}}
						/>
					</Form.Item>

					<Form.Item
						name="gitProviderID"
						rules={[{ required: true, message: "Please select git provider." }]}
						className="mb-2"
						initialValue={(gitProviders || [])[0]?._id}
					>
						<Select
							placeholder="Select git provider for this app"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={gitProviders?.map((gitPro) => ({
								label: gitPro.name,
								value: gitPro._id,
							}))}
							onSelect={(value) => setSelectedGitProvider(gitProviders?.find((provider) => provider._id === value))}
						/>
					</Form.Item>

					<Form.Item
						name="projectID"
						rules={[{ required: true, message: "Please select project." }]}
						className="mb-2"
						initialValue={(projects || [])[0]?._id}
					>
						<Select
							placeholder="Select parent project"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={projects?.map((_project) => ({
								label: _project.name,
								value: _project._id,
							}))}
						/>
					</Form.Item>

					<Form.Item name="name" initialValue={gitData.repoSlug}>
						<Input placeholder="App's name (optional)" autoComplete="off" autoCorrect="off" autoCapitalize="off" />
					</Form.Item>

					<Form.Item
						name="gitBranch"
						// rules={[{ required: true, message: "Please git branch." }]}
						initialValue={gitBranch}
					>
						<Select
							placeholder="Git branch (optional)"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={branches?.map((_branch) => ({ label: _branch.name, value: _branch.name }))}
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0 }} className="text-center">
						<Button type="primary" htmlType="submit" icon={<ImportOutlined />} size="large" shape="round">
							Import Now
						</Button>
					</Form.Item>
				</Form>
			) : (
				<div className="text-center">
					<Button href="/project" icon={<HomeOutlined />} size="large" shape="round">
						Back to projects & apps
					</Button>
				</div>
			)}
		</Card>
	);
};

export default ImportGitModal;
