import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Space } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import ManualSaveController from "./ManualSaveController";
import type { SmartFormElementProps } from "./SmartFormTypes";

const { TextArea } = Input;

const SmartTextArea = (props: SmartFormElementProps) => {
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
		disabled = false,
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
	if (status && status[name] === "error") icon = <CloseOutlined />;
	if (status && status[name] === "loading") icon = <LoadingOutlined />;
	if (status && status[name] === "success") icon = <CheckOutlined color="green" />;

	return (
		<Form.Item
			label={
				<Space size="small">
					{label}
					{icon}
				</Space>
			}
			name={name}
			rules={[{ required, message: requiredMessage }]}
		>
			{/* <Input suffix={icon} onChange={onChange} /> */}
			<Space direction="vertical" className="w-full">
				<TextArea rows={3} onChange={onChange} value={_value} disabled={disabled} />

				{postLabel}

				{/* Display manual save controller if auto save is off */}
				{!autoSave && !isNew && <ManualSaveController compact initialValue={initialValue} name={name} setValue={setValue} />}
			</Space>
		</Form.Item>
	);
};

export default SmartTextArea;
