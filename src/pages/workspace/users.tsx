import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import InviteMemberButton from "@/components/workspaces/InviteMemberButton";
import { UserList } from "@/components/workspaces/UserList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const UserListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Users" description="List of users in the workspace." />}>
			{/* Page title & desc here */}
			<PageTitle title="Users" breadcrumbs={[{ name: "Workspace" }]} actions={[<InviteMemberButton key={`invite-member-btn`} />]} />

			{/* Page Content */}
			<UserList />
		</Main>
	</AuthPage>
);

export default UserListPage;
