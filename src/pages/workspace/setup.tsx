import { Button, Form, Input } from "antd";
import Router from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import { AuthPage, useAuth } from "@/api/api-auth";
import { useWorkspaceCreateApi } from "@/api/api-workspace";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import { Title } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { Config, isDev } from "@/utils/AppConfig";

const WorkspaceSetupPage = () => {
	const [wsName, setWsName] = useState("");
	const onChange = (e: SyntheticEvent) => setWsName((e.currentTarget as any).value);
	const [user, { refetch }] = useAuth();

	const [createWorkspace, status] = useWorkspaceCreateApi();

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

	return (
		<AuthPage>
			<Main useSidebar={false} meta={<Meta title="Workspace Setup" description="Create your new workspace." />}>
				{/* Page title & desc here */}

				{/* Page Content */}
				<CenterContainer className="text-center">
					<DiginextLogo />
					<Title value="Set up your first workspace!" />
					<p>It's great to see you here, now create your first workspace to get started.</p>

					<Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
						<Form.Item name="name" rules={[{ required: true, message: "Please input your workspace name!" }]}>
							<Input className="text-center text-lg" onChange={onChange} />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" disabled={wsName === ""}>
								GO!
							</Button>
						</Form.Item>
					</Form>
				</CenterContainer>
			</Main>
		</AuthPage>
	);
};

export default WorkspaceSetupPage;
