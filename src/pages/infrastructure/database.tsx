import { AuthPage } from "@/api/api-auth";
import { DatabaseList } from "@/components/databases/DatabaseList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Next.js Page
 */
const DatabaseListPage = () => {
	// const test = true;
	// if (test)
	// 	return (
	// 		<AuthPage>
	// 			<>Halo!</>
	// 		</AuthPage>
	// 	);

	return (
		<AuthPage>
			<Main meta={<Meta title="Databases" description="List of cloud databases." />}>
				<DatabaseList />
			</Main>
		</AuthPage>
	);
};

export default DatabaseListPage;
