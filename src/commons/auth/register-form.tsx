import { Button, Form, Input } from "antd";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useBasicAuthRegisterApi } from "@/api/api-basic-auth";

const RegisterForm = () => {
	const [errMsg, setErrMsg] = useState("");
	const [registerApi] = useBasicAuthRegisterApi();
	const router = useRouter();

	const onFinish = async (values: any) => {
		console.log("Success:", values);

		try {
			const res = await registerApi(values);
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
		<div>
			<Form
				name="basic"
				className="text-left"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				scrollToFirstError
			>
				<Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please input a valid email" }]}>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{ required: true, message: "Please input your password" },
						{ type: "string", min: 8, message: "Password must has at least 8 digits." },
					]}
					hasFeedback
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Confirm Password"
					name="confirm"
					dependencies={["password"]}
					hasFeedback
					rules={[
						{
							required: true,
							message: "Please confirm your password",
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error("The new password that you entered do not match!"));
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				{/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

				<Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mb-0 text-left">
					<Button type="primary" htmlType="submit">
						Create Account
					</Button>
					<Form.ErrorList errors={[errMsg]} />
				</Form.Item>
			</Form>
		</div>
	);
};

export default RegisterForm;
