import { AuthPage } from "@/api/api-auth";
import { ServiceList } from "@/components/monitor/ServiceList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorServicePage = () => (
	<AuthPage>
		<Main meta={<Meta title="Services" description="List of services." />}>
			{/* Page Content */}
			<ServiceList />
		</Main>
	</AuthPage>
);

export default MonitorServicePage;
