import type { TagProps } from "antd";
import { App, Button, Form, Select, Tag, Typography } from "antd";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";

import { useWorkspaceInviteApi } from "@/api/api-workspace";

const defaultOptions: CustomTagProps[] = [];

interface CustomTagProps extends TagProps {
	label: string;
	value: string;
}

const renderTag = (props: CustomTagProps) => {
	const { label, value, closable, onClose, color } = props;
	const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};
	return (
		<Tag
			color={isEmail(value) ? "default" : "error"}
			onMouseDown={onPreventMouseDown}
			closable={closable}
			onClose={onClose}
			style={{ marginRight: 3 }}
		>
			{label}
		</Tag>
	);
};

const InviteMember = () => {
	const root = App.useApp();
	const [form] = Form.useForm();

	const [canSubmit, setCanSubmit] = useState(false);

	const [inviteApi] = useWorkspaceInviteApi();

	const reset = () => {
		form.resetFields(["emails"]);
	};

	const handleChange = (values: string[]) => {
		console.log(`selected:`, values);
		setCanSubmit(values.filter((value) => isEmail(value)).length > 0);
		// console.log('form.getFieldValue("emails") :>> ', form.getFieldValue("emails"));
	};

	const onSubmit = async (data: any) => {
		console.log("data :>> ", data);

		const res = await inviteApi(data);
		if (res?.status) {
			reset();
			root.modal.success({
				title: `Congrats!`,
				content: <>Invitation emails have been sent successfully.</>,
				closable: true,
			});
		}
	};

	const onFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
		root.notification.error({ message: `Failed`, description: `Something is wrong.` });
	};

	return (
		<div>
			<Typography.Title level={4}>Emails</Typography.Title>
			<Form name="invite" form={form} onFinish={onSubmit} onFinishFailed={onFailed}>
				<Form.Item name="emails">
					<Select
						style={{ width: 300 }}
						mode="tags"
						showArrow={false}
						onChange={handleChange}
						tokenSeparators={[",", " "]}
						options={defaultOptions}
						// maxTagCount="responsive"
						tagRender={(props) => renderTag(props as CustomTagProps)}
						dropdownRender={(menu) => <></>}
					/>
				</Form.Item>
				<Form.Item>
					<div className="grid grid-cols-2 gap-2">
						<Button type="primary" htmlType="submit" disabled={!canSubmit}>
							Invite
						</Button>
						<Button>Clear</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default InviteMember;
