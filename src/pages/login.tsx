import { GoogleOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

import { login } from "@/api/api-auth";
import BasicAuth from "@/commons/auth/basic-auth";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { Config } from "@/utils/AppConfig";

/**
 * Dashboard Page
 */
const LoginPage = () => {
	const [{ redirect_url }] = useRouterQuery();
	const redirectURL = (redirect_url ?? global?.window?.location?.origin ?? Config.NEXT_PUBLIC_BASE_URL) as string;

	return (
		<Main useSidebar={false} meta={<Meta title="Dashboard" description="Your workspace overview." />}>
			{/* Page Content */}
			<CenterContainer className="text-center">
				<DiginextLogo useTagline />
				<BasicAuth />

				{/* TODO: Check GOOGLE_ID & SECRET */}
				<>
					<Divider>OR</Divider>
					<Button type="primary" size="large" onClick={() => login({ redirectURL })}>
						<GoogleOutlined />
						Sign in with Google
					</Button>
				</>
			</CenterContainer>
		</Main>
	);
};

export default LoginPage;
