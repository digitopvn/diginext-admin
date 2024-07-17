import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { CloudStorageList } from "@/components/storages/CloudStorageList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const CloudStorageListPage = () => {
	const router = useRouter();
	const [, { setQuery }] = useRouterQuery();

	return (
		<AuthPage>
			<Main meta={<Meta title="Cloud Storages" description="List of your cloud storages." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Cloud Storages"
					breadcrumbs={[{ name: "Infrastructure" }]}
					actions={[
						<Button
							key="storage-new-btn"
							type="default"
							icon={<PlusOutlined className="align-middle" />}
							onClick={() => setQuery({ lv1: "new", type: "storage" })}
						>
							New
						</Button>,
					]}
				/>

				{/* Page Content */}
				<CloudStorageList />
			</Main>
		</AuthPage>
	);
};

export default CloudStorageListPage;
