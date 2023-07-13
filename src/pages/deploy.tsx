import Link from "next/link";

import { AuthPage } from "@/api/api-auth";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import DeployModal from "@/components/deployments/DeployModal";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const DeployPage = () => {
	return (
		<AuthPage>
			<Main useSidebar={false} meta={<Meta title="Deploy Now" description="Deploy your application to target environment." />}>
				{/* Page Content */}
				<CenterContainer className="max-w-md ">
					<Link href="/">
						<DiginextLogo />
					</Link>

					<DeployModal />
				</CenterContainer>
			</Main>
		</AuthPage>
	);
};

export default DeployPage;
