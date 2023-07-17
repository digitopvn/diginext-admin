import { CheckOutlined, KeyOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";

import { useAppAddDomainApi } from "@/api/api-app";

const AddDomainForm = (props: { app: string; env: string; next?: () => void }) => {
	const { app, env, next } = props;
	const [addDomainApi, apiStatus] = useAppAddDomainApi({ filter: { slug: app } });

	const onFinish = async (values: any) => {
		console.log("Success:", values);
		const domains = [values.domain];
		const response = await addDomainApi({ domains, env });
		console.log("response :>> ", response);

		if (next) next();
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			name="add-domains"
			style={{ maxWidth: 600 }}
			layout="vertical"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
			preserve={false}
		>
			<Form.Item label="Domain" name="domain" rules={[{ required: true, message: "Please input your domain." }]}>
				<Input prefix={<KeyOutlined />} placeholder="Your domain" />
			</Form.Item>

			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					icon={apiStatus === "success" ? <CheckOutlined /> : <PlusOutlined />}
					loading={apiStatus === "loading"}
				>
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default AddDomainForm;
