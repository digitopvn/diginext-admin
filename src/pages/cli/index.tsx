import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { AuthPage, useAuth } from "@/api/api-auth";
import CenterContainer from "@/commons/CenterContainer";
import CopyCode from "@/commons/CopyCode";
import DiginextLogo from "@/commons/DiginextLogo";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const CliPage = () => {
	const router = useRouter();
	const [user] = useAuth();

	// console.log("user :>> ", user);

	return (
		<AuthPage>
			<Main useSidebar={false} meta={<Meta title="CLI Authentication" description="Authenticate before using the CLI commands." />}>
				{/* Page Content */}
				<CenterContainer className="max-w-xs text-center">
					<DiginextLogo />
					<p>Copy & paste this ACCESS TOKEN into your command interface:</p>
					<CopyCode value={user ? (user?.token as any).access_token : ""} />
					<hr className="my-4" />
					<Button size="large" href="/" icon={<HomeOutlined className="align-middle" />}>
						Dashboard
					</Button>
				</CenterContainer>
			</Main>
		</AuthPage>
	);
};

export default CliPage;
