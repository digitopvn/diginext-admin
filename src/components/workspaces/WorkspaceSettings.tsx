import { Card, List, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

import { useApiKeyListApi } from "@/api/api-key";
import CopyCode from "@/commons/CopyCode";
import { useWorkspace } from "@/providers/useWorkspace";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const WorkspaceSettings = () => {
	const workspace = useWorkspace();
	console.log("workspace :>> ", workspace);

	const { data: { list: apiKeys = [] } = { list: [] } } = useApiKeyListApi({ filter: { activeWorkspace: workspace?._id } });
	console.log("apiKeys :>> ", apiKeys);

	return (
		<div className="px-4 py-6">
			<Typography.Title>{workspace?.name}</Typography.Title>
			<h2>API Access Tokens</h2>
			<List
				dataSource={apiKeys}
				renderItem={({ name, email, token: { access_token } = { access_token: "" } }, index) => (
					<Card title={name}>
						{/* <Typography.Text>{email}</Typography.Text> */}
						<div key={`api-key-${access_token}`}>
							API_ACCESS_TOKEN: <CopyCode type="password" mode="inline" value={access_token} />
						</div>
					</Card>
				)}
			/>
		</div>
	);
};
