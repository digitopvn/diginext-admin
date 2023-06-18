import { AuthPage } from "@/api/api-auth";
import { DeploymentList } from "@/components/monitor/DeploymentList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorDeploymentPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Deployments" description="List of deployments." />}>
			{/* Page Content */}
			<DeploymentList />
		</Main>
	</AuthPage>
);

export default MonitorDeploymentPage;
