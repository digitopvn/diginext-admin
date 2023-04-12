import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
import DestroyWorkspaceButton from "@/components/workspaces/DestroyButton";
import { WorkspaceSettings } from "@/components/workspaces/WorkspaceSettings";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const WorkspaceSettingPage = () => {
	return (
		<AuthPage>
			<Main meta={<Meta title="Settings" description="Workspace's configuration." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Workspace Settings"
					breadcrumbs={[{ name: "Workspace" }]}
					actions={[<DestroyWorkspaceButton key={`destroy-workspace-button`} />]}
				/>

				{/* Page Content */}
				<WorkspaceSettings />
			</Main>
		</AuthPage>
	);
};

export default WorkspaceSettingPage;
