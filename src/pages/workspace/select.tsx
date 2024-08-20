import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input, notification, Select, Typography } from "antd";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import { useAuth } from "@/api/api-auth";
import { useUserJoinWorkspaceApi } from "@/api/api-user";
import { useWorkspaceCreateApi } from "@/api/api-workspace";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const { Title } = Typography;

interface WorkspaceInputData {
	/**
	 * Name of the workspace.
	 */
	name: string;
	/**
	 * User ID of the owner
	 */
	owner: string;
	/**
	 * Set privacy mode for this workspace
	 * @default true
	 */
	public?: boolean;
}

const WorkspaceSetupPage = () => {
	const router = useRouter();

	const queryClient = useQueryClient();

	// const [dxKey, setDxKey] = useState("");
	const [wsName, setWsName] = useState("");
	const [err, setErr] = useState("");

	const onChange = (e: SyntheticEvent) => setWsName((e.currentTarget as any).value);
	const [user, { refetch, status: authStatus }] = useAuth();

	const [createWorkspaceApi, createStatus] = useWorkspaceCreateApi();
	const [joinWorkspaceApi] = useUserJoinWorkspaceApi();

	const { workspaces = [] } = user || {};

	const joinWorkspace = async (workspaceId: string) => {
		if (!user._id) {
			notification.error({ message: `Unauthenticated.` });
			return;
		}
		const res = await joinWorkspaceApi({ userId: user._id, workspace: workspaceId });
		if (res?.status) {
			await queryClient.invalidateQueries({ queryKey: ["auth"] });
			await refetch();

			// redirect to workspace URL:
			const url = new URL(window.location.href);
			const redirectUrl = url.searchParams.get("redirect_url") || window.location.origin;
			router.push(redirectUrl);
		}
	};

	const createWorkspace = async (values: any) => {
		const wsData: any = {};
		wsData.name = values.name;
		wsData.public = typeof values.public === "undefined" ? false : values.public;
		// wsData.dx_key = dxKey;

		const result = await createWorkspaceApi(wsData);
		if (result?.status) {
			const workspace = result?.data;
			if (!workspace.name) {
				setErr("Unable to create new workspace.");
				return;
			}
			setWsName(workspace.name);

			await queryClient.invalidateQueries({ queryKey: ["auth"] });
			await refetch();

			// router.push(isDev() ? `${Config.NEXT_PUBLIC_BASE_URL}` : `/`);
			// redirect to workspace URL:
			const url = new URL(window.location.href);
			const redirectUrl = url.searchParams.get("redirect_url") || window.location.origin;
			router.push(redirectUrl);
		} else {
			setErr(result?.messages?.join(".") || "Internal Server Error");
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const onSelectWorkspace = (id: string) => {
		console.log("workspace > id :>> ", id);
		joinWorkspace(id);
	};

	return (
		<>
			<Main useSidebar={false} meta={<Meta title="Select/Create a Workspace" description="Select or create your workspace." />}>
				{authStatus === "loading" && (
					<CenterContainer className="text-center">
						<DiginextLogo />
						<LoadingOutlined />
					</CenterContainer>
				)}

				{authStatus === "success" && user && (
					<CenterContainer className="text-center">
						<DiginextLogo />

						{workspaces.length > 0 && createStatus !== "loading" && createStatus !== "success" && (
							<div>
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
							</div>
						)}

						{createStatus === "loading" && <LoadingOutlined />}
						{(createStatus === "idle" || createStatus === "error") && (
							<div>
								<Title level={3}>Create a new workspace:</Title>
								<Form name="create" onFinish={createWorkspace} onFinishFailed={onFinishFailed} autoComplete="off">
									<div className="flex gap-2">
										<Form.Item name="public" valuePropName="checked">
											<Checkbox>Public</Checkbox>
										</Form.Item>
										<Form.Item
											name="name"
											style={{ flex: "auto" }}
											rules={[{ required: true, message: "Workspace name is required." }]}
										>
											<Input className="text-center text-lg" placeholder="Workspace name" onChange={onChange} />
										</Form.Item>
										<Form.Item>
											<Button type="primary" htmlType="submit" disabled={wsName === ""} className="h-[38px]">
												GO!
											</Button>
										</Form.Item>
									</div>
									<Form.ErrorList className="text-red-400" errors={[err]} />
								</Form>
								<Button href="/logout" shape="round" size="large" type="primary" icon={<LogoutOutlined />}>
									Sign out
								</Button>
							</div>
						)}
					</CenterContainer>
				)}
			</Main>
		</>
	);
};

export default WorkspaceSetupPage;
