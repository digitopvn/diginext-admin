import { AuthPage } from "@/api/api-auth";
import { RoleList } from "@/components/workspaces/RoleList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const RoleListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Roles" description="List of roles in the workspace." />}>
			{/* Page Content */}
			<RoleList />
		</Main>
	</AuthPage>
);

export default RoleListPage;
