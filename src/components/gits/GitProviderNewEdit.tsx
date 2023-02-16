import { Button, Form, Popconfirm, Space, theme, Typography } from "antd";
import _, { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { useAuth } from "@/api/api-auth";
import { useGitProviderCreateApi, useGitProviderSlugApi, useGitProviderUpdateApi } from "@/api/api-git-provider";
import type { IGitProvider } from "@/api/api-types";
import SmartInput from "@/commons/smart-form/SmartInput";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const { Text } = Typography;

type GitProviderNewEditProps = { data?: IGitProvider; isNew?: boolean };

const GitProviderNewEdit = (props: GitProviderNewEditProps = {}) => {
	const { data } = props;

	const [user, reload] = useAuth();

	const { drawerVisibility } = useDrawerProvider();
	const [, { deleteAllQueryKeys }] = useRouterQuery();

	const [form] = Form.useForm<IGitProvider>();
	const [fieldsStatus, setFieldsStatus] = useState();

	const [{ git_provider_slug }] = useRouterQuery();

	// gitProviders
	const { data: gitProvider } = useGitProviderSlugApi(git_provider_slug, { populate: "owner" });
	const [updateApi, updateStatus] = useGitProviderUpdateApi({ filter: { id: gitProvider?._id } });
	const [createApi, createStatus] = useGitProviderCreateApi();
	// console.log("gitProvider :>> ", gitProvider);

	const isNew = typeof gitProvider === "undefined";

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { closeDrawer } = useDrawerProvider();

	const onFinish = async (values: any) => {
		console.log(isNew ? "[NEW]" : "[UPDATE]", "Submit:", values);
		const postData = { ...values };

		let result: IGitProvider | undefined;
		if (isNew) {
			Object.entries(postData).forEach(([field, value]) => {
				if (field.indexOf(".") > -1) {
					delete postData[field];
					_.set(postData, field, value);
				}
			});
			result = await createApi(postData);
			console.log("[NEW] result :>> ", result);

			closeDrawer();
		} else {
			const statuses: any = {};
			Object.entries(postData).forEach(([field, value]) => {
				if (gitProvider && value !== (gitProvider as any)[field]) {
					statuses[field] = "loading";
				} else {
					delete statuses[field];
					delete postData[field];
				}
			});

			console.log("statuses :>> ", statuses);
			setFieldsStatus(statuses);

			if (!isEmpty(statuses)) {
				result = await updateApi(postData);
				console.log("[UPDATE] result :>> ", result);
			} else {
				console.log("[UPDATE] Skipped, nothing new to update.");
			}
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	// clear URL query when closing the drawer
	// useEffect(() => {
	// 	if (drawerVisibility?.lv1 === false) deleteQuery(["type", "gitProvider_slug"]);
	// }, [drawerVisibility?.lv1]);

	useEffect(() => {
		if (typeof fieldsStatus === "undefined") return;
		// console.log("fieldsStatus :>> ", fieldsStatus);
		const fields = Object.keys(fieldsStatus);
		const statuses: any = {};
		fields.forEach((field) => {
			statuses[field] = updateStatus;
		});
		setFieldsStatus(statuses);
	}, [updateStatus]);

	return (
		<Form
			className="h-full overflow-auto"
			layout="vertical"
			// name="edit"
			// initialValues={initialValues}
			form={form}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<div className="p-6 pb-16">
				<SmartInput label="Name" name="name" placeholder="Github" value={gitProvider?.name} status={fieldsStatus} isNew={isNew} />

				<SmartInput label="Host" name="host" placeholder="github.com" value={gitProvider?.host} status={fieldsStatus} isNew={isNew} />

				<SmartInput
					label="Workspace"
					name="gitWorkspace"
					placeholder="your-team-workspace-here"
					value={gitProvider?.gitWorkspace}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartInput
					label="Workspace URL"
					name="repo.url"
					value={gitProvider?.repo?.url}
					placeholder="https://github.com/your-team-workspace-here"
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartInput
					label="Workspace SSH Prefix"
					name="repo.sshPrefix"
					value={gitProvider?.repo?.sshPrefix}
					placeholder="git@github.com:your-team-workspace-here"
					status={fieldsStatus}
					isNew={isNew}
				/>
			</div>

			{isNew && (
				<div className="fixed bottom-0 w-full px-6 py-3" style={{ backgroundColor: colorBgContainer }}>
					<Space>
						<Form.Item style={{ marginBottom: 0 }}>
							<Button type="primary" htmlType="submit">
								Submit
							</Button>
						</Form.Item>
						<Popconfirm title="Are you sure?" onConfirm={() => deleteAllQueryKeys()} okText="Yes" cancelText="No">
							<Button type="primary" danger>
								Discard
							</Button>
						</Popconfirm>
					</Space>
				</div>
			)}
		</Form>
	);
};

export default GitProviderNewEdit;
