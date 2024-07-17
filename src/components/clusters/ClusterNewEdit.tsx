import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";

import { useCloudProviderListApi } from "@/api/api-cloud-provider";
import { useClusterCreateApi, useClusterSlugApi, useClusterUpdateApi } from "@/api/api-cluster";
import type { ICluster } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type ClusterNewEditProps = { data?: ICluster; isNew?: boolean };

const ClusterNewEdit = (props: ClusterNewEditProps = {}) => {
	const [{ cluster_slug }] = useRouterQuery();

	// clusters
	const useSlugApi = useClusterSlugApi(cluster_slug, { populate: "owner,provider" });
	const { data: cluster } = useSlugApi;

	const useUpdateApi = useClusterUpdateApi({ filter: { id: cluster?._id } });
	const useCreateApi = useClusterCreateApi();
	// console.log("cluster :>> ", cluster);

	// providers
	const { data: { list: providers = [] } = {} } = useCloudProviderListApi();
	const [providerShortName, setProviderShortName] = useState("");
	// console.log("providers :>> ", providers);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "Cluster name" },
		{
			type: "input",
			label: (
				<>
					Short name{" "}
					<Tooltip title="Get this from your cloud provider console panel.">
						<InfoCircleOutlined />
					</Tooltip>
				</>
			),
			name: "shortName",
			placeholder: "Short name",
			visible: providerShortName !== "custom",
		},
		{
			type: "select",
			label: "Cloud Provider",
			name: "provider",
			placeholder: "Cloud Provider",
			displayKey: "provider.name", // the magic is here 😅...
			options: providers.map((provider) => {
				return { label: provider.name || "", value: provider._id };
			}),
			onChange: (value) => setProviderShortName(providers.find((provider) => provider._id === value)?.shortName || ""),
		},
		{ type: "input", label: "Primary IP", name: "primaryIP", placeholder: "192.168.10.50" },
		{ type: "input", label: "Primary domain", name: "primaryDomain", placeholder: "example.com" },
		{ type: "input", label: "Project ID (Google)", name: "projectID", placeholder: "my-project-id", visible: providerShortName === "gcloud" },
		{
			type: "input",
			label: "Region (Google)",
			name: "region",
			placeholder: "asia-southeast1",
			visible: providerShortName === "gcloud",
		},
		{ type: "input", label: "Zone (Google)", name: "zone", placeholder: "asia-southeast1-a", visible: providerShortName === "gcloud" },
		{
			type: "code-editor",
			lang: ["json"],
			label: "Service Account (JSON)",
			name: "serviceAccount",
			visible: providerShortName === "gcloud",
			height: "350px",
		},
		{
			type: "code-editor",
			lang: ["yaml"],
			label: "KubeConfig (YAML)",
			name: "kubeConfig",
			visible: providerShortName === "custom",
			height: "350px",
		},
		{ type: "textarea", label: "API Access Token", name: "apiAccessToken", visible: providerShortName === "digitalocean" },
	];

	return <SmartForm name="cluster" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default ClusterNewEdit;
