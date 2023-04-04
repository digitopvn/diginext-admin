import type { langNames } from "@uiw/codemirror-extensions-langs";
import type { CSSProperties } from "react";
import type React from "react";

export type SmartFormElementProps = {
	key?: React.Key;
	type?: "input" | "textarea" | "code-editor" | "select";
	className?: string;
	style?: CSSProperties;
	name: string;
	value?: any;
	defaultValue?: any;
	initialValue?: any;
	label?: string;
	postLabel?: any;
	requiredMessage?: string;
	status?: any;
	autoSave?: boolean;
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
