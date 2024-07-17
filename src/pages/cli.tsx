import { HomeOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useEffect } from "react";

import { useAuth } from "@/api/api-auth";
import { useUserJoinWorkspaceApi } from "@/api/api-user";
import CenterContainer from "@/commons/CenterContainer";
import CopyCode from "@/commons/CopyCode";
import DiginextLogo from "@/commons/DiginextLogo";
import { useWorkspace } from "@/providers/useWorkspace";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const CliPage = () => {
	const [user, { isFetched }] = useAuth();

	// console.log("user :>> ", user);
	const [joinApi] = useUserJoinWorkspaceApi();

	const wsSlug = user?.activeWorkspace?.slug;
	const workspace = useWorkspace({ name: wsSlug });
	const { slug: workspaceSlug } = workspace || {};
	// console.log("workspaceSlug :>> ", workspaceSlug);

	const joinWorkspace = async (userId: string) => {
		if (!workspaceSlug) return;
		if (!workspace) return;

		// console.log("userId :>> ", userId);

		const joinRes = await joinApi({
			userId,
			workspace: workspaceSlug,
		});

		const joinedUser = joinRes?.data;
		console.log("joinedUser :>> ", joinedUser);
	};

	useEffect(() => {
		if (!isEmpty(user)) {
			joinWorkspace(user._id as string);
		}
	}, [user, workspace]);

	return (
		!isEmpty(user) && (
			<Main useSidebar={false} meta={<Meta title="CLI Authentication" description="Authenticate before using the CLI commands." />}>
				{/* Page Content */}
				<CenterContainer className="max-w-md ">
					<Link href="/">
						<DiginextLogo />
					</Link>

					{!isEmpty(workspace) ? (
						<div className="text-center">
							<p>Copy & paste this ACCESS TOKEN into your command interface:</p>
							<CopyCode value={!isEmpty(user) ? (user?.token as any)?.access_token : ""} />
							<Button size="large" className="mt-2" href="/" icon={<HomeOutlined />}>
								Dashboard
							</Button>
						</div>
					) : (
						<Alert message="Error" description={`This workspace does not exists.`} type="error" showIcon />
					)}
				</CenterContainer>
			</Main>
		)
	);
};

export default CliPage;
