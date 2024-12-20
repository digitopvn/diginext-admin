import { LoadingOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { endsWith, isEmpty } from "lodash";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import CenterContainer from "@/commons/CenterContainer";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Config } from "@/utils/AppConfig";

import type { IUser } from "./api-types";

export const login = (params: { redirectURL?: string } = {}) => {
	const redirectURL = params.redirectURL ?? Config.NEXT_PUBLIC_API_BASE_URL;
	// console.log("login() > Config.NEXT_PUBLIC_API_BASE_URL :>> ", Config.NEXT_PUBLIC_API_BASE_URL);
	const finalURL = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_url=${redirectURL}`;
	// console.log("login() > redirectURL :>> ", redirectURL);
	// console.log("login() > finalURL :>> ", finalURL);
	window.location.href = finalURL;
};

export const useAuthApi = (props: { access_token?: string } = {}) => {
	const router = useRouter();
	const [urlQuery] = useRouterQuery();

	let access_token = (urlQuery.access_token?.toString() || getCookie("x-auth-cookie")) as string | undefined;
	let refresh_token = (urlQuery.refresh_token?.toString() || getCookie("refresh_token")) as string | undefined;
	// console.log("useAuthApi > access_token :>> ", access_token);
	// console.log("refresh_token :>> ", refresh_token);

	return useQuery({
		// staleTime: 5 * 60 * 1000, // 5 minutes
		// cacheTime: 60 * 1000,
		queryKey: ["auth"],
		enabled: typeof access_token !== "undefined" && typeof refresh_token !== "undefined",
		queryFn: async () => {
			const query = Object.fromEntries(new URLSearchParams(router.asPath.indexOf("?") > -1 ? router.asPath.split("?")[1] : {}));

			// try the best to get "access_token"...
			access_token = access_token && endsWith(access_token, "%23") ? access_token.substring(0, access_token.length - 3) : access_token;
			const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};
			// console.log("useAuthApi() > queryFn > headers :>> ", headers);

			// console.log("query :>> ", query);
			refresh_token = query.refresh_token?.toString() || getCookie("refresh_token")?.toString();
			// console.log("useAuthApi() > refresh_token :>> ", refresh_token);

			try {
				const url = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/profile`;
				// console.log("useAuthApi() > queryFn > url :>> ", url);
				const { data: response } = await axios.get(url, { headers, params: { access_token, refresh_token } });
				// console.log("useAuthApi() > queryFn > profile :>> ", JSON.stringify(response, null, 2));

				if (response?.data?.token?.access_token) setCookie("x-auth-cookie", response?.data?.token?.access_token);
				if (response?.data?.token?.refresh_token) setCookie("refresh_token", response?.data?.token?.refresh_token);
				return response;
			} catch (e: any) {
				console.error("[HOOK] useAuthApi >", e);
				// return e.response;
				return undefined;
			}
		},
	});
};

export const useAuth = () => {
	const router = useRouter();
	const [urlQuery] = useRouterQuery();

	const authActions = useAuthApi();
	const { data: response, status: apiStatus, error, refetch, isStale, isRefetching } = authActions;
	const { status: responseStatus } = response || {};
	const user = response?.data as IUser | undefined;
	const queryClient = useQueryClient();

	const reload = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth"] });
		await refetch();
	};

	const access_token = (urlQuery.access_token || getCookie("x-auth-cookie")) as string;
	const refresh_token = (urlQuery.refresh_token || getCookie("refresh_token")) as string;
	// console.log("url query > tokens :>> ", urlQuery);

	useEffect(() => {
		console.log("error :>> ", error);
		// console.log(`[1] ----------------------------------`);
		// console.log("apiStatus :>> ", apiStatus);
		// console.log("response :>> ", response);
		// console.log("user :>> ", user);

		// const access_token = (router.query.access_token || getCookie("x-auth-cookie")) as string;
		// console.log("access_token :>> ", access_token);
		// console.log("refresh_token :>> ", refresh_token);
		// console.log("isStale :>> ", isStale);
		// console.log("isRefetching :>> ", isRefetching);
		// console.log(`---------------------------------- [1]`);

		const redirectUrl = window?.location.href;

		if (error) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}

		if (!access_token) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}
		if (!refresh_token) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}

		if (isRefetching) return;
		if (typeof responseStatus === "undefined") return;
		if (apiStatus === "loading") return;

		// if (responseStatus === 401) {
		// 	// console.log(`Redirect to "Login" page :>>`, { access_token, refresh_token });
		// 	router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
		// 	return;
		// }

		if (!responseStatus && !user) {
			// console.log(`Redirect to "Login" page :>>`, { access_token, refresh_token });
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}

		if (isEmpty(user?.activeWorkspace) || isEmpty(user?.activeRole)) {
			// console.log(`Redirect to "Select Workspace" page :>>`, { access_token, refresh_token });
			router.push(`/workspace/select`, { query: { access_token, refresh_token } });
		}
	}, [apiStatus, access_token, refresh_token]);

	return [user, authActions] as [IUser, typeof authActions];
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const router = useRouter();

	const access_token = router.query.access_token || getCookie("x-auth-cookie");
	const [user, { status, isLoading, isFetched }] = useAuth();

	if (isLoading)
		return (
			<CenterContainer>
				<LoadingOutlined />
				<span className="ml-2">Loading...</span>
			</CenterContainer>
		);

	if (isFetched && !access_token && isEmpty(user))
		return (
			<CenterContainer>
				<p className="ml-2">Unauthenticated.</p>
				<Button href="/login">Login</Button>
			</CenterContainer>
		);

	if (isFetched && access_token && isEmpty(user))
		return (
			<CenterContainer>
				<LoadingOutlined />
				<span className="ml-2">Loading...</span>
			</CenterContainer>
		);

	if (isFetched && (isEmpty(user?.activeWorkspace) || isEmpty(user?.activeRole)))
		return (
			<CenterContainer className="text-center">
				<LoadingOutlined />
				<span className="ml-2">Loading...</span>
			</CenterContainer>
		);

	return <>{children}</>;
};
