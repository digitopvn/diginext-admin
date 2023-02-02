import { useWorkspaceSlugApi } from "@/api/api-workspace";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import useSubdomain from "@/plugins/useSubdomain";

const useWorkspace = (props: { name?: string } = {}) => {
	const subdomain = useSubdomain();
	const [{ workspace: workspaceInQuery }] = useRouterQuery();
	const workspaceSlug = subdomain === "app" || subdomain === "localhost" || subdomain === "diginext" ? props.name : workspaceInQuery ?? subdomain;
	// console.log("workspaceSlug :>> ", workspaceSlug);
	const { data: workspace } = useWorkspaceSlugApi({ filter: { slug: workspaceSlug } });

	return workspace;
};

export { useWorkspace };
