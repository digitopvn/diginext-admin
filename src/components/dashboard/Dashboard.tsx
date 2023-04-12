import { Typography } from "antd";

import { useAuth } from "@/api/api-auth";

export const Dashboard = () => {
	const [user] = useAuth();
	const { activeWorkspace: workspace } = user || {};

	return (
		<div className="px-4 py-6">
			<Typography.Title level={1}>{workspace?.name} Workspace</Typography.Title>
			<h2>(Coming soon)</h2>
		</div>
	);
};
