import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

const DestroyWorkspaceButton = () => {
	return (
		<Popconfirm title="Are you sure?" description="This action cannot be undone." placement="bottomRight">
			<Button type="default" danger icon={<PoweroffOutlined className="align-middle" />}>
				Destroy
			</Button>
		</Popconfirm>
	);
};

export default DestroyWorkspaceButton;
