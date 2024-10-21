import { useEffect, useState } from "react";

import { useCloudStorageCreateApi, useCloudStorageSlugApi, useCloudStorageUpdateApi } from "@/api/api-storage";
import type { ICloudStorage } from "@/api/api-types";
import { storageProviders } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type ContainerRegistryNewEditProps = { data?: ICloudStorage; isNew?: boolean };

const CloudStorageNewEdit = (props: ContainerRegistryNewEditProps = {}) => {
	const [{ lv1, registry_slug }] = useRouterQuery();

	// API
	const useSlugApi = useCloudStorageSlugApi(registry_slug, { populate: "owner" });
	const { data: registry } = useSlugApi;
	const useUpdateApi = useCloudStorageUpdateApi({ filter: { id: registry?._id } });
	const useCreateApi = useCloudStorageCreateApi();

	const [providerShortName, setProviderShortName] = useState<string>();
	// console.log("providerShortName :>> ", providerShortName);

	useEffect(() => {
		if (registry?.provider) setProviderShortName(registry.provider);
	}, [registry?.provider]);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "My Cloud Storage Name", required: true },
		{
			type: "select",
			label: "Cloud Storage Provider",
			name: "provider",
			displayKey: "name", // the magic is here 😅...
			visible: lv1 === "new",
			options: storageProviders.map((provider) => {
				return { label: provider?.name || "", value: provider?.slug };
			}),
			onChange: (value) => setProviderShortName(storageProviders.find((provider) => provider?.slug === value)?.slug || undefined),
		},
		{ type: "input", label: "Bucket", name: "bucket", placeholder: "Bucket name", required: true },
		{
			type: "input",
			label: "Host (domain)",
			name: "host",
			placeholder: "example.com",
			required: true,
		},
		{ type: "input", label: "Region", name: "region", placeholder: "us-west-2" },

		// Google Cloud Storage
		{
			type: "code-editor",
			lang: ["yaml", "json"],
			label: "Google Service Account (JSON)",
			name: "auth.service_account",
			visible: providerShortName === "gcloud",
			required: providerShortName === "gcloud",
		},

		// Digital Ocean Space Storage & Amazon S3 Storage
		{
			type: "input",
			label: "Key ID",
			name: "auth.key_id",
			required: providerShortName === "do_space" || providerShortName === "aws_s3",
			visible: providerShortName === "do_space" || providerShortName === "aws_s3",
		},
		{
			type: "password",
			label: "Key Secret",
			name: "auth.key_secret",
			required: providerShortName === "do_space" || providerShortName === "aws_s3",
			visible: providerShortName === "do_space" || providerShortName === "aws_s3",
		},
	];

	return (
		<SmartForm
			name="registry"
			formType={props.isNew ? "new" : "edit"}
			api={{ useSlugApi, useUpdateApi, useCreateApi }}
			configs={smartFormConfigs}
		/>
	);
};

export default CloudStorageNewEdit;
