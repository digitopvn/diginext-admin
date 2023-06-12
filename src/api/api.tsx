import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
// import { notification } from "antd";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { isArray, isEmpty, isString } from "lodash";
import { useRouter } from "next/router";

// import { notification } from "@/commons/notification";
import { Config } from "@/utils/AppConfig";

import type { ApiOptions, ApiPagination, ApiResponse } from "./api-types";

const { useApp } = App;

export const useListApi = <T,>(keys: any[], apiPath: string, options: ApiOptions = {}) => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	const { pagination = { page: 1, size: 20 }, populate, filter, sort = "-updatedAt,-createdAt" } = options;
	const paginationParams = new URLSearchParams(pagination as any).toString();
	const populateParams = populate ? `populate=${populate}` : "";
	const filterParams = filter ? new URLSearchParams(filter).toString() : "";
	const sortParams = `sort=${sort}`;

	const queryClient = useQueryClient();

	const queryKeys = [...keys];
	queryKeys.push(!isEmpty(filter) ? filter : {});
	if (!isEmpty(pagination)) queryKeys.push(pagination);

	return useQuery<any, Error, { list: T[]; pagination: ApiPagination; messages: string; status: number }>({
		refetchOnWindowFocus: false,
		queryKey: queryKeys,
		staleTime: options?.staleTime,
		enabled: options?.enabled,
		queryFn: async () => {
			const { data } = await axios.get<ApiResponse<T[]>>(
				`${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}&${sortParams}&${populateParams}&${paginationParams}`,
				{ ...options, headers }
			);

			if (!data.status && !isEmpty(data.messages)) {
				data.messages.forEach((message) => {
					if (message) notification.error({ message: "Failed.", description: message });
				});
			}

			const { current_page, total_pages, total_items, page_size, next_page, prev_page, ...rest } = data;

			// for token is about to expired
			if (data.token?.access_token) setCookie("x-auth-cookie", data.token?.access_token);

			// console.log("data :>> ", data);
			return {
				list:
					data.data.map((d: any) => {
						queryClient.setQueryData([keys[0], d._id], d);
						queryClient.setQueryData([keys[0], d.slug], d);
						queryClient.setQueryData([keys[0], { slug: d.slug }], d);
						return { ...d, key: d._id };
					}) || [],
				pagination: { current_page, total_pages, total_items, page_size, next_page, prev_page },
				messages: data.messages,
				status: data.status,
			};
		},
	});
};

export const useItemSlugApi = <T,>(keys: any[], apiPath: string, slug: string, options: ApiOptions = {}) => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	const { populate, filter = {} } = options;
	filter.slug = slug;

	const populateParams = populate ? `populate=${populate}` : "";
	const filterParams = new URLSearchParams(filter).toString();

	return useQuery<T, Error>({
		enabled: slug !== undefined && slug !== null,
		queryKey: keys,
		staleTime: options?.staleTime,
		queryFn: async () => {
			const url = `${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}&${populateParams}`;
			const { data } = await axios.get<ApiResponse<T[]>>(url, { ...options, headers });

			if (!data.status && !isEmpty(data.messages)) {
				data.messages.forEach((message) => {
					if (message) notification.error({ message: "Failed.", description: message });
				});
			}

			// for token is about to expired
			if (data.token?.access_token) setCookie("x-auth-cookie", data.token?.access_token);

			if (isArray(data.data)) {
				const _data = data.data.map((d: any) => {
					return { ...d, key: d._id };
				});
				return _data[0];
			}

			if (isString(data.data)) return { status: data.status, data: data.data, messages: data.messages };

			return data.data;
		},
	});
};

export const useApi = <T,>(keys: any[], apiPath: string, options: ApiOptions = {}) => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";
	// console.log(apiPath, "> headers :>> ", headers);

	return useQuery<ApiResponse<T>, Error>({
		queryKey: keys,
		queryFn: async () => {
			const { data } = await axios.get<ApiResponse<T>>(`${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}`, { ...options, headers });
			if (!data.status && !isEmpty(data.messages)) {
				data.messages.forEach((message) => {
					if (message) notification.error({ message: "Failed.", description: message });
				});
			}
			return data;
		},
	});
};

const getById = async <T,>(apiPath: string, id: string, options: AxiosRequestConfig = {}) => {
	const { data } = await axios.get<ApiResponse<T>>(`${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?id=${id}`, options);
	return data;
};

export const useItemApi = <T,>(keys: any[], apiPath: string, id: string, options: ApiOptions = {}) => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	return useQuery<ApiResponse<T>, Error>({
		queryKey: keys,
		queryFn: async () => {
			const data = await getById<T>(apiPath, id, { ...options, headers });
			if (!data.status && !isEmpty(data.messages)) {
				data.messages.forEach((message) => {
					if (message) notification.error({ message: "Failed.", description: message });
				});
			}
			return data;
		},
		enabled: !!id,
		staleTime: options?.staleTime,
	});
};

export type UseCreateApi<T> = [(data: T) => Promise<ApiResponse<T>> | undefined, "error" | "idle" | "loading" | "success"];

export const useCreateApi = <T,>(keys: any[], apiPath: string, options: ApiOptions = {}): UseCreateApi<T> => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	// console.log("useCreateApi > access_token :>> ", access_token);
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	const { populate, sort, pagination, filter } = options;
	const filterParams = filter ? `${new URLSearchParams(filter).toString()}&` : "";
	const populateParams = populate ? `populate=${populate}` : "";
	const apiURL = `${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}${populateParams}`;

	const mutation = useMutation<ApiResponse<T>, Error, T>({
		mutationFn: async (newData) => {
			const { data, status } = await axios.post<ApiResponse<T>>(apiURL, newData, { ...options, headers });
			if (status === 429) throw new Error("Too many requests.");

			if (!data.status) {
				if (!isEmpty(data.messages)) {
					data.messages.forEach((message) => {
						if (message)
							try {
								notification.error({ message: "Failed.", description: message });
							} catch (e) {
								console.error(e);
							}
					});
				} else {
					notification.error({ message: "Something is wrong..." });
				}
			}

			return data;
		},

		onError: async (error, variables, ctx) => {
			console.log("error :>> ", error);
			// console.log("ctx :>> ", ctx);
			// console.log("variables :>> ", variables);
		},

		onMutate: async (newData) => {
			// A mutation is about to happen!
			// Cancel current queries
			await queryClient.cancelQueries({ queryKey: keys });
			return newData;
		},

		onSuccess: (newItem, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [keys[0], "list"] });
			queryClient.invalidateQueries({ queryKey: [keys[0], (newItem as any)?.slug] });
		},
	});

	const { mutateAsync, status } = mutation;
	return [mutateAsync, status];
};

type UpdateData = { id?: string; _id?: string; state?: string };

const updateById = async (apiPath: string, id: string, updateData: any, options: AxiosRequestConfig = {}) => {
	const apiURL = `${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?id=${id}`;
	const { data } = await axios.post(apiURL, updateData, options);
	return data;
};

export type UseUpdateApi<T> = [(data: T) => Promise<ApiResponse<T>> | undefined, "error" | "idle" | "loading" | "success"];

export const useUpdateApi = <T = any, R = any>(keys: any[], apiPath: string, options: ApiOptions = {}): UseUpdateApi<T | R> => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	// console.log("useUpdateApi > keys :>> ", keys);
	// console.log("useUpdateApi > filter :>> ", filter);

	const { pagination = { page: 1, size: 20 }, populate, sort = "-createdAt", filter } = options;
	const filterParams = filter ? `${new URLSearchParams(filter).toString()}&` : "";
	const sortParams = `sort=${sort}&`;
	const populateParams = populate ? `populate=${populate}&` : "";
	const paginationParams = new URLSearchParams(pagination as any).toString();
	const apiURL = `${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}${sortParams}${populateParams}${paginationParams}`;

	const mutation = useMutation<ApiResponse<T>, Error, T | R, { id?: string; previousData?: any }>({
		// [1] START
		mutationFn: async (updateData) => {
			// console.log("UPDATE > start > filter :>> ", filter);
			const { data } = await axios.patch<ApiResponse<T>>(apiURL, updateData, { ...options, headers });

			// show error message ONLY if status is failure
			if (!data.status) {
				if (!isEmpty(data.messages)) {
					console.log("FAILLLLLLLLLLLLLLL :>> ", data.messages, notification);

					data.messages.forEach((message) => {
						if (message) notification.error({ message: "Failed.", description: message, style: { zIndex: 100 } });
					});
				} else {
					notification.error({ message: "Something is wrong..." });
				}
			}

			return data;
		},

		// [2] - FINISH & SUCCESS!
		onSuccess: (updateData, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [keys[0], "list"] });

			if (filter?.slug) queryClient.invalidateQueries({ queryKey: [keys[0], filter.slug] });
		},
	});

	return [mutation.mutateAsync, mutation.status];
};

export type UseDeleteApi<T> = [(data: T) => Promise<ApiResponse<T>> | undefined, "error" | "idle" | "loading" | "success"];

export const useDeleteApi = <T = any,>(keys: any[], apiPath: string, options: ApiOptions = {}): UseDeleteApi<T> => {
	// const [noti] = notification.useNotification();
	const app = useApp();
	const { notification } = app;

	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	// const { filter } = options;

	const mutation = useMutation<ApiResponse<T>, Error, T>({
		mutationFn: async (filter) => {
			const filterParams = filter ? `${new URLSearchParams(filter).toString()}` : "";
			const apiURL = `${Config.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}`;
			const { data } = await axios.delete<ApiResponse<T>>(apiURL, { ...options, headers });

			if (!data.status) {
				if (!isEmpty(data.messages)) {
					data.messages.forEach((message) => {
						console.log("message :>> ", message);
						if (message) notification.error({ message: "Failed.", description: message });
					});
				} else {
					notification.error({ message: "Something is wrong..." });
				}
			}

			return data;
		},
		onSuccess: (data) => {
			// update the list in cache
			queryClient.invalidateQueries({ queryKey: [keys[0], "list"] });
			return data;
		},
	});

	const { mutateAsync, status } = mutation;
	// return { proceed: mutation.mutateAsync, status: mutation.status };
	return [mutateAsync, status];
	// return mutation;
};
