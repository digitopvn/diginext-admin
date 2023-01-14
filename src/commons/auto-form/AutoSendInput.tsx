import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import { Form, Input } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { useAuth } from "@/api/api-auth";

const AutoSendInput = <T = any,>(props: {
	name: string;
	value?: any;
	defaultValue?: any;
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
	const { updateApi, label, status, name, requiredMessage = "This field is required.", defaultValue, value } = props;
	const [user, reload] = useAuth();

	const [form] = Form.useForm();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// console.log("_value :>> ", _value);
	// const initialValues: { [key: string]: any } = {};
	// initialValues[name] = _value;
	// console.log("initialValues :>> ", initialValues);

	// update the value immediatly:
	useEffect(() => {
		form.setFieldValue(name, value);
		setValue(value);
	}, [value]);

	useEffect(() => {
		// Only process update api if the value is different with the initial value...
		if (debouncedValue === value) return;
		// Triggers when "debouncedValue" changes
		form.submit();
	}, [debouncedValue]);

	const onChange = (e: SyntheticEvent) => {
		form.setFieldValue(name, (e.currentTarget as any).value);
		setValue((e.currentTarget as any).value);
	};

	const onFinish = async (values: any) => {
		console.log("Submit:", values);
		const updateData = { ...values };
		if (!value) updateData.owner = user?._id; // only save "owner" when create new item

		const result = await updateApi(updateData);
		console.log("result :>> ", result);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	let icon;
	if (status === "error") icon = <CloseOutlined />;
	if (status === "loading") icon = <LoadingOutlined />;
	if (status === "success") icon = <CheckOutlined color="green" />;

	return (
		<Form
			layout="vertical"
			name="edit"
			form={form}
			// initialValues={initialValues}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Form.Item label={label} name={name} rules={[{ required: true, message: `Please input your ${name}` }]}>
				<Input suffix={icon} onChange={onChange} />
			</Form.Item>
		</Form>
	);
};

export default AutoSendInput;
