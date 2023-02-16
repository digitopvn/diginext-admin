import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { FrameworkList } from "@/components/frameworks/FrameworkList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const FrameworkPage = () => {
	const [query, { setQuery }] = useRouterQuery();

	return (
		<AuthPage>
			<Main meta={<Meta title="Frameworks" description="The collection of boilerplate frameworks to start new project." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Frameworks"
					breadcrumbs={[{ name: "Workspace" }]}
					actions={[
						<Button
							key="workspace-setting-btn"
							type="default"
							icon={<PlusOutlined className="align-middle" />}
							onClick={() => setQuery({ lv1: "new", type: "framework" })}
						>
							New
						</Button>,
					]}
				/>

				{/* Page Content */}
				<FrameworkList />
			</Main>
		</AuthPage>
	);
};

export default FrameworkPage;
