import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { RoleList } from "@/components/workspaces/RoleList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const RoleListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Roles" description="List of roles in the workspace." />}>
			{/* Page title & desc here */}
			<PageTitle title="Roles" breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<RoleList />
		</Main>
	</AuthPage>
);

export default RoleListPage;
