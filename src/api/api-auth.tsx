import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
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
		staleTime: 30 * 60 * 1000, // 30 minutes
		queryKey: ["auth"],
		queryFn: async () => {
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, { headers });
			return data;
		},
	});
};

export const useAuth = () => {
	const [user, setUser] = useState();
	const { data: response, isError } = useAuthApi();
	const { status, data: loggedInUser } = response || {};

	useEffect(() => {
		console.log("loggedInUser :>> ", loggedInUser);
		if (loggedInUser) setUser(loggedInUser);
	}, [loggedInUser]);

	if (isError || status === 0) return user;

	return user ? (user as IUser) : user;
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const user = useAuth();

	return user ? <>{children}</> : <></>;
};
