import { PlusOutlined } from "@ant-design/icons";
import type { UseQueryResult } from "@tanstack/react-query";
import { Alert, App, Button, Form, Popconfirm, Skeleton, Space, theme } from "antd";
import _, { isEmpty } from "lodash";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { UseCreateApi, UseUpdateApi } from "@/api/api";
import type { ApiResponse } from "@/api/api-types";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

import SmartCodeEditor from "./SmartCodeEditor";
import type { SmartFormElementProps } from "./SmartFormTypes";
import SmartInput from "./SmartInput";
import SmartNumber from "./SmartNumber";
import SmartPassword from "./SmartPassword";
import SmartSelect from "./SmartSelect";
import SmartStringList from "./SmartStringList";
import SmartTextArea from "./SmartTextArea";

export type SmartFormProps<T> = {
	children?: ReactNode;
	className?: string;
	name: string;
	formType: "new" | "edit";
	slugKey?: string;
	api?: {
		useSlugApi?: UseQueryResult<T, Error>;
		useUpdateApi?: UseUpdateApi<T>;
		useCreateApi?: UseCreateApi<T>;
	};
	configs?: SmartFormElementProps[];
};

const { useApp } = App;

const SmartForm = <T extends object>(props: SmartFormProps<T>) => {
	const { children, className = "", formType, name, configs = [] } = props;

	const root = useApp();

	const { useSlugApi, useCreateApi, useUpdateApi } = props.api || {};
	const { data: item, status } = useSlugApi || {};
	const [updateApi, updateStatus] = useUpdateApi || [];
	const [createApi, createStatus] = useCreateApi || [];

	const [query, { deleteAllQueryKeys }] = useRouterQuery();
	// const slug = slugKey ? query[slugKey] : undefined;

	const [form] = Form.useForm<T>();
	const [fieldsStatus, setFieldsStatus] = useState<Record<string, "error" | "idle" | "loading" | "success" | undefined>>();

	const isNew = formType === "new";

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { closeDrawer } = useDrawerProvider();

	const [ready, setReady] = useState(false);
	useEffect(() => {
		if (status === "success") setReady(true);
	}, [status]);

	const onFinish = async (values: any) => {
		// console.log(isNew ? "[NEW]" : "[UPDATE]", "Submit:", values);
		const postData = { ...values };

		let result: ApiResponse<T | T[]> | undefined;
		if (isNew) {
			if (!createApi) return;

			Object.entries(postData).forEach(([field, value]) => {
				if (field.indexOf(".") > -1) {
					delete postData[field];
					_.set(postData, field, value);
				}
			});

			console.log("[NEW] Submit:", postData);

			result = await createApi(postData);
			console.log("[NEW] result :>> ", result);

			// if success
			if (result?.status) {
				root.notification.success({ message: "Congrats!", description: `Item has been created successfully.` });
				closeDrawer();
			}
		} else {
			if (!updateApi) return;
			if (!ready) return;
			const statuses: Record<string, "error" | "idle" | "loading" | "success" | undefined> = {};

			Object.entries(postData).forEach(([field, value]) => {
				if (item && value !== (item as any)[field]) {
					statuses[field] = "loading";
				} else {
					delete statuses[field];
					if (!configs.find((fieldConfig) => fieldConfig.name === field)?.alwaysSend) delete postData[field];
				}
			});
			console.log("[UPDATE] Submit:", postData);

			if (!isEmpty(statuses)) {
				result = await updateApi(postData);
				console.log("[UPDATE] result :>> ", result);

				Object.entries(postData).forEach(([field, value]) => {
					statuses[field] = result?.status === 0 ? "error" : "success";
				});

				// if success
				// if (result?.status) closeDrawer();
			} else {
				console.log("[UPDATE] Skipped, nothing new to update.");
			}

			console.log("statuses :>> ", statuses);
			setFieldsStatus(statuses);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className={`overflow-x-hidden p-6 pb-16 ${className}`}>
			{/* LOADING */}
			{status === "loading" && isNew === false && <Skeleton active />}
			{createStatus === "loading" && isNew === true && <Skeleton active />}
			{/* ERROR */}
			{((status === "error" && isNew === false) ||
				(status === "success" && isNew === false && (!item || (isEmpty((item as any).owner) && isEmpty((item as any).lastUpdatedBy))))) && (
				<Alert message="Unable to get data at the moment." type="error" showIcon />
			)}
			{createStatus === "error" && isNew === true && <Alert message="Unable to submit data at the moment." type="error" showIcon />}
			{/* INITIAL */}
			{((status === "success" && (!isEmpty((item as any).owner) || !isEmpty((item as any).lastUpdatedBy))) ||
				(isNew === true && createStatus !== "loading")) && (
				<Form
					className={["h-full", "overflow-x-hidden", className].join(" ")}
					layout="vertical"
					// name="edit"
					// initialValues={initialValues}
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					{configs.map((field) => {
						// console.log("field :>> ", field);
						switch (field.type) {
							case "input":
								return (
									<SmartInput
										key={`${name}-${field.name}`}
										{...field}
										value={field.value ?? (item ? _.get(item, field.name) : "")}
										status={fieldsStatus}
										isNew={isNew}
									/>
								);

							case "password":
								return (
									<SmartPassword
										key={`${name}-${field.name}`}
										{...field}
										value={field.value ?? (item ? _.get(item, field.name) : "")}
										status={fieldsStatus}
										isNew={isNew}
									/>
								);

							case "number":
								// console.log("field.name :>> ", field.name);
								// console.log("field.value :>> ", field.value);
								return (
									<SmartNumber
										key={`${name}-${field.name}`}
										{...field}
										value={field.value ?? (item ? _.get(item, field.name) : 0)}
										status={fieldsStatus}
										isNew={isNew}
									/>
								);

							case "textarea":
								return (
									<SmartTextArea
										key={`${name}-${field.name}`}
										{...field}
										value={field.value ?? (item ? _.get(item, field.name) : "")}
										status={fieldsStatus}
										isNew={isNew}
									/>
								);

							case "code-editor":
								console.log("field.value :>> ", field.value);
								console.log("_.get(item, field.name) :>> ", _.get(item, field.name));
								return (
									<SmartCodeEditor
										key={`${name}-${field.name}`}
										{...field}
										value={field.value ?? (item ? _.get(item, field.name) : "")}
										status={fieldsStatus}
										isNew={isNew}
									/>
									// <SmartTextArea
									// 	key={`${name}-${field.name}`}
									// 	{...field}
									// 	value={field.value ?? (item ? _.get(item, field.name) : "")}
									// 	status={fieldsStatus}
									// 	isNew={isNew}
									// />
								);

							case "select": {
								// let { displayKey } = field;
								// if (typeof displayKey === "undefined") displayKey = "name";

								const selectedValue = _.get(item, field.name);

								return (
									<SmartSelect
										key={`${name}-${field.name}`}
										{...field}
										style={{ flex: "auto", ...field?.style }}
										value={selectedValue}
										status={fieldsStatus}
										isNew={isNew}
									/>
								);
							}

							case "list_string":
								// console.log("field.name :>> ", field.name);
								// console.log("field.value :>> ", field.value);
								// eslint-disable-next-line no-case-declarations
								const strArr = field.value ?? (item ? _.get(item, field.name) : []) ?? [];
								return (
									<SmartStringList key={`${name}-${field.name}`} {...field} value={strArr} status={fieldsStatus} isNew={isNew} />
								);

							default:
								return null;
						}
					})}

					{children}

					{isNew && (
						<div className="absolute bottom-0 left-0 w-full px-6 py-3" style={{ backgroundColor: colorBgContainer }}>
							<Space align="center">
								<Form.Item style={{ marginBottom: 0 }}>
									<Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
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
			)}
		</div>
	);
};

export default SmartForm;
