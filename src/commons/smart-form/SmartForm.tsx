import type { UseQueryResult } from "@tanstack/react-query";
import { Button, Form, Popconfirm, Space, theme } from "antd";
import _, { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import type { UseCreateApi, UseUpdateApi } from "@/api/api";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

import SmartCodeEditor from "./SmartCodeEditor";
import type { SmartFormElementProps } from "./SmartFormTypes";
import SmartInput from "./SmartInput";
import SmartSelect from "./SmartSelect";
import SmartTextArea from "./SmartTextArea";

export type SmartFormProps<T> = {
	name: string;
	slugKey?: string;
	api?: {
		useSlugApi?: UseQueryResult<T, Error>;
		useUpdateApi?: UseUpdateApi<T>;
		useCreateApi?: UseCreateApi<T>;
	};
	configs?: SmartFormElementProps[];
};

const SmartForm = <T extends object>(props: SmartFormProps<T>) => {
	const { name, configs = [] } = props;

	const { data: item } = props.api?.useSlugApi || {};

	const { useCreateApi, useUpdateApi } = props.api || {};
	const [updateApi, updateStatus] = useUpdateApi || [];
	const [createApi, createStatus] = useCreateApi || [];

	const [query, { deleteAllQueryKeys }] = useRouterQuery();
	// const slug = slugKey ? query[slugKey] : undefined;

	const [form] = Form.useForm<T>();
	const [fieldsStatus, setFieldsStatus] = useState();

	const isNew = typeof item === "undefined";

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { closeDrawer } = useDrawerProvider();

	const onFinish = async (values: any) => {
		console.log(isNew ? "[NEW]" : "[UPDATE]", "Submit:", values);
		const postData = { ...values };

		let result: T | undefined;
		if (isNew) {
			Object.entries(postData).forEach(([field, value]) => {
				if (field.indexOf(".") > -1) {
					delete postData[field];
					_.set(postData, field, value);
				}
			});

			if (createApi) result = await createApi(postData);
			console.log("[NEW] result :>> ", result);

			closeDrawer();
		} else {
			const statuses: any = {};
			Object.entries(postData).forEach(([field, value]) => {
				if (item && value !== (item as any)[field]) {
					statuses[field] = "loading";
				} else {
					delete statuses[field];
					delete postData[field];
				}
			});

			console.log("statuses :>> ", statuses);
			setFieldsStatus(statuses);

			if (!isEmpty(statuses)) {
				if (updateApi) result = await updateApi(postData);
				console.log("[UPDATE] result :>> ", result);
			} else {
				console.log("[UPDATE] Skipped, nothing new to update.");
			}
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

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
				{configs.map((field) => {
					switch (field.type) {
						case "input":
							return (
								<SmartInput
									key={`${name}-${field.name}`}
									{...field}
									value={item && _.get(item, field.name)}
									status={fieldsStatus}
									isNew={isNew}
								/>
							);

						case "textarea":
							return (
								<SmartTextArea
									key={`${name}-${field.name}`}
									{...field}
									value={item && _.get(item, field.name)}
									status={fieldsStatus}
									isNew={isNew}
								/>
							);

						case "code-editor":
							return (
								<SmartCodeEditor
									key={`${name}-${field.name}`}
									{...field}
									value={item && _.get(item, field.name)}
									status={fieldsStatus}
									isNew={isNew}
								/>
							);

						case "select":
							return (
								<SmartSelect
									key={`${name}-${field.name}`}
									{...field}
									style={{ minWidth: 300, ...field?.style }}
									value={item && _.get(item, `${field.name}._id`)}
									status={fieldsStatus}
									isNew={isNew}
								/>
							);

						default:
							return null;
					}
				})}
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

export default SmartForm;
