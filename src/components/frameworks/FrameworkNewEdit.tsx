import { useFrameworkCreateApi, useFrameworkSlugApi, useFrameworkUpdateApi } from "@/api/api-framework";
import type { IFramework } from "@/api/api-types";
import { gitProviders } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type FrameworkNewEditProps = { data?: IFramework; isNew?: boolean };

const FrameworkNewEdit = (props: FrameworkNewEditProps = {}) => {
	const [{ framework_slug }] = useRouterQuery();

	// frameworks
	const useSlugApi = useFrameworkSlugApi(framework_slug, { populate: "owner,git" });
	const { data: framework } = useSlugApi;
	const useUpdateApi = useFrameworkUpdateApi({ filter: { id: framework?._id } });
	const useCreateApi = useFrameworkCreateApi();
	// console.log("framework :>> ", framework);

	// gitProviders
	// const { data: { list: gitProviders = [] } = {} } = useGitProviderListApi();
	// console.log("gitProviders :>> ", gitProviders);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "My Starter Template" },
		{
			type: "select",
			label: "Git Provider",
			name: "gitProvider",
			displayKey: "gitProvider",
			style: { width: 250 },
			options: gitProviders.map((gitProvider) => {
				return { label: gitProvider?.name, value: gitProvider?.slug };
			}),
		},
		{ type: "input", label: "Repository HTTPS URL", name: "repoURL", placeholder: "https://github.com/user/repo.git" },
		{ type: "input", label: "Repository SSH URL", name: "repoSSH", placeholder: "git@github.com:user/repo.git" },
		{ type: "input", label: "Main branch", name: "mainBranch", placeholder: "main" },
	];

	return <SmartForm name="framework" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default FrameworkNewEdit;
