import { CheckCircleOutlined, CheckOutlined, ClearOutlined, CloseCircleOutlined, LoadingOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Form, Space } from "antd";

import type { ApiStatus } from "@/api/api-types";

interface ManualSaveControllerProps {
	name: string;
	initialValue: any;
	setValue: (value: any) => void;
	compact?: boolean;
	apiStatus?: ApiStatus;
}

const ManualSaveController = (props: ManualSaveControllerProps) => {
	const { compact = false, name, setValue, initialValue, apiStatus } = props;
	const form = Form.useFormInstance();

	const submit = () => form.submit();

	const reset = () => {
		form.setFieldValue(name, initialValue);
		setValue(initialValue);
	};

	const clear = () => {
		form.setFieldValue(name, "");
		setValue(undefined);
	};

	let statusIcon;
	if (apiStatus && apiStatus === "loading") statusIcon = <LoadingOutlined />;
	if (apiStatus && apiStatus === "error") statusIcon = <CloseCircleOutlined />;
	if (apiStatus && apiStatus === "success") statusIcon = <CheckCircleOutlined />;

	return (
		<Space size={compact ? 4 : 8}>
			{statusIcon}
			<Button type="primary" icon={compact && <CheckOutlined />} onClick={() => submit()}>
				{!compact && "Save"}
			</Button>
			<Button icon={compact && <ClearOutlined />} onClick={() => clear()}>
				{!compact && "Clear"}
			</Button>
			<Button danger icon={compact && <RollbackOutlined />} onClick={() => reset()}>
				{!compact && "Reset"}
			</Button>
		</Space>
	);
};

export default ManualSaveController;
