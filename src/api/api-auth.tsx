import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { IUser } from "./api-types";

export const login = (params: { redirectURL?: string } = {}) => {
	const redirectURL = params.redirectURL ?? window.location.href;
	window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?redirect_url=${redirectURL}`;
};

export const useAuthApi = () => {
	const router = useRouter();

	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };

	if (access_token) setCookie("x-auth-cookie", access_token);

	return useQuery({
		staleTime: 2 * 60 * 1000, // 2 minutes
		queryKey: ["auth"],
		queryFn: async () => {
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, { headers });
			return data;
		},
	});
};

export const useAuth = (): [IUser | undefined, () => Promise<void> | undefined] => {
	const router = useRouter();
	const [user, setUser] = useState<IUser>();
	const { data: response, isError } = useAuthApi();
	const { status, data: loggedInUser } = response || {};
	const queryClient = useQueryClient();

	useEffect(() => {
		if (typeof loggedInUser === "undefined") return;
		console.log("loggedInUser :>> ", loggedInUser);
		if (!isEmpty(loggedInUser)) {
			setUser(loggedInUser);
		} else {
			router.push(`/login`);
		}
	}, [loggedInUser]);

	if (isError || status === 0) return [user, () => undefined];

	const reload = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth"] });
	};

	return [user, reload];
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const [user] = useAuth();

	return user ? <>{children}</> : <></>;
};
