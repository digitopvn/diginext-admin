import { AuthPage } from "@/api/api-auth";
import { IngressList } from "@/components/monitor/IngressList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorIngressPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Ingresses" description="List of ingresses." />}>
			{/* Page Content */}
			<IngressList />
		</Main>
	</AuthPage>
);

export default MonitorIngressPage;
