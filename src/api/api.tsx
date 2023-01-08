import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { isArray } from "lodash";
import { useRouter } from "next/router";

import type { ApiOptions, ApiPagination } from "./api-types";

export const useListApi = <T,>(keys: any[], apiPath: string, options: ApiOptions = {}) => {
	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

	const { pagination = { page: 1, size: 20 }, populate, filter, sort = "-createdAt" } = options;
	const paginationParams = new URLSearchParams(pagination as any).toString();
	const populateParams = populate ? `populate=${populate}` : "";
	const filterParams = filter ? new URLSearchParams(filter).toString() : "";
	const sortParams = `sort=${sort}`;

	return useQuery<{ list: T[]; pagination: ApiPagination }, Error>({
		queryKey: ["website", ...keys, filter, pagination],
		queryFn: async () => {
			const { data } = await axios.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}&${sortParams}&${populateParams}&${paginationParams}`,
				{
					...options,
					headers,
				}
			);

			const { current_page, total_pages, total_items, page_size, next_page, prev_page, ...rest } = data;
			const { token = {} } = rest;

			// for token is about to expired
			if (token.access_token) setCookie("x-auth-cookie", access_token);

			return {
				list:
					data.data.map((d: any) => {
						return { ...d, key: d._id };
					}) || [],
				pagination: { current_page, total_pages, total_items, page_size, next_page, prev_page },
			};
		},
	});
};

export const useItemSlugApi = <T,>(keys: any[], apiPath: string, options: ApiOptions = {}) => {
	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

	const { populate, filter } = options;
	const populateParams = populate ? `populate=${populate}` : "";
	const filterParams = filter ? new URLSearchParams(filter).toString() : "";

	return useQuery<T, Error>({
		enabled: filterParams !== "",
		queryKey: ["website", ...keys, filter],
		queryFn: async () => {
			const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}&${populateParams}`;
			const { data } = await axios.get(url, { ...options, headers });

			// for token is about to expired
			const { token = {} } = data;
			if (token.access_token) setCookie("x-auth-cookie", access_token);

			console.log("data :>> ", data);

			const result =
				isArray(data.data) && data.data.length > 0
					? data.data.map((d: any) => {
							return { ...d, key: d._id };
					  })
					: data.data;

			return result;
		},
	});
};

const getById = async (apiPath: string, id: string, options: AxiosRequestConfig = {}) => {
	const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?id=${id}`, options);
	return data;
};

export const useItemApi = <T,>(keys: any[], apiPath: string, id: string, options: ApiOptions = {}) => {
	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

	return useQuery<T, Error>({
		queryKey: ["website", ...keys, id],
		queryFn: () => getById(apiPath, id, { ...options, headers }),
		enabled: !!id,
	});
};

export const useCreateApi = <T,>(keys: any[], apiPath: string, options: AxiosRequestConfig = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

	const mutation = useMutation<T, Error, T>({
		mutationFn: async (updateData) => {
			const apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}`;
			const { data } = await axios.post(apiURL, updateData, { ...options, headers });
			return data.data;
		},

		onMutate: async (updateData) => {
			// A mutation is about to happen!
			// Cancel current queries
			await queryClient.cancelQueries({ queryKey: keys });

			// Add optimistic todo to todos list
			// queryClient.setQueryData<T[]>(keys, (currentList) => (currentList ? [...currentList, updateData] : [updateData]));

			// Return context with the optimistic todo
			return updateData;
		},

		// onError: (error, variables, context) => {
		// An error happened!
		// console.log(`rolling back optimistic update with id ${context.id}`);
		// },

		// onSuccess: (newItem, variables, context) => {
		// 	queryClient.setQueryData([...keys, (newItem as any)._id], newItem);
		// },

		// onSettled: (data, error, variables, context) => {
		// Error or success... doesn't matter!
		// },
	});

	return { proceed: mutation.mutateAsync, status: mutation.status };
};

type UpdateData = { id?: string; _id?: string; state?: string };

const updateById = async (apiPath: string, id: string, updateData: any, options: AxiosRequestConfig = {}) => {
	const apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?id=${id}`;
	const { data } = await axios.post(apiURL, updateData, options);
	return data;
};

export const useUpdateApi = <T,>(keys: any[], apiPath: string, filter: any = {}, options: ApiOptions = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

	const { pagination = { page: 1, size: 20 }, populate, sort = "-createdAt" } = options;
	const paginationParams = new URLSearchParams(pagination as any).toString();
	const populateParams = populate ? `populate=${populate}` : "";
	const filterParams = filter ? new URLSearchParams(filter).toString() : "";
	const sortParams = `sort=${sort}`;

	const mutation = useMutation<T & UpdateData, Error, any, { id?: string; previousData?: any }>({
		// [2] START
		mutationFn: async (updateData) => {
			console.log("UPDATE > start > filter :>> ", filter);

			const apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${filterParams}&${sortParams}&${populateParams}&${paginationParams}`;
			const { data } = await axios.patch(apiURL, updateData, { ...options, headers });

			return data.data as T & UpdateData;
		},

		// [1] PREPARE: Run before "mutiationFn"
		onMutate: async (updateData) => {
			// A mutation is about to happen!
			// Cancel current queries
			await queryClient.cancelQueries({ queryKey: keys });

			let updatedItem: T | undefined;

			const { id } = filter;

			// save previous data to roll it back if any errors
			const previousData = queryClient.getQueryData<T & UpdateData[]>(keys)?.find((item) => (item as any)._id === id);
			console.log("UPDATE > prepare > previousData :>> ", previousData);

			// Add optimistic item to the list
			queryClient.setQueryData<T[]>(keys, (currentList) => {
				return currentList?.map((item) => {
					updatedItem = { ...item, updateData } as T;
					return (item as any)._id === (updateData as any)._id ? updatedItem : item;
				});
			});

			// add state: loading
			if (updatedItem) {
				(updatedItem as any).state = "loading";

				// Update optimistic item
				queryClient.setQueryData<T>([...keys, (updatedItem as any)._id], (currentData) => {
					return updatedItem;
				});
			}

			console.log("UPDATE > prepare > updatedItem :>> ", updatedItem);

			return { id, previousData };
		},

		// [3] - FINISH & ERROR!
		onError: (error, variables, context) => {
			// An error happened -> rolling back optimistic update!
			console.log(`rolling back optimistic update with id ${context?.id}`);

			const { previousData } = context || {};

			// roll back item
			// queryClient.setQueryData<T>([keys, (previousData as any)._id], () => previousData);

			// Add optimistic item to the list
			queryClient.setQueryData<T[]>(keys, (currentList) =>
				currentList?.map((item) => (previousData && (item as any)._id === previousData?._id ? previousData : item))
			);

			// roll back item
			// add state: failed
			if (previousData) {
				(previousData as any).state = "failed";

				// Update optimistic item
				queryClient.setQueryData<T>([...keys, (previousData as any)._id], () => previousData);
			}

			console.log("UPDATE > error > previousData :>> ", previousData);
		},

		// [3] - FINISH & SUCCESS!
		onSuccess: (updateData, variables, context) => {
			// Boom baby!
			console.log("UPDATE > success > updateData :>> ", updateData);
		},

		// [3] - FINISH !
		onSettled: (updateData, error, variables, context) => {
			// Error or success... doesn't matter!
			// console.log("UPDATE > error > updateData :>> ", updateData);
			// if (updateData) {
			// 	updateData.state = "loading";
			// }
		},
	});

	return mutation;
};

export const useDeleteApi = <T,>(keys: any[], apiPath: string, filter: any = {}, options: ApiOptions = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	const queryFilter = new URLSearchParams(filter).toString();

	const mutation = useMutation<T, Error>({
		mutationFn: () => {
			const apiURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${queryFilter}`;
			return axios.delete(apiURL, { ...options, headers });
		},
		onSuccess: (data) => {
			// update the list in cache
		},
	});

	return { proceed: mutation.mutateAsync, status: mutation.status };
	// return mutation;
};
