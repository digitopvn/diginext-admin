import { ArrowRightOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

import { useGitProviderCreateApi } from "@/api/api-git-provider";

const BitbucketAppPasswordForm = (props: { next?: (org: string) => void }) => {
	const { next } = props;
	const [createApi] = useGitProviderCreateApi();

	const onFinish = async (values: { username: string; app_password: string }) => {
		console.log("Success:", values);

		const gitProvider = await createApi({
			type: "bitbucket",
			bitbucket_oauth: values,
		});

		if (gitProvider && next && gitProvider.data?.slug) next(gitProvider.data.slug);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			name="app-password"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
			style={{ maxWidth: 600 }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label="Username" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
				<Input prefix={<UserOutlined />} placeholder="Username" />
			</Form.Item>

			<Form.Item label="App password" name="app_password" rules={[{ required: true, message: "Please input app password!" }]}>
				<Input.Password prefix={<LockOutlined />} />
			</Form.Item>

			<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
				<Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
					Connect
				</Button>
			</Form.Item>
		</Form>
	);
};

export default BitbucketAppPasswordForm;
