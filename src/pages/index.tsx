import { useRouter } from "next/router";

import { ProjectList } from "@/components/projects/ProjectList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Index = () => {
	const router = useRouter();

	return (
		<Main
			meta={
				<Meta
					title="Next.js Boilerplate Presentation"
					description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
				/>
			}
		>
			{/* Page Content */}
			<ProjectList />
		</Main>
	);
};

export default Index;
