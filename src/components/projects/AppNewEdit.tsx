import { useState } from "react";

import { useAppSlugApi, useAppUpdateApi } from "@/api/api-app";
import { useGitProviderListApi } from "@/api/api-git-provider";
import type { IGitProvider } from "@/api/api-types";
import { type ICluster } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type AppNewEditProps = { data?: ICluster; isNew?: boolean };

const AppNewEdit = (props: AppNewEditProps = {}) => {
	const [{ app: appSlug }] = useRouterQuery();

	// app
	const useSlugApi = useAppSlugApi(appSlug, { populate: "owner" });
	const { data: app } = useSlugApi;

	const useUpdateApi = useAppUpdateApi({ filter: { id: app?._id } });

	// git providers
	const { data: { list: providers = [] } = {} } = useGitProviderListApi();
	const [gitProvider, setGitProvider] = useState<IGitProvider>();
	// console.log("providers :>> ", providers);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "App name" },
		{
			type: "select",
			label: "Git Provider",
			name: "gitProvider",
			placeholder: "Git Provider",
			displayKey: "gitProvider", // the magic is here 😅...
			options: providers.map((provider) => {
				return { label: provider.name || "", value: provider._id };
			}),
			onChange: (value) => setGitProvider(providers.find((provider) => provider._id === value)),
		},
		{ type: "input", label: "Repo URL", name: "git.repoURL", placeholder: "https://github.com/organization-name/example-repo" },
		{ type: "input", label: "Repo SSH", name: "git.repoSSH", placeholder: "git@github.com:organization-name/example-repo.git" },
	];

	return <SmartForm name="app" api={{ useSlugApi, useUpdateApi }} configs={smartFormConfigs} />;
};

export default AppNewEdit;
