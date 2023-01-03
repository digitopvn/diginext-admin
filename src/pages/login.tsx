import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { login } from "@/api/api-auth";
import { BlankLayout } from "@/layouts/BlankLayout";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const LoginPage = () => {
	const router = useRouter();

	const redirectURL = (router.query.redirect_url ?? process.env.NEXT_PUBLIC_BASE_URL) as string;

	return (
		<BlankLayout meta={<Meta title="Dashboard" description="Your workspace overview." />}>
			{/* Page Content */}
			<div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pb-12 text-center">
				<div className="mx-auto my-5 w-64">
					<img src={`${router.basePath}/assets/images/diginext_logo.svg`} alt="Diginext Logo" />
				</div>
				<div className="mb-6">Build faster. Deploy easier. More flexible.</div>
				<Button type="primary" size="large" onClick={() => login({ redirectURL })}>
					<GoogleOutlined />
					Sign in with Google
				</Button>
			</div>
		</BlankLayout>
	);
};

export default LoginPage;
