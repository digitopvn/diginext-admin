import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { TeamList } from "@/components/workspaces/TeamList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const UserListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Teams" description="List of teams in the workspace." />}>
			{/* Page title & desc here */}
			<PageTitle title="Teams" breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<TeamList />
		</Main>
	</AuthPage>
);

export default UserListPage;
