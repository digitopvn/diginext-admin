import ClusterNewEdit from "@/components/clusters/ClusterNewEdit";
import FrameworkNewEdit from "@/components/frameworks/FrameworkNewEdit";
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

		default:
			break;
	}

	return <div className="h-full">{children}</div>;
};

export default NewEditPage;
