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
	// console.log("providers :>> ", providers);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "Cluster name" },
		{ type: "input", label: "Short name", name: "shortName", placeholder: "Short name" },
		{
			type: "select",
			label: "Cloud Provider",
			name: "provider",
			placeholder: "Cloud Provider",
			options: providers.map((provider) => {
				return { label: provider.name || "", value: provider._id };
			}),
		},
		{ type: "input", label: "Primary IP", name: "primaryIP", placeholder: "192.168.10.50" },
		{ type: "input", label: "Primary domain", name: "primaryDomain", placeholder: "example.com" },
		{ type: "input", label: "Project ID (Google)", name: "projectID", placeholder: "my-project-id" },
		{ type: "input", label: "Region (Google)", name: "region", placeholder: "asia-southeast1" },
		{ type: "input", label: "Zone (Google)", name: "zone", placeholder: "asia-southeast1-a" },
		{ type: "code-editor", label: "KubeConfig (YAML)", name: "kubeConfig" },
		{ type: "textarea", label: "API Access Token", name: "apiAccessToken" },
		{ type: "code-editor", label: "Service Account (JSON)", name: "serviceAccount" },
	];

	return <SmartForm name="cluster" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default ClusterNewEdit;
