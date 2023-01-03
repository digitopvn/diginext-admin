import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { ContainerRegistryList } from "@/components/registries/ContainerRegistryList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const ContainerRegistryListPage = () => {
	const router = useRouter();

	return (
		<AuthPage>
			<Main meta={<Meta title="Container Registries" description="List of your container registries." />}>
				{/* Page Content */}
				<ContainerRegistryList />
			</Main>
		</AuthPage>
	);
};

export default ContainerRegistryListPage;
