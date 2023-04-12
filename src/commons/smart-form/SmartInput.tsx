import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Space } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import ManualSaveController from "./ManualSaveController";
import type { SmartFormElementProps } from "./SmartFormTypes";

const SmartInput = (props: SmartFormElementProps) => {
	const {
		label,
		postLabel,
		name,
		required = false,
		requiredMessage = `Please input your ${label}`,
		defaultValue,
		initialValue,
		value,
		status,
		autoSave = true,
		isNew,
		placeholder,
		disabled = false,
		visible = true,
	} = props;

	const form = Form.useFormInstance();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// callbacks
	const onChange = (e: SyntheticEvent) => {
		const editorValue = (e.currentTarget as any).value;
		form.setFieldValue(name, editorValue);
		setValue(editorValue);
	};

	const submit = () => form.submit();

	const reset = () => {
		form.setFieldValue(name, initialValue);
		setValue(initialValue);
	};

	const clear = () => {
		form.setFieldValue(name, "");
		setValue("");
	};

	// update the value immediatly:
	useEffect(() => {
		form.setFieldValue(name, value);
		setValue(value);
	}, [value]);

	useEffect(() => {
		// Only process update api if the value is different with the initial value...
		if (debouncedValue === value) return;
		// Triggers when "debouncedValue" changes
		if (autoSave && !isNew) submit();
	}, [debouncedValue]);

	let icon;
	if (status && status[name] === "error")
		icon = (
			<span className="text-red-600">
				<CloseOutlined />
				Failed
			</span>
		);
	if (status && status[name] === "loading") icon = <LoadingOutlined />;
	if (status && status[name] === "success") icon = <CheckOutlined color="green" />;

	return (
		<Form.Item
			label={
				<Space.Compact direction="vertical">
					<Space size="small">
						{label}
						{icon}
					</Space>
					{postLabel}
				</Space.Compact>
			}
			name={name}
			rules={[{ required, message: requiredMessage }]}
			style={{ display: visible ? "block" : "none" }}
		>
			<Space direction="vertical" className="w-full">
				<Input placeholder={placeholder} onChange={onChange} value={_value} disabled={disabled} />

				{/* Display manual save controller if auto save is off */}
				{!autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} />}
			</Space>
		</Form.Item>
	);
};

export default SmartInput;
