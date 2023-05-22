import { Card, Divider, List, Typography } from "antd";
import dayjs from "dayjs";

import { useGitPublicKeyApi } from "@/api/api-git-provider";
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

	const { data: { list: apiKeys = [] } = { list: [] } } = useApiKeyListApi();
	// console.log("apiKeys :>> ", apiKeys);

	const { data: publicKeyRes } = useGitPublicKeyApi();

	return (
		<div className="px-4 py-6">
			<Typography.Title>{workspace?.name} Workspace</Typography.Title>

			{/* API ACCESS TOKEN */}
			{apiKeys.length > 0 && (
				<List
					// grid={{ gutter: 16, column: 2, sm: 1 }}
					dataSource={apiKeys}
					renderItem={({ name, email, token: { access_token } = { access_token: "" } }, index) => (
						<Card title={name}>
							<div key={`api-key-${access_token}`}>
								<CopyCode type="password" mode="inline" value={access_token} />
							</div>
						</Card>
					)}
				/>
			)}

			<Divider dashed />

			<Card title="DX_KEY">
				<div key={`dx-key`}>
					<CopyCode mode="inline" value={workspace?.dx_key || ""} />
				</div>
			</Card>

			<Divider dashed />

			{/* PUBLIC KEY */}
			<Card title="PUBLIC KEY">
				<div key={`ssh-public-key`}>
					<CopyCode mode="inline" value={publicKeyRes?.data.publicKey || ""} />
				</div>
			</Card>
		</div>
	);
};
