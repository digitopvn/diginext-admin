import { useResponsive } from "ahooks";
import { Button, Card, Col, Row } from "antd";
import { useState } from "react";

import { useAppDeployEnvironmentSlugApi, useAppDeployEnvironmentUpdateApi } from "@/api/api-app";
import { useClusterListApi } from "@/api/api-cluster";
import { useContainerRegistryListApi } from "@/api/api-registry";
import { availableResourceSizes, sslIssuers } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const DeployEnvironment = () => {
	const [{ project: projectSlug, app: appSlug, env }, { setQuery }] = useRouterQuery();
	const responsive = useResponsive();

	const [sslIssuer, setSSLIssuer] = useState("");
	// console.log("sslIssuer :>> ", sslIssuer);
	const { closeDrawer } = useDrawerProvider();

	// clusters
	const { data } = useClusterListApi({ populate: "owner", pagination: { page: 0, size: 100 } });
	const { list: clusters = [], pagination } = data || {};

	// rergistries
	const { data: registryRes } = useContainerRegistryListApi({ populate: "owner", pagination: { page: 0, size: 100 } });
	const { list: registries = [] } = registryRes || {};

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
			wrapperStyle: { float: responsive?.md ? "left" : "none", marginRight: responsive?.md ? 15 : 0 },
		},
		{
			type: "number",
			label: "Replicas",
			name: "replicas",
			placeholder: "1",
			wrapperStyle: { float: responsive?.md ? "left" : "none", marginRight: responsive?.md ? 15 : 0 },
		},
		{ type: "input", label: "PORT", name: "port", placeholder: "3000" },
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
			wrapperStyle: {
				float: responsive?.md ? "left" : "none",
				width: responsive?.md ? "100%" : "50%",
				clear: "both",
				marginRight: responsive?.md ? 15 : 0,
			},
		},
		{
			type: "select",
			label: "Container Registry",
			name: "registry",
			placeholder: "Container Registry",
			displayKey: "registry", // the magic is here 😅...
			options: registries.map((reg) => {
				return { label: reg.name || "", value: reg.slug };
			}),
			// onChange: (value) => setProviderShortName(providers.find((provider) => provider._id === value)?.shortName || ""),
			// wrapperStyle: { float: responsive?.md ? "left" : "none", marginRight: responsive?.md ? 15 : 0 },
		},
		{
			type: "select",
			label: "SSL Issuer",
			name: "ssl",
			placeholder: "letsencrypt",
			displayKey: "ssl",
			options: sslIssuers.map((issuer) => {
				return { label: issuer || "", value: issuer };
			}),
			wrapperStyle: {
				float: responsive?.md ? "left" : "none",
				marginRight: responsive?.md ? 15 : 0,
				width: responsive?.md ? "100%" : "50%",
				clear: "both",
			},
			onChange: (value) => {
				setSSLIssuer(value);
			},
		},
		{
			type: "input",
			label: "TLS Secret",
			name: "tlsSecret",
			placeholder: "",
			disabled: sslIssuer === "letsencrypt",
			wrapperStyle: { width: "100%", clear: "right" },
		},
	];

	return (
		<>
			{/* SCREENSHOT */}
			<div className=" hidden h-80 w-full p-6" style={{ display: useSlugApi.data?.screenshot ? "block" : "none" }}>
				<Card hoverable className="relative h-full overflow-hidden" bodyStyle={{ height: "100%", padding: 0 }}>
					<div
						className="h-full"
						style={{
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundImage: useSlugApi.data?.screenshot
								? `url(${useSlugApi.data?.screenshot})`
								: "url(data:image/png;base64,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",
						}}
					/>
					{/* <Meta title="Release #01" description="08:00 AM, June 17, 2023" /> */}
				</Card>
			</div>
			{/* FORM */}
			<SmartForm name="deploy_environment" api={{ useSlugApi, useUpdateApi }} configs={smartFormConfigs} className="h-auto">
				<div className="clear-both w-full">
					<Row gutter={[16, 16]} align="stretch">
						<Col span={12}>
							<Button block onClick={() => setQuery({ lv2: "build", project: projectSlug, app: appSlug })}>
								Builds
							</Button>
						</Col>
						<Col span={12}>
							<Button block onClick={() => setQuery({ lv2: "release", project: projectSlug, app: appSlug, env })}>
								Releases
							</Button>
						</Col>
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
						<Col span={12}>
							<Button block onClick={() => setQuery({ lv2: "app_logs", project: projectSlug, app: appSlug, env })}>
								Application Logs
							</Button>
						</Col>
					</Row>
				</div>
			</SmartForm>
		</>
	);
};

export default DeployEnvironment;
