import { useRouter } from "next/router";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

/**
 * Dashboard Page
 */
const Index = () => {
	const router = useRouter();

	return (
		<Main meta={<Meta title="Dashboard" description="Your workspace overview." />}>
			{/* Page Content */}
			<Dashboard />
		</Main>
	);
};

export default Index;
