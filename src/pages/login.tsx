import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { login, useAuth } from "@/api/api-auth";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const LoginPage = () => {
	const router = useRouter();
	const [user] = useAuth();
	const redirectURL = (router.query.redirect_url ?? process.env.NEXT_PUBLIC_BASE_URL) as string;

	if (user) {
		router.push("/");
		return <></>;
	}

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
