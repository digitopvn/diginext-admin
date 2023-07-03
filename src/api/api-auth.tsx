import { LoadingOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "antd";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import CenterContainer from "@/commons/CenterContainer";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Config } from "@/utils/AppConfig";

import type { IUser } from "./api-types";

export const login = (params: { redirectURL?: string } = {}) => {
	const redirectURL = params.redirectURL ?? Config.NEXT_PUBLIC_API_BASE_URL;
	const finalURL = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_url=${redirectURL}`;
	// console.log("login() > redirectURL :>> ", redirectURL);
	// console.log("login() > finalURL :>> ", finalURL);
	window.location.href = finalURL;
};

export const useAuthApi = (props: { access_token?: string } = {}) => {
	const [routerQuery] = useRouterQuery();

	const { access_token = getCookie("x-auth-cookie") || routerQuery.access_token } = props;
	const router = useRouter();

	return useQuery({
		staleTime: 5 * 60 * 1000, // 5 minutes
		// cacheTime: 60 * 1000,
		queryKey: ["auth"],
		// enabled: typeof access_token !== "undefined",
		queryFn: async () => {
			const urlParams = new URLSearchParams(router.asPath.split("?")[1]);
			const query = Object.fromEntries(urlParams);
			const { access_token: queryToken } = query;
			const token = access_token ?? getCookie("x-auth-cookie") ?? queryToken;
			const headers = token ? { Authorization: `Bearer ${token}` } : {};
			try {
				const { data } = await axios.get(`${Config.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, { headers });
				return data;
			} catch (e) {
				console.error("useAuthApi >", e);
				return undefined;
			}
		},
	});
};

export const useAuth = (props: { redirectUrl?: string } = {}) => {
	const { redirectUrl } = props;

	const router = useRouter();
	const [query] = useRouterQuery();

	const { access_token = getCookie("x-auth-cookie") } = query;
	if (access_token) setCookie("x-auth-cookie", access_token);

	// const [user, setUser] = useState<IUser>();

	const authActions = useAuthApi({ access_token: access_token as string });
	const { data: response, status: apiStatus, isError, isFetched, isLoading, isSuccess, refetch } = authActions;
	const { status: responseStatus, data } = response || {};
	const user = response?.data as IUser | undefined;
	const queryClient = useQueryClient();

	const reload = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth"] });
	};

	useEffect(() => {
		if (!router.isReady) return;

		const cookieToken = getCookie("x-auth-cookie") || query.access_token;

		// console.log(`----------------------------------`);
		// console.log("apiStatus :>> ", apiStatus);
		// console.log("responseStatus :>> ", responseStatus);
		// console.log("user :>> ", user);
		// console.log("cookieToken :>> ", cookieToken);

		if (typeof responseStatus === "undefined") return;
		if (apiStatus === "loading") return;

		if (!cookieToken || !responseStatus) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
		} else if (isEmpty(user?.activeWorkspace) || isEmpty(user?.activeRole)) {
			router.push(`/workspace/select`);
		}

		// setTimeout(() => {
		// 	if (!user?.activeWorkspace) return router.push(`/workspace/select`);

		// 	if (!cookieToken || !responseStatus) {
		// 		// return router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
		// 		if (typeof window !== "undefined") window.location.href = redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`;
		// 		return null;
		// 	}

		// 	return reload();
		// }, 400);
	}, [apiStatus, responseStatus]);

	return [user, authActions] as [IUser, typeof authActions];
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const router = useRouter();

	const [user, { status, isLoading, isFetched }] = useAuth();

	// useEffect(() => {
	// 	if (!router.isReady) return;
	// 	if (status === "success" && !user) router.push("/login");
	// }, [status, router.isReady]);

	if (isLoading)
		return (
			<CenterContainer>
				<LoadingOutlined />
				<span className="ml-2">Loading...</span>
			</CenterContainer>
		);

	if (isFetched && isEmpty(user))
		return (
			<>
				Login required:
				<br />
				{JSON.stringify(user || {}, null, 2)}
				<br />
				Origin: {window?.location?.origin}
			</>
		);

	if (!user?.activeWorkspace)
		return (
			<CenterContainer className="text-center">
				<Alert message="Error" description={`This workspace does not exists.`} type="error" />
			</CenterContainer>
		);

	return <>{children}</>;
};
