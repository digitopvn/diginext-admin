import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

const AutoSendInput = (props: {
	// form: FormInstance;
	name: string;
	value?: any;
	defaultValue?: any;
	label?: string;
	requiredMessage?: string;
	status?: any;
	// status: "error" | "idle" | "loading" | "success";
}) => {
	const { label, name, requiredMessage = "This field is required.", defaultValue, value, status } = props;

	const form = Form.useFormInstance();

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

	let icon;
	if (status && status[name] === "error") icon = <CloseOutlined />;
	if (status && status[name] === "loading") icon = <LoadingOutlined />;
	if (status && status[name] === "success") icon = <CheckOutlined color="green" />;

	return (
		<Form.Item label={label} name={name} rules={[{ required: true, message: `Please input your ${name}` }]}>
			<Input suffix={icon} onChange={onChange} />
		</Form.Item>
	);
};

export default AutoSendInput;
