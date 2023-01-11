import { useRouter } from "next/router";

import { PageTitle } from "@/commons/PageTitle";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const BuildDetailPage = () => {
	const router = useRouter();
	if (!router.isReady) return <></>;

	console.log("router.asPath :>> ", router.asPath);
	const { slugs = [] } = router.query;
	const [buildSlug = ""] = slugs as string[];
	console.log("buildSlug :>> ", buildSlug);

	return (
		<Main meta={<Meta title="Build Detail" description="View the details of your build logs." />}>
			{/* Page title & desc here */}
			<PageTitle title="Build Detail" breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<div className="p-5">
				<BuildLogs slug={buildSlug} />
			</div>
		</Main>
	);
};

export default BuildDetailPage;
