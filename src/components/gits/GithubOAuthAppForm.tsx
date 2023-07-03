import { ArrowRightOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";

const GithubOAuthAppForm = () => {
	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			name="oauth-app"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
			style={{ maxWidth: 600 }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label="Client ID" name="client_id" rules={[{ required: true, message: "Please input your app's Client ID!" }]}>
				<Input prefix={<KeyOutlined />} placeholder="Your client id" />
			</Form.Item>

			<Form.Item label="Secret" name="secret" rules={[{ required: true, message: "Please input your app's Client Secret!" }]}>
				<Input.Password prefix={<LockOutlined />} placeholder="Your client secret" />
			</Form.Item>

			<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
				<Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
					Connect
				</Button>
			</Form.Item>
		</Form>
	);
};

export default GithubOAuthAppForm;
