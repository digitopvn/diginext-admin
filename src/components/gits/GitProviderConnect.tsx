import type { GitProviderType } from "@/api/api-types";

import { BitbucketConnectModal } from "./BitbucketConnectModal";
import { GithubConnectModal } from "./GithubConnectModal";

type GitProviderNewEditProps = { provider: GitProviderType };

const GitProviderConnect = (props: GitProviderNewEditProps) => {
	const { provider } = props;
	return provider === "bitbucket" ? <BitbucketConnectModal /> : <GithubConnectModal />;
};

export default GitProviderConnect;
