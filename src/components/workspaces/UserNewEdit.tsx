import { useState } from "react";

import { useRoleListApi } from "@/api/api-role";
import type { IRole } from "@/api/api-types";
import { useUserAssignRoleApi, useUserCreateApi, useUserSlugApi, useUserUpdateApi } from "@/api/api-user";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

import UserPermissionSettings from "./UserPermissionSettings";

type UserNewEditProps = { data?: IRole; isNew?: boolean };

const UserNewEdit = (props: UserNewEditProps = {}) => {
	const [{ user: userSlug }] = useRouterQuery();

	// registries
	const useSlugApi = useUserSlugApi(userSlug, { populate: "roles" });
	const { data: user } = useSlugApi || {};
	const useUpdateApi = useUserUpdateApi({ filter: { id: user?._id }, populate: "roles" });
	const useCreateApi = useUserCreateApi({ populate: "roles" });
	// console.log("role :>> ", role);

	// roles
	const [assignRoleApi, assignStatus] = useUserAssignRoleApi();
	const { data: { list: roles = [] } = {} } = useRoleListApi();
	// console.log("roles :>> ", roles);
	const userRole = roles[0];
	const [currentRole, setCurrentRole] = useState(userRole);

	const assignRole = async (roleId: string) => {
		const res = await assignRoleApi({ roleId });
		console.log("res :>> ", res);
		if (res?.status) setCurrentRole(roles.find((role) => role._id === roleId));
	};

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "User's name" },
		{
			type: "select",
			label: "Role",
			name: "roles",
			style: { width: 250 },
			displayKey: "roles.0._id", // the magic is here 😅...
			// value: userRole?._id,
			options: roles.map((role) => {
				return { label: role.name || "", value: role._id };
			}),
		},
	];

	return (
		<>
			<SmartForm
				name="user"
				formType={props.isNew ? "new" : "edit"}
				className="pb-2"
				api={{ useSlugApi, useUpdateApi, useCreateApi }}
				configs={smartFormConfigs}
			/>
			<UserPermissionSettings user={user} />
		</>
	);
};

export default UserNewEdit;
