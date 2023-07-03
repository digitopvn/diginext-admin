import { AuthPage } from "@/api/api-auth";
import { NamespaceList } from "@/components/monitor/NamespaceList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorNamespacePage = () => (
	<AuthPage>
		<Main meta={<Meta title="Namespaces" description="List of namespaces." />}>
			{/* Page Content */}
			<NamespaceList />
		</Main>
	</AuthPage>
);

export default MonitorNamespacePage;
