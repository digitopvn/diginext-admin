import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { ClusterList } from "@/components/clusters/ClusterList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const ClusterListPage = () => {
	const router = useRouter();

	const [query, { setQuery }] = useRouterQuery();
	return (
		<AuthPage>
			<Main meta={<Meta title="Clusters" description="List of your cloud providers." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Kubernetes Clusters"
					breadcrumbs={[{ name: "Infrastructure" }]}
					actions={[
						<Button
							key="workspace-setting-btn"
							type="default"
							icon={<PlusOutlined className="align-middle" />}
							onClick={() => setQuery({ lv1: "new", type: "cluster" })}
						>
							New
						</Button>,
					]}
				/>

				{/* Page Content */}
				<ClusterList />
			</Main>
		</AuthPage>
	);
};

export default ClusterListPage;
