import React from "react";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import { AppList } from "@/components/projects/AppList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const AppListPage = () => {
	return (
		<AuthPage>
			<Main meta={<Meta title="Projects" description="Manage builds & deployments of your projects / apps " />}>
				{/* Page title & desc here */}
				<PageTitle title="Projects" breadcrumbs={[{ name: "Workspace" }]} />

				{/* Page Content */}
				<AppList />
			</Main>
		</AuthPage>
	);
};

export default AppListPage;
