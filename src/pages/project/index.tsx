import { AuthPage } from "@/api/api-auth";
import { ProjectList } from "@/components/projects/ProjectList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

// const ProjectList = dynamic(() => import("@/components/projects/ProjectList").then((mod) => mod.ProjectList), { suspense: true });

const Project = () => (
	<AuthPage>
		<Main meta={<Meta title="Projects" description="Manage builds & deployments of your projects / apps " />}>
			<ProjectList />
		</Main>
	</AuthPage>
);

export default Project;
