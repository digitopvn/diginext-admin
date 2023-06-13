import { Tag } from "antd";
import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { useBuildListApi } from "@/api/api-build";
import { PageTitle } from "@/commons/PageTitle";
import { BuildList } from "@/components/deployments/BuildList";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const BuildListPage = () => {
	const router = useRouter();
	const [, { setQuery }] = useRouterQuery();

	const { data: { list = [] } = {}, status } = useBuildListApi({ filter: { status: "building" } });

	return (
		<AuthPage>
			<Main meta={<Meta title="Builds" description="List of builds." />}>
				{/* Page title & desc here */}
				<PageTitle title="Builds" breadcrumbs={[{ name: "Workspace" }]} actions={[<Tag key="status-building">{list.length} building</Tag>]} />

				{/* Page Content */}
				<BuildList />
			</Main>
		</AuthPage>
	);
};

export default BuildListPage;
