import { App, Space, Switch, Typography } from "antd";
import { useState } from "react";

import { useWorkspaceUpdateApi } from "@/api/api-workspace";
import { useWorkspace } from "@/providers/useWorkspace";

const WorkspacePrivacySwitch = () => {
	const root = App.useApp();
	const workspace = useWorkspace();
	// console.log("workspace :>> ", workspace);

	const [isPublic, setIsPublic] = useState(workspace?.public);

	const [updateWorkspaceApi, apiStatus] = useWorkspaceUpdateApi({ filter: { _id: workspace?._id } });

	const onPrivacyChange = async (checked: boolean) => {
		const res = await updateWorkspaceApi({ public: checked });
		if (res?.status) {
			setIsPublic(checked);
			root.notification.success({
				message: `Congrats!`,
				description: `Made "${workspace?.name}" workspace ${checked ? "PUBLIC" : "PRIVATE"} successfully.`,
			});
		}
	};

	return (
		<Space direction="horizontal" size={6}>
			<Typography.Title level={5} style={{ marginBottom: 0 }}>
				Public
			</Typography.Title>
			<Switch checked={isPublic} onChange={onPrivacyChange} loading={apiStatus === "loading"} />
		</Space>
	);
};

export default WorkspacePrivacySwitch;
