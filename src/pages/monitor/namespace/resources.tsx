import { AuthPage } from "@/api/api-auth";
import { NamespaceResources } from "@/components/monitor/NamespaceResources";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorNamespaceResourcePage = () => (
	<AuthPage>
		<Main meta={<Meta title="Namespace's resources" description="Resources of a namespaces." />}>
			{/* Page Content */}
			<NamespaceResources />
		</Main>
	</AuthPage>
);

export default MonitorNamespaceResourcePage;
