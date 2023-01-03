import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

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
		staleTime: 60 * 1000, // 1 minute
		queryKey: ["auth"],
		queryFn: async () => {
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, { headers });
			return data;
		},
	});
};

export const AuthPage = (props: { children?: ReactNode } = {}) => {
	const { children } = props;

	const getLoggedInUser = useAuthApi();
	const router = useRouter();

	const { data: response, isLoading, isError } = getLoggedInUser;

	if (isLoading) return <></>;

	if (isError) {
		router.push("/login");
		return <></>;
	}

	const { status, data: loggedInUser } = response;

	if (status === 0) router.push("/login");

	console.log("loggedInUser :>> ", loggedInUser);
	// useEffect(() => {
	// 	// if (!loggedInUser) router.push(`/login`);
	// }, [loggedInUser]);

	return <>{children}</>;
};
