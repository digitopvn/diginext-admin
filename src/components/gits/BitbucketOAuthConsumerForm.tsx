import { ArrowRightOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";

const BitbucketOAuthConsumerForm = () => {
	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			name="oauth-consumer"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
			style={{ maxWidth: 600 }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label="Key" name="key" rules={[{ required: true, message: "Please input your OAuth consumer key!" }]}>
				<Input prefix={<KeyOutlined />} placeholder="Your consumer key" />
			</Form.Item>

			<Form.Item label="Secret" name="secret" rules={[{ required: true, message: "Please input your OAuth consumer secret!" }]}>
				<Input.Password prefix={<LockOutlined />} placeholder="Your consumer secret" />
			</Form.Item>

			<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
				<Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />}>
					Connect
				</Button>
			</Form.Item>
		</Form>
	);
};

export default BitbucketOAuthConsumerForm;
