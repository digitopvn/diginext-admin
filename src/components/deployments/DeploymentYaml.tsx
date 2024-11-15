import { useAppDeployEnvironmentSlugApi, useAppDeployEnvironmentUpdateApi } from "@/api/api-app";
import { useClusterListApi } from "@/api/api-cluster";
import CopyCode from "@/commons/CopyCode";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const DeploymentYaml = () => {
	const [{ project: projectSlug, app: appSlug, env }, { setQuery }] = useRouterQuery();

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
		<div className="h-full w-full">
			<div className="flex h-full w-full flex-col">
				<SmartForm
					name="deployment_yaml"
					formType="edit"
					api={{ useSlugApi, useUpdateApi }}
					configs={smartFormConfigs}
					className="flex w-full !overflow-x-auto pb-4"
				/>
				<CopyCode className="px-4 pb-8" value={useSlugApi.data?.deploymentYaml || ""} mode="hidden" />
			</div>
		</div>
	);
};

export default DeploymentYaml;
