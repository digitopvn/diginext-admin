import { AuthPage } from "@/api/api-auth";
import { WorkspaceSettings } from "@/components/workspaces/WorkspaceSettings";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const WorkspaceSettingPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Settings" description="Workspace's configuration." />}>
			{/* Page Content */}
			<WorkspaceSettings />
		</Main>
	</AuthPage>
);

export default WorkspaceSettingPage;
