import { Editor } from "@monaco-editor/react";
import { useDarkMode } from "usehooks-ts";

import { useAppDeployEnvironmentSlugApi, useAppDeployEnvironmentUpdateApi } from "@/api/api-app";
import { useClusterListApi } from "@/api/api-cluster";
import CopyCode from "@/commons/CopyCode";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const DeploymentYaml = () => {
	const [{ project: projectSlug, app: appSlug, env }, { setQuery }] = useRouterQuery();
	const { isDarkMode } = useDarkMode();
	const { closeDrawer } = useDrawerProvider();

	// clusters
	const { data } = useClusterListApi({ populate: "owner", pagination: { page: 0, size: 100 } });
	const { list: clusters = [], pagination } = data || {};

	// deployEnvironment
	const useSlugApi = useAppDeployEnvironmentSlugApi(appSlug, { filter: { env } });
	const useUpdateApi = useAppDeployEnvironmentUpdateApi({ filter: { slug: appSlug, env } });

	const smartFormConfigs: SmartFormElementProps[] = [
		{
			type: "code-editor",
			name: "deploymentYaml",
			// label: "Deployment YAML",
			lang: ["yaml"],
			disabled: true,
			wrapperStyle: { display: "flex", width: "100%" },
		},
	];

	return (
		<div className="size-full">
			<div className="flex size-full flex-col">
				<Editor
					theme={isDarkMode ? "vs-dark" : "vs-light"}
					height="100%"
					defaultLanguage="yaml"
					value={useSlugApi.data?.deploymentYaml || ""}
					options={{ minimap: { enabled: false }, scrollBeyondLastLine: false }}
				/>
				<CopyCode className="px-4 pb-8" value={useSlugApi.data?.deploymentYaml || ""} mode="hidden" />
			</div>
		</div>
	);
};

export default DeploymentYaml;
