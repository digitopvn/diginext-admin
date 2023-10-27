import { BankOutlined, CheckCircleOutlined, LoadingOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Card, Divider, notification, Select, Steps, Typography } from "antd";
import { isArray, isEmpty } from "lodash";
import { useState } from "react";

import { useGitOrgListApi, useGitProviderUpdateApi } from "@/api/api-git-provider";

import BitbucketAppPasswordForm from "./BitbucketAppPasswordForm";

export const BitbucketConnectModal = () => {
	const [current, setCurrent] = useState(0);
	const [gitProviderSlug, setGitProviderSlug] = useState<string>();

	const orgs = useGitOrgListApi({
		filter: { slug: gitProviderSlug },
		enabled: typeof gitProviderSlug !== "undefined",
	});
	// console.log("orgs.data :>> ", orgs.data);

	const [updateApi] = useGitProviderUpdateApi({ filter: { slug: gitProviderSlug } });

	return (
		<>
			{/* 1. Form input */}
			{current === 0 && (
				<>
					<Typography.Title level={2} className="text-center">
						Bitbucket Connect
					</Typography.Title>
					{/* <Divider>
						WITH OAUTH CONSUMER{" "}
						<Typography.Link href="https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/" target="_blank">
							<QuestionCircleOutlined />
						</Typography.Link>
					</Divider>
					<Card className="oauth-consumer">
						<BitbucketOAuthConsumerForm />
					</Card> */}
					<Divider>
						WITH APP PASSWORD{" "}
						<Typography.Link href="https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/" target="_blank">
							<QuestionCircleOutlined />
						</Typography.Link>
					</Divider>
					<Card className="app-password">
						<BitbucketAppPasswordForm
							next={(providerSlug) => {
								console.log("providerSlug :>> ", providerSlug);
								setGitProviderSlug(providerSlug);
								setCurrent(1);
							}}
						/>
					</Card>
				</>
			)}

			{/* 2. Select organization */}
			{current === 1 && (
				<>
					<Typography.Title level={2} className="text-center">
						Select bitbucket workspace
					</Typography.Title>
					<Card className="org-select">
						{orgs.status === "loading" && <LoadingOutlined />}
						{orgs.status === "error" && <Alert type="error" message={<>{orgs.data?.messages || "Authenticated failed."}</>} />}
						{orgs.status === "success" && (
							<Select
								style={{ display: "block" }}
								// value={orgs.data?.list[0]?.name}
								onSelect={(label, option) => {
									const org = orgs.data?.list.find((o) => o.id === option.value);
									// console.log("org :>> ", org);
									// update git provider
									updateApi({
										name: `${org?.name.toUpperCase()} Github`,
										org: org?.name,
										gitWorkspace: org?.name,
										isOrg: org?.is_org,
									})?.then((res) => {
										// console.log("res :>> ", res);
										if (isEmpty(res.data)) return;

										const gitProvider = isArray(res.data) ? res.data[0] : res.data;
										console.log("gitProvider :>> ", gitProvider);
										if (!gitProvider) {
											notification.error({ message: `Oops...`, description: `Unable to update Bitbucket git provider.` });
											return;
										}

										// go to finish step
										setCurrent(2);
									});
								}}
								options={
									orgs.data?.list.map((_org) => {
										return { value: _org.id, label: _org.name };
									}) || []
								}
							/>
						)}
					</Card>
				</>
			)}

			{/* 3. Done */}
			{current === 2 && (
				<>
					<Typography.Title level={2} className="text-center">
						<CheckCircleOutlined /> Congrats!
					</Typography.Title>
					<Card className="org-select text-center">You've connected your Bitbucket workspace successfully.</Card>
				</>
			)}

			<br />
			<Steps
				current={current}
				items={[
					{
						title: "Login",
						icon: <UserOutlined />,
					},
					{
						title: "Select org.",
						icon: <BankOutlined />,
					},
					{
						title: "Done",
						icon: <CheckCircleOutlined />,
					},
				]}
			/>
		</>
	);
};
