import { HomeOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "@/api/api-auth";
import { useUserJoinWorkspaceApi } from "@/api/api-user";
import CenterContainer from "@/commons/CenterContainer";
import CopyCode from "@/commons/CopyCode";
import DiginextLogo from "@/commons/DiginextLogo";
import { useWorkspace } from "@/providers/useWorkspace";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { Config } from "@/utils/AppConfig";

const CliPage = () => {
	const router = useRouter();
	const currentOrigin = typeof window !== "undefined" ? window?.location?.origin : Config.NEXT_PUBLIC_BASE_URL;
	const redirectUrl = `${currentOrigin}/cli`;
	const [user, { isFetched }] = useAuth({ redirectUrl });

	// console.log("user :>> ", user);
	const [joinApi] = useUserJoinWorkspaceApi();

	const _slug = user?.workspaces && user?.workspaces.length > 0 ? user?.workspaces[0].slug : undefined;
	const workspace = useWorkspace({ name: _slug });
	const { slug: workspaceSlug } = workspace || {};
	// console.log("workspaceSlug :>> ", workspaceSlug);

	const joinWorkspace = async (userId: string) => {
		if (!workspaceSlug) return;
		if (!workspace) return;

		console.log("userId :>> ", userId);

		const joinedUser = await joinApi({
			userId,
			workspace: workspaceSlug,
		});
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
							<CopyCode value={!isEmpty(user) ? (user?.token as any).access_token : ""} />
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
