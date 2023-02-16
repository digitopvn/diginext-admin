import { useRouter } from "next/router";

import { PageTitle } from "@/commons/PageTitle";
import { BuildLogs } from "@/components/deployments/BuildLogs";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const BuildDetailPage = () => {
	const router = useRouter();

	// console.log("router.asPath :>> ", router.asPath);
	// const { slugs = [] } = router.query;
	// const [buildSlug = ""] = slugs as string[];

	const [{ build_slug }] = useRouterQuery();
	// console.log("build_slug :>> ", build_slug);

	if (!router.isReady || !build_slug) return <></>;

	return (
		<Main meta={<Meta title="Build Detail" description="View the details of your build logs." />}>
			{/* Page title & desc here */}
			<PageTitle title={`Build Logs: ${build_slug}`} breadcrumbs={[{ name: "Workspace" }]} />

			{/* Page Content */}
			<div className="p-5">
				<BuildLogs />
			</div>
		</Main>
	);
};

export default BuildDetailPage;
