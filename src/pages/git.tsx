import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { GitProviderList } from "@/components/gits/GitProviderList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const GitListPage = () => {
	const [, { setQuery }] = useRouterQuery();
	return (
		<AuthPage>
			<Main meta={<Meta title="Git Providers" description="The collection of GIT Providers for your team." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Git Providers"
					breadcrumbs={[{ name: "Workspace" }]}
					actions={[
						<Button
							key="git-new-btn"
							type="default"
							icon={<PlusOutlined className="align-middle" />}
							onClick={() => setQuery({ lv1: "new", type: "git-provider" })}
						>
							New
						</Button>,
					]}
				/>

				{/* Page Content */}
				<GitProviderList />
			</Main>
		</AuthPage>
	);
};

export default GitListPage;
