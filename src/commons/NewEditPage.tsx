import ClusterNewEdit from "@/components/clusters/ClusterNewEdit";
import FrameworkNewEdit from "@/components/frameworks/FrameworkNewEdit";
import GitProviderNewEdit from "@/components/gits/GitProviderNewEdit";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const NewEditPage = () => {
	const [{ type }] = useRouterQuery();

	let children;
	switch (type) {
		case "cluster":
			children = <ClusterNewEdit />;
			break;

		case "framework":
			children = <FrameworkNewEdit />;
			break;

		case "git-provider":
			children = <GitProviderNewEdit />;
			break;

		default:
			break;
	}

	return <div className="h-full">{children}</div>;
};

export default NewEditPage;
