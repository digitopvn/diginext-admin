import type { langNames } from "@uiw/codemirror-extensions-langs";
import type { CSSProperties } from "react";

export type SmartFormElementProps = {
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
	// status: "error" | "idle" | "loading" | "success";
};

export type SmartCodeEditorProps = SmartFormElementProps & {
	lang?: typeof langNames;
};

export type SmartSelectProps = SmartFormElementProps & {
	options: { value: any; label: string }[];
};
