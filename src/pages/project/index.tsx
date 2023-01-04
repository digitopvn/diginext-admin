import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { ProjectList } from "@/components/projects/ProjectList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Project = () => (
	<AuthPage>
		<Main meta={<Meta title="Projects" description="Manage builds & deployments of your projects / apps " />}>
			{/* Page title & desc here */}
			<PageTitle title="Projects" breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<ProjectList />
		</Main>
	</AuthPage>
);

export default Project;
