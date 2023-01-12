import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import { Form, Input } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { useAuth } from "@/api/api-auth";

const AutoSendInput = <T = any,>(props: {
	name: string;
	label?: string;
	requiredMessage?: string;
	updateApi: UseMutateAsyncFunction<
		T,
		Error,
		any,
		{
			id?: string | undefined;
			previousData?: any;
		}
	>;
	status: "error" | "idle" | "loading" | "success";
}) => {
	const { updateApi, label, status, name, requiredMessage = "This field is required." } = props;
	const [user, reload] = useAuth();

	const [form] = Form.useForm();

	const [value, setValue] = useState();
	const debouncedValue = useDebounce(value, 500);

	useEffect(() => {
		// Do fetch here...
		// Triggers when "debouncedValue" changes
		form.submit();
	}, [debouncedValue]);

	const onChange = (e: SyntheticEvent) => setValue((e.currentTarget as any).value);

	const onFinish = async (values: any) => {
		console.log("Submit:", values);
		// const result = await updateApi({ ...values, owner: user?._id });
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	let icon;
	if (status === "loading") icon = <LoadingOutlined />;
	if (status === "success") icon = <CheckOutlined color="green" />;

	return (
		<Form
			layout="vertical"
			name="edit"
			form={form}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label={label} name={name} rules={[{ required: true, message: `Please input your ${name}` }]}>
				<Input onChange={onChange} suffix={icon} />
			</Form.Item>
		</Form>
	);
};

export default AutoSendInput;
