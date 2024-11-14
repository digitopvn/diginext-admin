import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import { Form, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDarkMode, useDebounce } from "usehooks-ts";

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
		height,
		disabled = false,
		visible = true,
		wrapperStyle,
	} = props;

	const form = Form.useFormInstance();

	const [_value, setValue] = useState(value ?? defaultValue);
	const debouncedValue = useDebounce(_value, 500);

	const { isDarkMode } = useDarkMode();

	// callbacks

	const onChange = (editorValue: string | undefined) => {
		if (editorValue) {
			form.setFieldValue(name, editorValue);
			setValue(editorValue);
		}
	};

	const submit = () => form.submit();

	// update the value immediatly:
	useEffect(() => {
		form.setFieldValue(name, value);
		setValue(value || "");
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
			// noStyle
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
			<Editor
				className="w-full overflow-hidden rounded-md border border-gray-400"
				height={height || 300}
				theme={isDarkMode ? "vs-dark" : "vs-light"}
				language={lang[0] || "javascript"}
				value={_value}
				onChange={onChange}
				options={{
					minimap: { enabled: false },
					readOnly: disabled,
					scrollBeyondLastLine: false,
				}}
			/>

			{postLabel}

			{/* Display manual save controller if auto save is off */}
			{!disabled && !autoSave && !isNew && <ManualSaveController initialValue={initialValue} name={name} setValue={setValue} />}
			{/* </Space> */}
			<div className="h-4" />
		</Form.Item>
	);
};

export default SmartCodeEditor;
