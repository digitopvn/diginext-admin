import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { login, useAuth } from "@/api/api-auth";
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
			<div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pb-12 text-center">
				<DiginextLogo useTagline />
				<Button type="primary" size="large" onClick={() => login({ redirectURL })}>
					<GoogleOutlined />
					Sign in with Google
				</Button>
			</div>
		</Main>
	);
};

export default LoginPage;
