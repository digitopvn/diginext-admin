import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { UserProfile } from "@/components/users/UserProfile";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const UserListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Profile" description="Your profile." />}>
			{/* Page title & desc here */}
			<PageTitle title="Profile" breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<UserProfile />
		</Main>
	</AuthPage>
);

export default UserListPage;
