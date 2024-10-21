import { useGitProviderCreateApi, useGitProviderSlugApi, useGitProviderUpdateApi } from "@/api/api-git-provider";
import type { IGitProvider } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type GitProviderNewEditProps = { data?: IGitProvider; isNew?: boolean };

const GitProviderNewEdit = (props: GitProviderNewEditProps = {}) => {
	const [{ git_provider_slug }] = useRouterQuery();

	// gitProviders
	const useSlugApi = useGitProviderSlugApi(git_provider_slug, { populate: "owner" });
	const { data: gitProvider } = useSlugApi;
	const useUpdateApi = useGitProviderUpdateApi({ filter: { id: gitProvider?._id } });
	const useCreateApi = useGitProviderCreateApi();
	// console.log("gitProvider :>> ", gitProvider);

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "Github" },
		{ type: "input", label: "Host", name: "host", placeholder: "github.com" },
		{ type: "input", label: "Workspace name", name: "gitWorkspace", placeholder: "my-organization" },
		{ type: "input", label: "Workspace URL", name: "repo.url", placeholder: "https://github.com/my-organization" },
		{ type: "input", label: "Workspace SSH Prefix", name: "repo.sshPrefix", placeholder: "git@github.com:my-organization" },
	];

	return (
		<SmartForm
			name="gitProvider"
			formType={props.isNew ? "new" : "edit"}
			api={{ useSlugApi, useUpdateApi, useCreateApi }}
			configs={smartFormConfigs}
		/>
	);
};

export default GitProviderNewEdit;
