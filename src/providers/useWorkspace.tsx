import { useAuth } from "@/api/api-auth";

const useWorkspace = (props: { name?: string } = {}) => {
	// const subdomain = useSubdomain();
	// const [{ workspace: workspaceInQuery }] = useRouterQuery();
	// const workspaceSlug = subdomain === "app" || subdomain === "localhost" || subdomain === "diginext" ? props.name : workspaceInQuery ?? subdomain;
	// // console.log("workspaceSlug :>> ", workspaceSlug);

	// const { data: workspace } = useWorkspaceSlugApi(workspaceSlug, { staleTime: 8 * 60 * 60 * 1000 });
	const [user] = useAuth();

	return user.activeWorkspace;
};

export { useWorkspace };
