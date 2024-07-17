import { AuthPage } from "@/api/api-auth";
import { AppList } from "@/components/projects/AppList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

// const ProjectList = dynamic(() => import("@/components/projects/ProjectList").then((mod) => mod.ProjectList), { suspense: true });

const AppListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Apps" description="Manage builds & deployments of your projects / apps " />}>
			{/* Page Content */}
			<AppList />
		</Main>
	</AuthPage>
);

export default AppListPage;
