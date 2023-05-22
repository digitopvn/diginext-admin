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
	window.location.href = `${Config.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_url=${redirectURL}`;
};

export const useAuthApi = (props: { access_token?: string } = {}) => {
	const { access_token = getCookie("x-auth-cookie") } = props;
	const router = useRouter();

	return useQuery({
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 60 * 1000,
		queryKey: ["auth"],
		// enabled: typeof access_token !== "undefined",
		queryFn: async () => {
			const urlParams = new URLSearchParams(router.asPath.split("?")[1]);
			const query = Object.fromEntries(urlParams);
			const { access_token: queryToken } = query;

			// console.log("queryToken :>> ", queryToken);
			const token = access_token ?? getCookie("x-auth-cookie") ?? queryToken;

			const headers = token ? { Authorization: `Bearer ${token}` } : {};
			const { data } = await axios.get(`${Config.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, { headers });

			return data;
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
	// const [isSettled, setIsSettled] = useState<boolean>(false);

	const authActions = useAuthApi({ access_token: access_token as string });
	const { data: response, isError, isFetched, isLoading, isSuccess, refetch } = authActions;
	const { status, data } = response || {};
	const user = response?.data as IUser;
	const queryClient = useQueryClient();

	const reload = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth"] });
	};

	useEffect(() => {
		if (typeof status === "undefined") return;
		if (isFetched === false) return;

		setTimeout(() => {
			const cookieToken = getCookie("x-auth-cookie");

			if (!cookieToken || !status) return router.push(redirectUrl ? `/login?redirect_url=${redirectUrl}` : `/login`);

			if (!user.activeWorkspace) return router.push(`/workspace/select`);

			return reload();
		}, 200);
	}, [status]);

	return [user, authActions] as [IUser, typeof authActions];
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const router = useRouter();

	const [user, { isLoading, isFetched }] = useAuth();

	const { workspaces = [] } = user || {};

	// const workspaceSlug = workspaces[0]?.slug;
	// const workspace = useWorkspace({ name: workspaceSlug });
	const workspace = user.activeWorkspace;

	// useEffect(() => {
	// 	if (!workspaces) return;
	// 	if (workspaces.length === 0) router.push(`/workspace/setup`);
	// }, [workspaces]);

	if (isLoading)
		return (
			<CenterContainer>
				<LoadingOutlined />
				<span className="ml-2">Loading...</span>
			</CenterContainer>
		);

	if (isFetched && isEmpty(user)) return <></>;

	if (!workspace)
		return (
			<CenterContainer className="text-center">
				<Alert message="Error" description={`This workspace does not exists.`} type="error" />
			</CenterContainer>
		);

	return <>{children}</>;
};
