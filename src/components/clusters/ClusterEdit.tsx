import { useClusterUpdateApi } from "@/api/api-cluster";
import AutoSendInput from "@/commons/AutoSendInput";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const ClusterEdit = () => {
	const [{ slug }] = useRouterQuery();
	const [updateApi, status] = useClusterUpdateApi({ slug });

	return (
		<div>
			<AutoSendInput label="Cluster name" name="name" updateApi={updateApi} status={status} />
		</div>
	);
};

export default ClusterEdit;
