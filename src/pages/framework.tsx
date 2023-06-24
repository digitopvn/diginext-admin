import { AuthPage } from "@/api/api-auth";
import { FrameworkList } from "@/components/frameworks/FrameworkList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const FrameworkPage = () => {
	const [query, { setQuery }] = useRouterQuery();

	return (
		<AuthPage>
			<Main meta={<Meta title="Frameworks" description="The collection of boilerplate frameworks to start new project." />}>
				<FrameworkList />
			</Main>
		</AuthPage>
	);
};

export default FrameworkPage;
