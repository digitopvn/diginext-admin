import { ArrowRightOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";

import { useGitProviderCreateApi } from "@/api/api-git-provider";

const GithubPersonalAccessTokenForm = (props: { next?: (org: string) => void }) => {
	const { next } = props;
	const [createApi] = useGitProviderCreateApi();

	const onFinish = async (values: { access_token: string }) => {
		console.log("Success:", values);

		const gitProvider = await createApi({
			// ...values,
			type: "github",
			github_oauth: {
				personal_access_token: values.access_token,
			},
		});

		if (gitProvider && next && gitProvider.data.slug) next(gitProvider.data.slug);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form name="personal-access-token" style={{ maxWidth: 600 }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
			{/* <Form.Item name="name" rules={[{ required: true, message: "Please input your organization name." }]}>
				<Input size="large" prefix={<BankOutlined />} placeholder="Git provider name" autoComplete="off" />
			</Form.Item> */}
			<Form.Item
				// noStyle
				style={{ width: `100%`, display: "block" }}
				name="access_token"
				rules={[{ required: true, message: "Please input your personal access token." }]}
			>
				<Input.Password
					style={{ flex: 1, marginRight: 6 }}
					size="large"
					prefix={<LockOutlined />}
					placeholder="Your personal access token"
					autoComplete="off"
				/>
			</Form.Item>
			<Form.Item>
				<Button size="large" type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
					Connect
				</Button>
			</Form.Item>
		</Form>
	);
};

export default GithubPersonalAccessTokenForm;
