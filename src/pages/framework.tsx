import { AuthPage } from "@/api/api-auth";
import { FrameworkList } from "@/components/frameworks/FrameworkList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const FrameworkPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Frameworks" description="The collection of boilerplate frameworks to start new project." />}>
			{/* Page Content */}
			<FrameworkList />
		</Main>
	</AuthPage>
);

export default FrameworkPage;
