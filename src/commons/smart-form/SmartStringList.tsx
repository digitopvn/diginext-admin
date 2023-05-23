import { CheckOutlined, CloseOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, List, Space } from "antd";
import { isArray } from "lodash";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { filterDuplicatedItems } from "@/plugins/array-utils";

import ManualSaveController from "./ManualSaveController";
import type { SmartFormElementProps } from "./SmartFormTypes";

export type SmartStringListProps = SmartFormElementProps<string[]>;

const SmartStringList = (props: SmartStringListProps) => {
	const {
		className,
		style,
		label,
		postLabel,
		name,
		required = false,
		requiredMessage = `Please input your ${label}`,
		value = [],
		defaultValue = [],
		initialValue = [],
		status = {},
		autoSave = true,
		isNew,
		options,
		onChange,
		disabled = false,
		visible = true,
	} = props;

	const form = Form.useFormInstance();

	const [valueToBeAdded, setValueToBeAdded] = useState("");

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// callbacks
	const addValue = (newValue: string) => {
		const curValue = filterDuplicatedItems(_value || []);
		const newArr = curValue.indexOf(newValue) > -1 ? curValue : [...curValue, newValue];
		form.setFieldValue(name, newArr);
		setValue(newArr);

		// reset input
		setValueToBeAdded("");

		status[name] = "loading";

		if (onChange) onChange(newValue);
	};

	const removeValueAtIndex = (index: number) => {
		const newValue = !_value ? [] : _value.filter((item, i) => i !== index);
		setValue(newValue);
		form.setFieldValue(name, newValue);

		if (onChange) onChange(newValue);
	};

	const submit = () => form.submit();

	const reset = () => {
		form.setFieldValue(name, initialValue);
		setValue(initialValue);
	};

	const clear = () => {
		form.setFieldValue(name, []);
		setValue([]);
	};

	// update the value immediatly:
	useEffect(() => {
		let initialVal = value ?? [];
		if (value && !isArray(value) && typeof value[0] !== "undefined") {
			initialVal = [];
			Object.entries(value).forEach(([, val]) => {
				console.log("val :>> ", val);
				if (typeof val === "string") initialVal.push(val);
			});
		}
		form.setFieldValue(name, initialVal);
		setValue(initialVal);
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
		<>
			<Form.Item
				label={
					<Space size="small">
						{label}
						{icon}
					</Space>
				}
				name={name}
				rules={[{ required, message: requiredMessage }]}
				style={{ display: visible ? "block" : "none" }}
			>
				{/* <Select className={className} style={style} value={_value} onChange={_onChange} options={options} disabled={disabled} /> */}
				{/* <Input hidden /> */}
				<List
					bordered
					size="small"
					dataSource={_value ?? []}
					footer={
						<Space.Compact style={{ width: "100%" }}>
							<Input.Search
								value={valueToBeAdded}
								onChange={(e) => setValueToBeAdded(e.currentTarget.value)}
								loading={status && status[name] === "loading"}
								enterButton={
									<Button icon={<PlusOutlined />} onClick={() => addValue(valueToBeAdded)}>
										Add
									</Button>
								}
							/>
						</Space.Compact>
					}
					renderItem={(item, index) => (
						<List.Item
							actions={[<Button key={`${label}-delete-btn`} icon={<DeleteOutlined />} onClick={() => removeValueAtIndex(index)} />]}
						>
							<List.Item.Meta title={<span>{item}</span>} />
						</List.Item>
					)}
				/>
			</Form.Item>

			{postLabel}

			{/* Display manual save controller if auto save is off */}
			{!autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} />}
		</>
	);
};

export default SmartStringList;
