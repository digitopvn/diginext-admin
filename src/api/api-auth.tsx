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
	const finalURL = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_url=${redirectURL}`;
	// console.log("login() > redirectURL :>> ", redirectURL);
	// console.log("login() > finalURL :>> ", finalURL);
	window.location.href = finalURL;
};

export const useAuthApi = (props: { access_token?: string } = {}) => {
	const router = useRouter();
	const access_token = (router.query.access_token || getCookie("x-auth-cookie")) as string;
	// console.log("useAuthApi > access_token :>> ", access_token);

	return useQuery({
		// staleTime: 5 * 60 * 1000, // 5 minutes
		// cacheTime: 60 * 1000,
		queryKey: ["auth"],
		enabled: typeof access_token !== "undefined",
		queryFn: async () => {
			// try the best to get "access_token"...
			const ac = access_token && endsWith(access_token, "%23") ? access_token.substring(0, access_token.length - 3) : access_token;
			const headers = ac ? { Authorization: `Bearer ${ac}` } : {};
			console.log("useAuthApi > queryFn > headers :>> ", headers);

			try {
				const url = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/profile${ac ? `?access_token=${ac}` : ""}`;
				// console.log("useAuthApi > queryFn > url :>> ", url);
				const { data } = await axios.get(url, { headers });
				// console.log("useAuthApi > queryFn > profile :>> ", JSON.stringify(data, null, 2));
				if (data?.token?.access_token) setCookie("x-auth-cookie", data?.token?.access_token);
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

	const authActions = useAuthApi();
	const { data: response, status: apiStatus, refetch, isStale, isRefetching } = authActions;
	const { status: responseStatus } = response || {};
	const user = response?.data as IUser | undefined;
	const queryClient = useQueryClient();

	const reload = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth"] });
		await refetch();
	};

	const access_token = (router.query.access_token || getCookie("x-auth-cookie")) as string;

	useEffect(() => {
		// console.log(`[1] ----------------------------------`);
		// console.log("apiStatus :>> ", apiStatus);
		// console.log("responseStatus :>> ", responseStatus);
		// console.log("user :>> ", user);

		// const access_token = (router.query.access_token || getCookie("x-auth-cookie")) as string;
		// console.log("access_token :>> ", access_token);
		// console.log("isStale :>> ", isStale);
		// console.log("isRefetching :>> ", isRefetching);
		// console.log(`---------------------------------- [1]`);

		if (!access_token) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}
		if (isRefetching) return;
		if (typeof responseStatus === "undefined") return;
		if (apiStatus === "loading") return;

		if (!responseStatus && !user) {
			router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);
			return;
		}

		if (isEmpty(user?.activeWorkspace) || isEmpty(user?.activeRole)) {
			// reload().then(() => router.push(`/workspace/select`));
			router.push(`/workspace/select`);
		}
	}, [apiStatus, access_token]);

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
