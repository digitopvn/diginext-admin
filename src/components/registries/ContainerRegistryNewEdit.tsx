import { useEffect, useState } from "react";

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

	const [providerShortName, setProviderShortName] = useState<string>();
	console.log("providerShortName :>> ", providerShortName);

	useEffect(() => {
		if (registry?.provider) setProviderShortName(registry.provider);
	}, [registry?.provider]);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "My Container Registry", required: true },
		{
			type: "select",
			label: "Cloud Provider",
			name: "provider",
			displayKey: "name", // the magic is here 😅...
			// value: providerShortName,
			options: registryProviders.map((provider) => {
				return { label: provider?.name || "", value: provider?.slug };
			}),
			onChange: (value) => setProviderShortName(registryProviders.find((provider) => provider?.slug === value)?.slug || undefined),
		},

		// {
		// 	type: "input",
		// 	label: "Docker Image URL Prefix",
		// 	name: "imageBaseURL",
		// 	placeholder:
		// 		// eslint-disable-next-line no-nested-ternary
		// 		providerShortName === "dockerhub"
		// 			? "docker.io/organization-name"
		// 			: providerShortName === "digitalocean"
		// 			? "registry.digitalocean.com/organization-name"
		// 			: "gcr.io/google-project-id",
		// },

		// Google Container Registry
		{
			type: "code-editor",
			lang: ["yaml", "json"],
			label: "Google Service Account (JSON)",
			name: "serviceAccount",
			visible: providerShortName === "gcloud",
			required: providerShortName === "gcloud",
		},
		{
			type: "input",
			label: "Registry Host",
			name: "host",
			visible: providerShortName === "gcloud",
			placeholder:
				// eslint-disable-next-line no-nested-ternary
				providerShortName === "gcloud" ? "gcr.io" : "",
		},

		// Digital Ocean Registry
		{
			type: "password",
			label: "DigitalOcean API access token",
			name: "apiAccessToken",
			visible: providerShortName === "digitalocean",
			required: providerShortName === "digitalocean",
		},

		// Docker Hub Registry
		{
			type: "input",
			label: "Docker username",
			name: "dockerUsername",
			required: providerShortName === "dockerhub",
			visible: providerShortName === "dockerhub",
		},
		{
			type: "password",
			label: "Docker password",
			name: "dockerPassword",
			required: providerShortName === "dockerhub",
			visible: providerShortName === "dockerhub",
		},
		{
			type: "input",
			label: "Organization",
			name: "organization",
			visible: providerShortName === "dockerhub",
		},

		// { type: "input", label: "Image Pull Secret's Name", name: "imagePullSecret.name", placeholder: "my-docker-secret-name" },
		// {
		// 	type: "textarea",
		// 	label: "Image Pull Secret's Value",
		// 	name: "imagePullSecret.value",
		// 	placeholder: "my-docker-secret-value",
		// 	disabled: !registry?.imagePullSecret?.value,
		// 	value: "<hidden-secret>",
		// },
	];

	return <SmartForm name="registry" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default ContainerRegistryNewEdit;
