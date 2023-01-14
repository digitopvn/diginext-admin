import { useClusterSlugApi, useClusterUpdateApi } from "@/api/api-cluster";
import type { ICluster } from "@/api/api-types";
import AutoSendInput from "@/commons/auto-form/AutoSendInput";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const ClusterEdit = (props: { data?: ICluster }) => {
	const { data } = props;

	const [{ cluster_slug }] = useRouterQuery();
	const { data: cluster } = useClusterSlugApi({ filter: { slug: cluster_slug } });
	const [updateApi, status] = useClusterUpdateApi({ id: cluster?._id });

	console.log("cluster :>> ", cluster);

	return (
		<div>
			<AutoSendInput label="Cluster name" name="name" value={cluster?.name} updateApi={updateApi} status={status} />
			{/* <AutoSendInput label="Primary IP" name="name" updateApi={updateApi} status={status} />
			<AutoSendInput label="Primary domain" name="name" updateApi={updateApi} status={status} />
			<AutoSendInput label="Provider" name="name" updateApi={updateApi} status={status} /> */}
		</div>
	);
};

export default ClusterEdit;
