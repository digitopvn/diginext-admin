import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { ContainerRegistryList } from "@/components/registries/ContainerRegistryList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const ContainerRegistryListPage = () => {
	const router = useRouter();
	const [, { setQuery }] = useRouterQuery();

	return (
		<AuthPage>
			<Main meta={<Meta title="Container Registries" description="List of your container registries." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Container Registries"
					breadcrumbs={[{ name: "Infrastructure" }]}
					actions={[
						<Button
							key="registry-new-btn"
							type="default"
							icon={<PlusOutlined className="align-middle" />}
							onClick={() => setQuery({ lv1: "new", type: "registry" })}
						>
							New
						</Button>,
					]}
				/>

				{/* Page Content */}
				<ContainerRegistryList />
			</Main>
		</AuthPage>
	);
};

export default ContainerRegistryListPage;
