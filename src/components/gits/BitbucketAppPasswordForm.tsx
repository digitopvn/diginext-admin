import { ArrowRightOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

const BitbucketAppPasswordForm = () => {
	const onFinish = (values: any) => {
		console.log("Success:", values);
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
