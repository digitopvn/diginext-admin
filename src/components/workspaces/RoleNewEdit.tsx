import { useRoleCreateApi, useRoleSlugApi, useRoleUpdateApi } from "@/api/api-role";
import type { IRole } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type RoleNewEditProps = { data?: IRole; isNew?: boolean };

const RoleNewEdit = (props: RoleNewEditProps = {}) => {
	const [{ role: roleSlug }] = useRouterQuery();

	// registries
	const useSlugApi = useRoleSlugApi(roleSlug, { populate: "owner" });
	const { data: role } = useSlugApi || {};
	const useUpdateApi = useRoleUpdateApi({ filter: { id: role?._id } });
	const useCreateApi = useRoleCreateApi();
	// console.log("role :>> ", role);

	// cloud providers
	// const { data: { list: providers = [] } = {} } = useCloudProviderListApi();
	// console.log("providers :>> ", providers);

	const smartFormConfigs: SmartFormElementProps[] = [
		{
			type: "input",
			label: "Name",
			name: "name",
			placeholder: "Role's name",
			disabled: typeof role === "undefined" || typeof role.type === "undefined" || ["administrator", "moderator", "member"].includes(role.type),
		},
	];

	return <SmartForm name="roles" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default RoleNewEdit;
