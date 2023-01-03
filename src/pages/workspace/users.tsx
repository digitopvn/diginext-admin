import { AuthPage } from "@/api/api-auth";
import { UserList } from "@/components/workspaces/UserList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const UserListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Users" description="List of users in the workspace." />}>
			{/* Page Content */}
			<UserList />
		</Main>
	</AuthPage>
);

export default UserListPage;
