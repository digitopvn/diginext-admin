import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { CloudProviderList } from "@/components/cloud-providers/CloudProviderList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const CloudProviderListPage = () => {
	const router = useRouter();

	return (
		<AuthPage>
			<Main meta={<Meta title="Cloud Provider List" description="List of your cloud providers." />}>
				{/* Page Content */}
				<CloudProviderList />
			</Main>
		</AuthPage>
	);
};

export default CloudProviderListPage;
