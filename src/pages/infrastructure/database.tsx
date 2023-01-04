import { useRouter } from "next/router";

import { AuthPage } from "@/api/api-auth";
import { PageTitle } from "@/commons/PageTitle";
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
				{/* Page title & desc here */}
				<PageTitle title="Databases" breadcrumbs={[{ name: "Infrastructure" }]} />

				{/* Page Content */}
				<div className="px-4 py-6">
					<h2>(Coming soon)</h2>
				</div>
			</Main>
		</AuthPage>
	);
};

export default DatabasePage;
