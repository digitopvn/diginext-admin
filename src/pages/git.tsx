import { GithubOutlined, InboxOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Modal } from "antd";
import { useState } from "react";

import { AuthPage } from "@/api/api-auth";
import type { GitProviderType } from "@/api/api-types";
import { PageTitle } from "@/commons/PageTitle";
import GitProviderConnect from "@/components/gits/GitProviderConnect";
import { GitProviderList } from "@/components/gits/GitProviderList";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const GitListPage = () => {
	const [provider, setProvider] = useState<GitProviderType>();
	const [openConnect, setOpenConnect] = useState(false);

	// const handleOk = () => {
	// 	setModalText("The modal will be closed after two seconds");
	// 	setConfirmLoading(true);
	// 	setTimeout(() => {
	// 		setOpenConnect(false);
	// 		setConfirmLoading(false);
	// 	}, 2000);
	// };

	const showConnectModal = (type: GitProviderType) => {
		setProvider(type);
		setOpenConnect(true);
	};

	const hideConnectModal = () => {
		setOpenConnect(false);
	};

	const items: MenuProps["items"] = [
		{
			key: "1",
			icon: <InboxOutlined />,
			onClick: () => showConnectModal("bitbucket"),
			label: <>Bitbucket</>,
		},
		{
			key: "2",
			icon: <GithubOutlined />,
			onClick: () => showConnectModal("github"),
			label: <>Github</>,
		},
	];

	return (
		<AuthPage>
			<Main meta={<Meta title="Git Providers" description="The collection of GIT Providers for your team." />}>
				{/* Page title & desc here */}
				<PageTitle
					title="Git Providers"
					breadcrumbs={[{ name: "Workspace" }]}
					actions={[
						// <Dropdown key="git-connect-btn" menu={{ items }} placement="bottomRight" arrow>
						// 	<Button type="default" icon={<PlusOutlined className="align-middle" />}>
						// 		Connect
						// 	</Button>
						// </Dropdown>,
						<Button
							key={"btn-bitbucket"}
							icon={<InboxOutlined className="align-middle" />}
							type="default"
							onClick={() => showConnectModal("bitbucket")}
						>
							Connect to Bitbucket
						</Button>,
						<Button
							key={"btn-github"}
							icon={<GithubOutlined className="align-middle" />}
							type="default"
							onClick={() => showConnectModal("github")}
						>
							Connect to Github
						</Button>,
					]}
				/>

				{/* Page Content */}
				<GitProviderList />

				{/* Connect Modal */}
				<Modal open={openConnect} onCancel={hideConnectModal} footer={null} destroyOnClose>
					{provider && <GitProviderConnect provider={provider} />}
				</Modal>
			</Main>
		</AuthPage>
	);
};

export default GitListPage;
