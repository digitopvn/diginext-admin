import { CopyOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { isEmpty } from "lodash";
import type { ReactElement } from "react";
import { useCopyToClipboard } from "usehooks-ts";

const CopyCode = (props: { children?: ReactElement | ReactElement[]; value: string }) => {
	const { children, value } = props;
	const [copiedValue, copy] = useCopyToClipboard();

	return (
		<div className="text-center">
			{/* <div className="mb-2 max-w-xs break-all rounded-lg border border-solid border-gray-600 py-2 px-4"></div> */}
			<Typography.Paragraph>
				<pre>{value}</pre>
			</Typography.Paragraph>
			<Button type="primary" danger={!isEmpty(copiedValue)} size="large" onClick={() => copy(value)} icon={<CopyOutlined />}>
				{copiedValue ? "Copied" : "Copy"}
			</Button>
		</div>
	);
};

export default CopyCode;
