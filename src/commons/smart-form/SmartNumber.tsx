import { CheckOutlined, CloseOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { toNumber } from "lodash";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import ManualSaveController from "./ManualSaveController";
import type { SmartFormElementProps } from "./SmartFormTypes";

export type SmartNumberProps = SmartFormElementProps<number>;

const SmartNumber = (props: SmartNumberProps) => {
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
		wrapperStyle,
	} = props;

	const form = Form.useFormInstance();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// features
	const plus = (step: number) => {
		const result = (_value ?? 0) + step;
		form.setFieldValue(name, result);
		setValue(result);
	};

	const minus = (step: number) => {
		let result = (_value ?? 0) - step;
		if (result < 0) result = 0;
		form.setFieldValue(name, result);
		setValue(result);
	};

	// callbacks
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = toNumber(e.currentTarget.value);
		form.setFieldValue(name, newValue);
		setValue(newValue);
	};

	const submit = () => form.submit();

	const reset = () => {
		form.setFieldValue(name, initialValue);
		setValue(initialValue);
	};

	const clear = () => {
		form.setFieldValue(name, 0);
		setValue(0);
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
			style={{ display: visible ? "block" : "none", ...wrapperStyle }}
		>
			<Space direction="vertical" className="w-full">
				<Input
					size="small"
					placeholder={placeholder}
					onChange={onChange}
					value={_value}
					disabled={disabled}
					prefix={<Button type="link" icon={<MinusOutlined />} onClick={() => minus(1)} />}
					suffix={<Button type="link" icon={<PlusOutlined />} onClick={() => plus(1)} />}
					style={{ textAlign: "center" }}
				/>

				{/* Display manual save controller if auto save is off */}
				{!autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} />}
			</Space>
		</Form.Item>
	);
};

export default SmartNumber;
