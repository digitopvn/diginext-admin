import { AuthPage } from "@/api/api-auth";
import { CronjobList } from "@/components/cronjobs/CronjobList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Next.js Page
 */
const CronjobListPage = () => {
	// const test = true;
	// if (test)
	// 	return (
	// 		<AuthPage>
	// 			<>Halo!</>
	// 		</AuthPage>
	// 	);

	return (
		<AuthPage>
			<Main meta={<Meta title="Cronjobs" description="List of cronjobs." />}>
				<CronjobList />
			</Main>
		</AuthPage>
	);
};

export default CronjobListPage;
