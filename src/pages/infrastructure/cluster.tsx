import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { ClusterList } from "@/components/clusters/ClusterList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const ClusterListPage = () => {
	const router = useRouter();

	return (
		<AuthPage>
			<Main meta={<Meta title="Clusters" description="List of your cloud providers." />}>
				{/* Page Content */}
				<ClusterList />
			</Main>
		</AuthPage>
	);
};

export default ClusterListPage;
