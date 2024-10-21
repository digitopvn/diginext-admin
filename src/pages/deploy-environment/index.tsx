import { AuthPage } from "@/api/api-auth";
import { DeployEnvironmentList } from "@/components/deployments/DeployEnvironmentList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

// const ProjectList = dynamic(() => import("@/components/projects/ProjectList").then((mod) => mod.ProjectList), { suspense: true });

const DeployEnvironmentPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Deploy Environment" description="Manage deploy environments across clusters" />}>
			<DeployEnvironmentList />
		</Main>
	</AuthPage>
);

export default DeployEnvironmentPage;
