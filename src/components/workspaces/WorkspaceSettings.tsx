import { Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

import CopyCode from "@/commons/CopyCode";
import { useWorkspace } from "@/providers/useWorkspace";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const WorkspaceSettings = () => {
	const workspace = useWorkspace();
	console.log("workspace :>> ", workspace);
	return (
		<div className="px-4 py-6">
			<Typography.Title>{workspace?.name}</Typography.Title>
			<div>
				<Typography.Text>API Access Token</Typography.Text>
				{workspace?.apiAccessTokens?.map((apiKey) => (
					<div key={`api-key-${apiKey.slug}`}>
						<CopyCode mode="inline" value={apiKey.token} />
					</div>
				))}
			</div>
		</div>
	);
};
