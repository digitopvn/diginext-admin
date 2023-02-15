import { CheckOutlined, ClearOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Form, Space } from "antd";

const ManualSaveController = (props: { compact?: boolean; icon?: any; name: string; initialValue: any; setValue: (value: any) => void }) => {
	const { compact = false, icon, name, setValue, initialValue } = props;
	const form = Form.useFormInstance();

	const submit = () => form.submit();

	const reset = () => {
		form.setFieldValue(name, initialValue);
		setValue(initialValue);
	};

	const clear = () => {
		form.setFieldValue(name, "");
		setValue("");
	};

	return (
		<Space size={compact ? 4 : 8}>
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
