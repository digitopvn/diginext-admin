import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const LogoutPage = () => {
	const router = useRouter();

	useEffect(() => {
		deleteCookie("x-auth-cookie");
		router.push("/login");
	}, []);

	return <Main useSidebar={false} meta={<Meta title="Sign Out" description="Signing out from the workspace..." />} />;
};

export default LogoutPage;
