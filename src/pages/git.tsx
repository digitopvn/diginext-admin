import { AuthPage } from "@/api/api-auth";
import { GitProviderList } from "@/components/gits/GitProviderList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const GitListPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Git Providers" description="The collection of boilerplate frameworks to start new project." />}>
			{/* Page Content */}
			<GitProviderList />
		</Main>
	</AuthPage>
);

export default GitListPage;
