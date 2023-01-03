import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const DatabasePage = () => {
	const router = useRouter();

	return (
		<AuthPage>
			<Main
				meta={
					<Meta
						title="Next.js Boilerplate Presentation"
						description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
					/>
				}
			>
				{/* Page Content */}
				<h2>Database</h2>
			</Main>
		</AuthPage>
	);
};

export default DatabasePage;
