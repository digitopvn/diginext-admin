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

const NewEditPage = (props: { formType: "new" | "edit" } = { formType: "new" }) => {
	const [{ type }] = useRouterQuery();

	let children;
	switch (type) {
		case "app":
			children = <AppNewEdit isNew={props.formType === "new"} />;
			break;

		case "cluster":
			children = <ClusterNewEdit isNew={props.formType === "new"} />;
			break;

		case "framework":
			children = <FrameworkNewEdit isNew={props.formType === "new"} />;
			break;

		case "git-provider":
			children = <GitProviderNewEdit isNew={props.formType === "new"} />;
			break;

		case "registry":
			children = <ContainerRegistryNewEdit isNew={props.formType === "new"} />;
			break;

		case "storage":
			children = <CloudStorageNewEdit isNew={props.formType === "new"} />;
			break;

		case "database":
			children = <DatabaseNewEdit isNew={props.formType === "new"} />;
			break;

		case "user":
			children = <UserNewEdit isNew={props.formType === "new"} />;
			break;

		case "role":
			children = <RoleNewEdit isNew={props.formType === "new"} />;
			break;

		default:
			break;
	}

	return <div className="h-full">{children}</div>;
};

export default NewEditPage;
