/* eslint-disable no-nested-ternary */
import { CheckCircleOutlined, HomeOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, theme, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useAppCreateApi } from "@/api/api-app";
import { useFrameworkListApi } from "@/api/api-framework";
import { useGitProviderListApi } from "@/api/api-git-provider";
import { useProjectListApi } from "@/api/api-project";
import type { IApp, IFramework } from "@/api/api-types";
import { useRouterQuery } from "@/plugins/useRouterQuery";

export type NewAppProps = {
	className?: string;
	onSuccess?: (app: IApp) => void;
	onFailure?: (err: string) => void;
	onDone?: () => void;
	onClose?: () => void;
};
const NewAppModal = (props: NewAppProps) => {
	const { className = "" } = props;
	const router = useRouter();
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const [form] = Form.useForm();

	// query
	const [query, { setQuery }] = useRouterQuery();
	const { sshUrl, branch: gitBranch } = query;

	// States
	const [selectedFramework, setSelectedFramework] = useState<IFramework>();

	// APIs
	const { data: { list: projects = [] } = {}, status: projectListStatus } = useProjectListApi({
		populate: "owner",
		pagination: { page: 1, size: 100 },
	});
	const { data: { list: gitProviders } = {}, status: gitProviderrListStatus } = useGitProviderListApi();
	const { data: { list: frameworks } = {}, status: frameworkListStatus } = useFrameworkListApi();

	const [newAppApi, newAppApiStatus] = useAppCreateApi();

	// Form submission
	const onFinish = async (values: any) => {
		console.log("Submit:", values);

		newAppApi({
			name: values.name,
			project: values.project,
			gitProvider: values.gitProvider,
			framework: selectedFramework,
			shouldCreateGitRepo: true,
		})
			.then((res) => {
				console.log("res.data :>> ", res.data);
				if (props?.onDone) props.onDone();
				if (res.status) {
					if (props?.onSuccess) props?.onSuccess(res.data);
				} else if (props?.onFailure) props?.onFailure(res.messages.join("."));

				// TODO: Add success or error message?
			})
			.catch((e) => {
				if (props?.onFailure) props?.onFailure(`Unable to create new app: ${e}.`);
			});
	};
	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Card
			bordered={false}
			className="min-w-[350px]"
			title={
				<Typography.Title level={4} className="!mb-0 text-center">
					{newAppApiStatus === "success" ? "Congrats!" : newAppApiStatus === "loading" ? "Processing..." : "Create new app"}
				</Typography.Title>
			}
		>
			{newAppApiStatus === "loading" && (
				<div className="p-4 text-center">
					<LoadingOutlined />
				</div>
			)}

			{newAppApiStatus === "success" && (
				<div className="text-center">
					<div className="mb-5 text-center text-3xl text-green-500">
						<CheckCircleOutlined />
					</div>
					<Button
						icon={<HomeOutlined />}
						size="large"
						shape="round"
						onClick={() => (props?.onClose ? props.onClose() : router.push("/project"))}
					>
						Back to projects & apps
					</Button>
				</div>
			)}

			{newAppApiStatus !== "success" && newAppApiStatus !== "loading" ? (
				<Form
					className={["h-full", "overflow-x-hidden", className].join(" ")}
					layout="vertical"
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					preserve={false}
				>
					<Form.Item name="name" rules={[{ required: true, message: "App's name is required." }]}>
						<Input
							placeholder="App's name"
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							size="large"
							tabIndex={0}
							autoFocus
						/>
					</Form.Item>

					<Form.Item
						name="project"
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

					<Form.Item
						name="gitProvider"
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
						/>
					</Form.Item>

					<Form.Item
						name="framework"
						rules={[{ required: true, message: "Please select framework." }]}
						className="mb-2"
						initialValue={(frameworks || [])[0]?._id}
					>
						<Select
							placeholder="Select git provider for this app"
							showSearch
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							options={frameworks?.map((item) => ({
								label: item.name,
								value: item._id,
							}))}
							onSelect={(value) => setSelectedFramework(frameworks?.find((fw) => fw._id === value))}
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0 }} className="text-center">
						<Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} size="large" shape="round">
							Create
						</Button>
					</Form.Item>
				</Form>
			) : (
				<></>
			)}
		</Card>
	);
};

export default NewAppModal;
