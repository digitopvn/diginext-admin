import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import ManualSaveController from "./ManualSaveController";
import type { SmartFormElementProps } from "./SmartFormTypes";

const SmartSelect = (props: SmartFormElementProps) => {
	const {
		className,
		style,
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
		options,
		onChange,
		disabled = false,
		visible = true,
		wrapperStyle,
	} = props;

	const form = Form.useFormInstance();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// callbacks
	const _onChange = (selectedValue: any) => {
		form.setFieldValue(name, selectedValue);
		setValue(selectedValue);

		if (onChange) onChange(selectedValue);
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

		if (onChange) onChange(value);
	}, [value]);

	useEffect(() => {
		// Only process update api if the value is different with the initial value...
		if (debouncedValue === value) return;
		// Triggers when "debouncedValue" changes
		if (autoSave && !isNew) submit();
	}, [debouncedValue]);

	// console.log("status :>> ", status);
	// console.log(`status[${name}] :>> `, status[name]);

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
				<Space size="small">
					{label}
					{icon}
				</Space>
			}
			name={name}
			rules={[{ required, message: requiredMessage }]}
			style={{ display: visible ? "block" : "none", ...wrapperStyle }}
		>
			<Space direction="horizontal" className="w-full">
				<Select className={className} style={style} value={_value} onChange={_onChange} options={options} disabled={disabled} />

				{postLabel}

				{/* Display manual save controller if auto save is off */}
				{!autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} />}
			</Space>
		</Form.Item>
	);
};

export default SmartSelect;
