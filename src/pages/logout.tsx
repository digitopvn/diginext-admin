import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { ApiResponse } from "@/api/api-types";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { Config } from "@/utils/AppConfig";

/**
 * Dashboard Page
 */
const LogoutPage = () => {
	const router = useRouter();

	useEffect(() => {
		const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
		const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
		axios.get<ApiResponse>(`${Config.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, { headers }).then((response) => {
			console.log("logout() > response :>> ", response);
			router.push("/login");
		});
		deleteCookie("x-auth-cookie");
	}, []);

	return <Main useSidebar={false} meta={<Meta title="Sign Out" description="Signing out from the workspace..." />} />;
};

export default LogoutPage;
