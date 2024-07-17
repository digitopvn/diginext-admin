import ClusterNewEdit from "@/components/clusters/ClusterNewEdit";
import DatabaseNewEdit from "@/components/databases/DatabaseNewEdit";
import FrameworkNewEdit from "@/components/frameworks/FrameworkNewEdit";
import GitProviderNewEdit from "@/components/gits/GitProviderNewEdit";
import AppNewEdit from "@/components/projects/AppNewEdit";
import ContainerRegistryNewEdit from "@/components/registries/ContainerRegistryNewEdit";
import CloudStorageNewEdit from "@/components/storages/CloudStorageNewEdit";
import RoleNewEdit from "@/components/workspaces/RoleNewEdit";
import UserNewEdit from "@/components/workspaces/UserNewEdit";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const NewEditPage = () => {
	const [{ type }] = useRouterQuery();

	let children;
	switch (type) {
		case "app":
			children = <AppNewEdit />;
			break;

		case "cluster":
			children = <ClusterNewEdit />;
			break;

		case "framework":
			children = <FrameworkNewEdit />;
			break;

		case "git-provider":
			children = <GitProviderNewEdit />;
			break;

		case "registry":
			children = <ContainerRegistryNewEdit />;
			break;

		case "storage":
			children = <CloudStorageNewEdit />;
			break;

		case "database":
			children = <DatabaseNewEdit />;
			break;

		case "user":
			children = <UserNewEdit />;
			break;

		case "role":
			children = <RoleNewEdit />;
			break;

		default:
			break;
	}

	return <div className="h-full">{children}</div>;
};

export default NewEditPage;
