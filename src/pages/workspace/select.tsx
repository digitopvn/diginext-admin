import { Button, Form, Input, Select, Space, Typography } from "antd";
import Router, { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import { AuthPage, useAuth } from "@/api/api-auth";
import { useUserJoinWorkspaceApi } from "@/api/api-user";
import { useWorkspaceCreateApi } from "@/api/api-workspace";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { Config, isDev } from "@/utils/AppConfig";

const { Title } = Typography;

const WorkspaceSetupPage = () => {
	const router = useRouter();
	const [wsName, setWsName] = useState("");
	const onChange = (e: SyntheticEvent) => setWsName((e.currentTarget as any).value);
	const [user, { refetch }] = useAuth();

	const [createWorkspace, status] = useWorkspaceCreateApi();
	const [joinWorkspaceApi] = useUserJoinWorkspaceApi();

	const { workspaces = [] } = user || {};

	const joinWorkspace = async (workspaceId: string) => {
		const res = await joinWorkspaceApi({ userId: user._id, workspace: workspaceId });
		if (res?.status) {
			// redirect to workspace URL:
			const url = new URL(window.location.href);
			const redirectUrl = url.searchParams.get("redirect_url") || window.location.origin;
			router.push(redirectUrl);
		}
	};

	const onFinish = async (values: any) => {
		console.log("Submit:", values);
		const result = await createWorkspace({ ...values, owner: user?._id });
		const workspace = result?.data;

		await refetch();

		Router.push(isDev() ? `${Config.NEXT_PUBLIC_BASE_URL}` : `https://${workspace?.slug}.${Config.NEXT_PUBLIC_DOMAIN}`);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const onSelectWorkspace = (id: string) => {
		console.log("workspace > id :>> ", id);
		joinWorkspace(id);
	};

	return (
		<AuthPage>
			<Main useSidebar={false} meta={<Meta title="Select/Create a Workspace" description="Select or create your workspace." />}>
				{/* Page title & desc here */}

				{/* Page Content */}
				<CenterContainer className="text-center">
					<DiginextLogo />
					<Title level={3}>Select a workspace:</Title>
					<p>Choose a workspace which you want to interact with:</p>
					<Form name="select">
						<Form.Item name="workspace">
							<Select
								size="large"
								value={`${workspaces[0]?.name} (${workspaces[0]?.slug})`}
								onChange={onSelectWorkspace}
								options={workspaces?.map((workspace) => {
									return { label: `${workspace.name} (${workspace.slug})`, value: workspace._id };
								})}
							/>
						</Form.Item>
					</Form>

					<Title level={3}>Or create a new workspace:</Title>
					<Form name="create" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
						<Space.Compact className="w-full">
							<Form.Item
								name="name"
								style={{ flex: "auto" }}
								rules={[{ required: true, message: "Please input your workspace name!" }]}
							>
								<Input className="text-center text-lg" placeholder="Enter your workspace name" onChange={onChange} />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" disabled={wsName === ""} className="h-[38px]">
									GO!
								</Button>
							</Form.Item>
						</Space.Compact>
					</Form>
				</CenterContainer>
			</Main>
		</AuthPage>
	);
};

export default WorkspaceSetupPage;
