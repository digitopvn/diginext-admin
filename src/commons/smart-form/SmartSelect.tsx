import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Select, Space } from "antd";
import type { SyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import ManualSaveController from "./ManualSaveController";

import type { SmartFormElementProps, SmartSelectProps } from "./SmartFormTypes";

const SmartSelect = (props: SmartSelectProps) => {
	const {
		className,
		style,
		label,
		name,
		required = false,
		requiredMessage = `Please input your ${label}`,
		defaultValue,
		initialValue,
		value,
		status,
		autoSave = true,
		options,
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
		if (autoSave) submit();
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
			<Space direction="horizontal" className="w-full">
				<Select className={className} style={style} value={_value} onChange={onChange} options={options} />

				{/* Display manual save controller if auto save is off */}
				{!autoSave && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} icon={icon} />}
			</Space>
		</Form.Item>
	);
};

export default SmartSelect;