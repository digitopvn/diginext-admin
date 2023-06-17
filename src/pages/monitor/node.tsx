import { AuthPage } from "@/api/api-auth";
import { NodeList } from "@/components/monitor/NodeList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const UserListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Nodes" description="List of cluster's nodes." />}>
			{/* Page Content */}
			<NodeList />
		</Main>
	</AuthPage>
);

export default UserListPage;
