import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

export const useListApi = <T,>(keys: any[], apiPath: string, options: AxiosRequestConfig = {}) => {
	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };

	return useQuery<T[], Error>({
		queryKey: ["website", ...keys],
		queryFn: async () => {
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}`, { ...options, headers });
			return data.data;
		},
	});
};

const getById = async (apiPath: string, id: string, options: AxiosRequestConfig = {}) => {
	const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?id=${id}`, options);
	return data;
};

export const useItemApi = <T,>(keys: any[], apiPath: string, id: string) => {
	const router = useRouter();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };
	return useQuery<T, Error>({
		queryKey: ["website", ...keys, id],
		queryFn: () => getById(apiPath, id, { headers }),
		enabled: !!id,
	});
};

export const useCreateApi = <T,>(keys: any[], apiPath: string, data: any = {}, options: AxiosRequestConfig = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };

	const mutation = useMutation<T, Error>({
		mutationFn: (updateData) => {
			return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}`, updateData, { ...options, headers });
		},
		// onMutate: async (variables) => {
		// 	// A mutation is about to happen!
		// 	// Cancel current queries
		// 	await queryClient.cancelQueries({ queryKey: keys });
		// 	// Create optimistic todo
		// 	const updateData = data;
		// 	// Add optimistic todo to todos list
		// 	queryClient.setQueryData(["todos"], (old) => [...old, optimisticTodo]);
		// 	// Return context with the optimistic todo
		// 	return { optimisticTodo };
		// 	// Optionally return a context containing data to use when for example rolling back
		// 	// return { id: 1 };
		// },
		// onError: (error, variables, context) => {
		// An error happened!
		// console.log(`rolling back optimistic update with id ${context.id}`);
		// },
		onSuccess: (newItem, variables, context) => {
			queryClient.setQueryData([...keys, (newItem as any)._id], newItem);
		},
		// onSettled: (data, error, variables, context) => {
		// Error or success... doesn't matter!
		// },
	});

	return mutation.mutate;
};

export const useUpdateApi = <T,>(keys: any[], apiPath: string, filter: any = {}, data: any = {}, options: AxiosRequestConfig = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };

	const mutation = useMutation<T, Error>({
		mutationFn: (updateData) => {
			return axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}`, updateData, { ...options, headers });
		},
		onMutate: async (variables) => {
			// A mutation is about to happen!

			// Cancel current queries
			// await queryClient.cancelQueries({ queryKey: keys });

			// Create optimistic todo
			// const updateData = data;

			// Add optimistic todo to todos list
			// queryClient.setQueryData(["todos"], (old) => [...old, optimisticTodo]);

			// Return context with the optimistic todo
			// return { optimisticTodo };

			// Optionally return a context containing data to use when for example rolling back
			return { id: 1 };
		},
		// onError: (error, variables, context) => {
		// An error happened!
		// console.log(`rolling back optimistic update with id ${context.id}`);
		// },
		// onSuccess: (data, variables, context) => {
		// Boom baby!
		// },
		// onSettled: (data, error, variables, context) => {
		// Error or success... doesn't matter!
		// },
	});

	return mutation.mutate(data);
};

export const useDeleteApi = <T,>(keys: any[], apiPath: string, filter: any = {}, options: AxiosRequestConfig = {}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const access_token = router.query.access_token ?? getCookie("x-auth-cookie");
	const headers = { Authorization: `Bearer ${access_token}` };
	const queryFilter = new URLSearchParams(filter).toString();

	const mutation = useMutation<T, Error>({
		mutationFn: () => {
			return axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPath}?${queryFilter}`, { ...options, headers });
		},
		onSuccess: (data) => {
			// update the list in cache
		},
	});

	return mutation.mutate;
};
