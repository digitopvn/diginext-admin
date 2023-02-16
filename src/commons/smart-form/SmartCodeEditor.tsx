import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { langs } from "@uiw/codemirror-extensions-langs";
import { abcdef } from "@uiw/codemirror-themes-all";
import CodeMirror from "@uiw/react-codemirror";
import { Form, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import ManualSaveController from "./ManualSaveController";
import type { SmartCodeEditorProps, SmartFormElementProps } from "./SmartFormTypes";

const SmartCodeEditor = (props: SmartFormElementProps & SmartCodeEditorProps) => {
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
		autoSave = false,
		isNew,
		lang = [],
		height = "350px",
	} = props;

	const form = Form.useFormInstance();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	// callbacks

	const onChange = (editorValue: string) => {
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
				<CodeMirror
					height={height}
					theme={abcdef}
					extensions={[...lang.map((_lang) => langs[_lang]()), basicSetup({})]}
					onChange={onChange}
					value={_value}
				/>

				{postLabel}

				{/* Display manual save controller if auto save is off */}
				{!autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} icon={icon} />}
			</Space>
		</Form.Item>
	);
};

export default SmartCodeEditor;
