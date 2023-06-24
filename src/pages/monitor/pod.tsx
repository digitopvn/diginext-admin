import { AuthPage } from "@/api/api-auth";
import { PodList } from "@/components/monitor/PodList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const MonitorPodPage = () => (
	<AuthPage>
		<Main meta={<Meta title="Pods" description="List of pods." />}>
			{/* Page Content */}
			<PodList />
		</Main>
	</AuthPage>
);

export default MonitorPodPage;
