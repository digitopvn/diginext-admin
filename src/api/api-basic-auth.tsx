import { useCreateApi } from "./api";
import type { ApiOptions, IUser } from "./api-types";

export const useBasicAuthLoginApi = (options?: ApiOptions) => {
	return useCreateApi<{ user: IUser; access_token: string; refresh_token: string }>(["basic-auth", "login"], `/api/v1/login`, options);
};

export const useBasicAuthRegisterApi = (options?: ApiOptions) => {
	return useCreateApi<{ user: IUser; access_token: string; refresh_token: string }>(["basic-auth", "register"], `/api/v1/register`, options);
};
