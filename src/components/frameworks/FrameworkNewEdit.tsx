import { Button, Form, Space, theme, Typography } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { useAuth } from "@/api/api-auth";
import { useFrameworkCreateApi, useFrameworkSlugApi, useFrameworkUpdateApi } from "@/api/api-framework";
import type { IFramework } from "@/api/api-types";
import SmartInput from "@/commons/smart-form/SmartInput";
import SmartSelect from "@/commons/smart-form/SmartSelect";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";
import { useGitProviderListApi } from "@/api/api-git-provider";

const { Text } = Typography;

type FrameworkNewEditProps = { data?: IFramework; isNew?: boolean };

const FrameworkNewEdit = (props: FrameworkNewEditProps = {}) => {
	const { data } = props;

	const [user, reload] = useAuth();

	const { drawerVisibility } = useDrawerProvider();
	const [, { deleteQuery }] = useRouterQuery();

	const [form] = Form.useForm<IFramework>();
	const [fieldsStatus, setFieldsStatus] = useState();

	const [{ framework_slug }] = useRouterQuery();

	// frameworks
	const { data: framework } = useFrameworkSlugApi(framework_slug, { populate: "owner,provider" });
	const [updateApi, updateStatus] = useFrameworkUpdateApi({ filter: { id: framework?._id } });
	const [createApi, createStatus] = useFrameworkCreateApi();
	// console.log("framework :>> ", framework);

	// gitProviders
	const { data: { list: gitProviders = [] } = {} } = useGitProviderListApi();
	console.log("gitProviders :>> ", gitProviders);

	const isNew = typeof framework === "undefined";

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { closeDrawer } = useDrawerProvider();

	const onFinish = async (values: any) => {
		console.log(isNew ? "[NEW]" : "[UPDATE]", "Submit:", values);
		const postData = { ...values };

		let result: IFramework | undefined;
		if (isNew) {
			result = await createApi(postData);
			console.log("[NEW] result :>> ", result);

			closeDrawer();
		} else {
			const statuses: any = {};
			Object.entries(postData).forEach(([field, value]) => {
				if (framework && value !== (framework as any)[field]) {
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
	// 	if (drawerVisibility?.lv1 === false) deleteQuery(["type", "framework_slug"]);
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
				<SmartInput
					label="Framework name"
					name="name"
					placeholder="My Starter Template"
					value={framework?.name}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartSelect
					label="Git Provider"
					name="git"
					value={framework?.git?._id}
					style={{ width: 250 }}
					options={gitProviders.map((gitProvider) => {
						return { label: gitProvider.name || "", value: gitProvider._id };
					})}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartInput
					label="Repository HTTPS URL"
					name="repoURL"
					placeholder="https://github.com/user/repo.git"
					value={framework?.repoURL}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartInput
					label="Repository SSH URL"
					name="repoSSH"
					placeholder="git@github.com:user/repo.git"
					value={framework?.repoSSH}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartInput
					label="Main branch"
					name="mainBranch"
					value={framework?.mainBranch}
					placeholder="main"
					status={fieldsStatus}
					isNew={isNew}
				/>
			</div>

			<div className="fixed bottom-0 w-full px-6 py-3" style={{ backgroundColor: colorBgContainer }}>
				<Space>
					<Form.Item style={{ marginBottom: 0 }}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
					<Button type="primary" danger>
						Discard
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default FrameworkNewEdit;
