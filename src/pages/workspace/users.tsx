import { UserList } from "@/components/users/UserList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const FrameworkPage = () => (
	<Main meta={<Meta title="Frameworks" description="The collection of boilerplate frameworks to start new project." />}>
		{/* Page Content */}
		<UserList />
	</Main>
);

export default FrameworkPage;
