import { BankOutlined, CheckCircleOutlined, LoadingOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Card, Divider, notification, Select, Steps, Typography } from "antd";
import { isArray, isEmpty } from "lodash";
import { useState } from "react";

import { useGitOrgListApi, useGitProviderUpdateApi } from "@/api/api-git-provider";

import GithubPersonalAccessTokenForm from "./GithubPersonalAccessTokenForm";

export const GithubConnectModal = () => {
	const [current, setCurrent] = useState(0);
	const [gitProviderSlug, setGitProviderSlug] = useState<string>();

	const orgs = useGitOrgListApi({
		filter: { slug: gitProviderSlug },
		enabled: typeof gitProviderSlug !== "undefined",
	});
	console.log("orgs.data :>> ", orgs.data);

	const [updateApi] = useGitProviderUpdateApi({ filter: { slug: gitProviderSlug } });

	return (
		<>
			{/* 1. Form input */}
			{current === 0 && (
				<>
					<Typography.Title level={2} className="text-center">
						Github Connect
					</Typography.Title>
					<Divider>
						WITH PERSONAL ACCESS TOKEN{" "}
						<Typography.Link
							href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
							target="_blank"
						>
							<QuestionCircleOutlined />
						</Typography.Link>
					</Divider>
					<Card className="personal-access-token">
						<GithubPersonalAccessTokenForm
							next={(providerSlug) => {
								console.log("providerSlug :>> ", providerSlug);
								setGitProviderSlug(providerSlug);
								setCurrent(1);
							}}
						/>
					</Card>
					{/* <Divider>
						WITH GITHUB OAUTH APP{" "}
						<Typography.Link
							href="https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app"
							target="_blank"
						>
							<QuestionCircleOutlined />
						</Typography.Link>
					</Divider>
					<Card className="oauth-app">
						<GithubOAuthAppForm />
					</Card> */}
				</>
			)}

			{/* 2. Select organization */}
			{current === 1 && (
				<>
					<Typography.Title level={2} className="text-center">
						Select github organization
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
											notification.error({ message: `Oops...`, description: `Can't update git provider.` });
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
					<Card className="org-select text-center">You've connected your Github organization successfully.</Card>
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
