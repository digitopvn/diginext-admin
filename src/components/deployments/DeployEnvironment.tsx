import { Button, Col, Row } from "antd";

import { useAppDeployEnvironmentSlugApi, useAppDeployEnvironmentUpdateApi } from "@/api/api-app";
import { useClusterListApi } from "@/api/api-cluster";
import { availableResourceSizes, sslIssuers } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const DeployEnvironment = () => {
	const [{ project: projectSlug, app: appSlug, env }, { setQuery }] = useRouterQuery();

	const { closeDrawer } = useDrawerProvider();

	// clusters
	const { data } = useClusterListApi({ populate: "owner", pagination: { page: 0, size: 100 } });
	const { list: clusters = [], pagination } = data || {};

	// deployEnvironment
	const useSlugApi = useAppDeployEnvironmentSlugApi(appSlug, { filter: { env } });
	const useUpdateApi = useAppDeployEnvironmentUpdateApi({ filter: { slug: appSlug, env } });

	const smartFormConfigs: SmartFormElementProps[] = [
		// { type: "input", label: "Name", name: "name", placeholder: "Deploy environment name" },

		{
			type: "list_string",
			label: "Domains",
			name: "domains",
		},
		{
			type: "select",
			label: "Container size",
			name: "size",
			placeholder: "Container size",
			displayKey: "size", // the magic is here 😅...
			options: availableResourceSizes.map((size) => {
				return { label: size || "", value: size };
			}),
			wrapperStyle: { float: "left", marginRight: 15 },
		},
		{ type: "number", label: "Replicas", name: "replicas", placeholder: "1" },
		{
			type: "select",
			label: "Cluster",
			name: "cluster",
			placeholder: "Cluster",
			displayKey: "cluster", // the magic is here 😅...
			options: clusters.map((cluster) => {
				return { label: cluster.name || "", value: cluster.shortName };
			}),
			// onChange: (value) => setProviderShortName(providers.find((provider) => provider._id === value)?.shortName || ""),
			wrapperStyle: { float: "left", marginRight: 15 },
		},
		{ type: "input", label: "PORT", name: "port", placeholder: "3000" },
		{
			type: "select",
			label: "SSL Issuer",
			name: "ssl",
			placeholder: "letsencrypt",
			displayKey: "ssl",
			options: sslIssuers.map((issuer) => {
				return { label: issuer || "", value: issuer };
			}),
			wrapperStyle: { float: "left", marginRight: 15 },
		},
		{ type: "input", label: "TLS Secret", name: "tlsSecret", placeholder: "" },
	];

	return (
		<>
			<SmartForm name="deploy_environment" api={{ useSlugApi, useUpdateApi }} configs={smartFormConfigs} className="h-auto">
				<div className="w-full px-6">
					<Row gutter={[16, 16]} align="stretch">
						<Col span={12}>
							<Button block onClick={() => setQuery({ lv2: "env_vars", project: projectSlug, app: appSlug, env })}>
								Environment Variables
							</Button>
						</Col>
						<Col span={12}>
							<Button block onClick={() => setQuery({ lv2: "deployment_yaml", project: projectSlug, app: appSlug, env })}>
								Deployment YAML
							</Button>
						</Col>
					</Row>
				</div>
			</SmartForm>
		</>
	);
};

export default DeployEnvironment;
