import type { langNames } from "@uiw/codemirror-extensions-langs";
import type { CSSProperties, ReactNode } from "react";
import type React from "react";

export type SmartFormElementProps<T = any> = {
	key?: React.Key;
	type?: "input" | "password" | "textarea" | "code-editor" | "select" | "list_string" | "number";
	className?: string;
	style?: CSSProperties;
	wrapperStyle?: CSSProperties;
	name: string;
	value?: T;
	defaultValue?: T;
	initialValue?: T;
	displayValue?: string;
	label?: string | ReactNode;
	postLabel?: any;
	requiredMessage?: string;
	status?: any;
	autoSave?: boolean;
	alwaysSend?: boolean;
	isNew?: boolean;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
	visible?: boolean;
	onChange?: (value: any) => void;
	/**
	 * Programming Language of the `<SmartCodeEditor />` component
	 */
	lang?: typeof langNames;
	height?: string;
	/**
	 * Options of the `<SmartSelect />` component
	 */
	options?: { value: any; label: string }[];
	displayKey?: string;
};

export type SmartCodeEditorProps = SmartFormElementProps & {
	lang?: typeof langNames;
};

export type SmartSelectProps = SmartFormElementProps & {
	options: { value: any; label: string }[];
};
