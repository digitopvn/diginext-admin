import { UserAddOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import { Button, Popover } from "antd";

import InviteMember from "./InviteMember";

const options: SelectProps["options"] = [];

const InviteMemberButton = () => {
	return (
		<Popover placement="bottomRight" trigger="click" content={<InviteMember />}>
			<Button key="workspace-setting-btn" type="default" icon={<UserAddOutlined className="align-middle" />}>
				Invite
			</Button>
		</Popover>
	);
};

export default InviteMemberButton;
