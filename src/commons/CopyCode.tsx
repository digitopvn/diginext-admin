import { CopyOutlined } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import { isEmpty } from "lodash";
import type { ReactElement } from "react";
import { useCopyToClipboard } from "usehooks-ts";

const CopyCode = (props: {
	children?: ReactElement | ReactElement[];
	className?: string;
	value: string;
	mode?: "block" | "inline" | "hidden";
	type?: "text" | "password";
}) => {
	const { children, className, value, mode = "block", type = "text" } = props;
	const [copiedValue, copy] = useCopyToClipboard();

	switch (mode) {
		case "inline":
			return (
				<Space.Compact className={className}>
					<Input type={type} className="flex-none" disabled value={value} />
					<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
						{copiedValue ? "Copied" : "Copy"}
					</Button>
				</Space.Compact>
			);
		case "hidden":
			return (
				<div className={className}>
					<Input type={type} className="flex-none" disabled value={value} hidden />
					<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
						{copiedValue ? "Copied" : "Copy"}
					</Button>
				</div>
			);
		case "block":
		default:
			return (
				<div className={`text-center ${className || ""}`}>
					<Typography.Paragraph>
						{type === "text" ? <pre>{value}</pre> : <Input type="password" className="flex-none" disabled value={value} />}
					</Typography.Paragraph>
					<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
						{copiedValue ? "Copied" : "Copy"}
					</Button>
				</div>
			);
	}
};

export default CopyCode;
