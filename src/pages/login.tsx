import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { login } from "@/api/api-auth";
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
	const router = useRouter();
	// const [user] = useAuth();
	const [{ redirect_url }] = useRouterQuery();
	const redirectURL = (redirect_url ?? Config.NEXT_PUBLIC_BASE_URL) as string;

	// useEffect(() => {
	// 	if (!isEmpty(user)) router.push("/");
	// }, [user]);

	return (
		<Main useSidebar={false} meta={<Meta title="Dashboard" description="Your workspace overview." />}>
			{/* Page Content */}
			<CenterContainer className="text-center">
				<DiginextLogo useTagline />
				<Button type="primary" size="large" onClick={() => login({ redirectURL })}>
					<GoogleOutlined />
					Sign in with Google
				</Button>
			</CenterContainer>
		</Main>
	);
};

export default LoginPage;
