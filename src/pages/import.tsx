import Link from "next/link";

import { AuthPage } from "@/api/api-auth";
import CenterContainer from "@/commons/CenterContainer";
import DiginextLogo from "@/commons/DiginextLogo";
import ImportGitModal from "@/components/projects/ImportGitModal";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const ImportPage = () => {
	return (
		<AuthPage>
			<Main useSidebar={false} meta={<Meta title="Import to Diginext" description="Import a git repo to Diginext platform." />}>
				{/* Page Content */}
				<CenterContainer className="max-w-md ">
					<Link href="/">
						<DiginextLogo />
					</Link>

					<ImportGitModal />
				</CenterContainer>
			</Main>
		</AuthPage>
	);
};

export default ImportPage;
