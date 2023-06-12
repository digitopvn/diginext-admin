import { Button, Form, Input } from "antd";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useBasicAuthLoginApi } from "@/api/api-basic-auth";

const LoginForm = () => {
	const [errMsg, setErrMsg] = useState("");
	const [loginApi] = useBasicAuthLoginApi();
	const router = useRouter();

	const onFinish = async (values: any) => {
		console.log("Success:", values);

		try {
			const res = await loginApi(values);
			if (!res?.status) {
				const msg = res?.messages.join(".") || "Unexpected error.";
				setErrMsg(msg);
			} else {
				setCookie("x-auth-cookie", res.data.access_token);
				router.push("/workspace/select");
			}
		} catch (e) {
			console.error(e);
			setErrMsg(`Network error, please try again later.`);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			className="text-left"
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please input a valid email" }]}>
				<Input />
			</Form.Item>

			<Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password" }]}>
				<Input.Password />
			</Form.Item>

			{/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item> */}

			<Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mb-0 text-left">
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
				{/* TODO: Forgot password */}
				<Link href="#" className="ml-3 underline">
					Forgot password?
				</Link>
			</Form.Item>

			<Form.ErrorList errors={[errMsg]} />
		</Form>
	);
};

export default LoginForm;
