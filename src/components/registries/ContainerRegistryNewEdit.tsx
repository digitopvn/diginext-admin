import { useContainerRegistryCreateApi, useContainerRegistrySlugApi, useContainerRegistryUpdateApi } from "@/api/api-registry";
import type { IContainerRegistry } from "@/api/api-types";
import { registryProviders } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type ContainerRegistryNewEditProps = { data?: IContainerRegistry; isNew?: boolean };

const ContainerRegistryNewEdit = (props: ContainerRegistryNewEditProps = {}) => {
	const [{ registry_slug }] = useRouterQuery();

	// API
	const useSlugApi = useContainerRegistrySlugApi(registry_slug, { populate: "owner" });
	const { data: registry } = useSlugApi;
	const useUpdateApi = useContainerRegistryUpdateApi({ filter: { id: registry?._id } });
	const useCreateApi = useContainerRegistryCreateApi();

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "My Container Registry" },
		{
			type: "select",
			label: "Provider",
			name: "provider",
			style: { width: 250 },
			displayKey: "provider", // the magic is here 😅...
			options: registryProviders.map((provider) => {
				return { label: provider?.name || "", value: provider?.slug };
			}),
		},
		{ type: "input", label: "Host", name: "host", placeholder: "asia.gcr.io" },
		{ type: "input", label: "Docker Image URL Prefix", name: "imageBaseURL", placeholder: "asia.gcr.io/google-project-id" },
		{ type: "input", label: "Image Pull Secret's Name", name: "imagePullSecret.name", placeholder: "my-docker-secret-name" },
		{
			type: "textarea",
			label: "Image Pull Secret's Value",
			name: "imagePullSecret.value",
			placeholder: "my-docker-secret-value",
			disabled: !registry?.imagePullSecret?.value,
			value: "<hidden-secret>",
		},
	];

	return <SmartForm name="registry" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default ContainerRegistryNewEdit;
