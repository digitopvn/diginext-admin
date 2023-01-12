import ClusterEdit from "@/components/clusters/ClusterEdit";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const EditPage = () => {
	const [{ type }] = useRouterQuery();

	let children;
	switch (type) {
		case "cluster":
			children = <ClusterEdit />;
			break;

		default:
			break;
	}

	return <div>{children}</div>;
};

export default EditPage;
