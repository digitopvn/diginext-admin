import { CopyOutlined } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import { isEmpty } from "lodash";
import type { ReactElement } from "react";
import { useCopyToClipboard } from "usehooks-ts";

const CopyCode = (props: { children?: ReactElement | ReactElement[]; value: string; mode?: "block" | "inline" }) => {
	const { children, value, mode = "block" } = props;
	const [copiedValue, copy] = useCopyToClipboard();

	return (
		<>
			{mode === "block" ? (
				<div className="text-center">
					<Typography.Paragraph>
						<pre>{value}</pre>
					</Typography.Paragraph>
					<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
						{copiedValue ? "Copied" : "Copy"}
					</Button>
				</div>
			) : (
				<Space.Compact>
					<Input className="flex-none" disabled value={value} />
					<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
						{copiedValue ? "Copied" : "Copy"}
					</Button>
				</Space.Compact>
			)}
		</>
	);
};

export default CopyCode;
