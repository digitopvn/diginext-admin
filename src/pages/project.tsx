import { ProjectList } from "@/components/projects/ProjectList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Project = () => (
	<Main meta={<Meta title="Projects" description="Manage builds & deployments of your projects / apps " />}>
		{/* Page Content */}
		<ProjectList />
	</Main>
);

export default Project;
