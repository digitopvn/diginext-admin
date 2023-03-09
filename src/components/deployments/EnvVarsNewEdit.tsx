import { CloseOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Input, Space, Typography } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { useAppEnvVarsCreateApi, useAppSlugApi } from "@/api/api-app";
import type { KubeEnvironmentVariable } from "@/api/api-types";
import ManualSaveController from "@/commons/smart-form/ManualSaveController";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

const formatEnvVarName = (name: string) => {
	let formatName = name.replace(/\s+/g, "_");
	formatName = formatName.replace(/^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/gi, "");
	// console.log("formatName :>> ", `"${formatName}"`);
	return formatName.toUpperCase();
};

const EnvVarsNewEdit = () => {
	const [{ env, project: projectSlug, app: appSlug }] = useRouterQuery();

	const { closeDrawer } = useDrawerProvider();

	// frameworks
	// const useUpdateApi = useFrameworkUpdateApi({ filter: { id: app?._id } });
	const [createApi, createStatus] = useAppEnvVarsCreateApi();
	const { data: app = {} } = useAppSlugApi(appSlug, { populate: "project,owner,workspace" });

	const envVars = !isEmpty(app) ? (app.deployEnvironment || {})[env]?.envVars || [] : [];
	// console.log("envVars :>> ", envVars);

	const [_envVars, _setEnvVars] = useState(envVars);
	const [form] = Form.useForm();

	// This function to use for clearing forms
	const setEnvVars = (values: KubeEnvironmentVariable[] = []) => _setEnvVars([...values]);

	useEffect(() => setEnvVars(envVars), [JSON.stringify(envVars)]);

	const deleteEnvVarAtIndex = (index: number) =>
		_setEnvVars((_arr) => {
			_arr.splice(index, 1);
			return [..._arr];
		});

	const addEnvVar = (value: KubeEnvironmentVariable = { name: "", value: "" }) => _setEnvVars((_arr) => [..._arr, value]);

	const updateVarNameAtIndex = (index: number, name: string = "") => {
		_setEnvVars((_arr) =>
			_arr.map((v, i) => {
				if (i === index) return { name, value: v.value || "" };
				return v;
			})
		);
	};

	const updateVarValueAtIndex = (index: number, value: string = "") => {
		_setEnvVars((_arr) =>
			_arr.map((v, i) => {
				if (i === index) return { name: v.name || "", value };
				return v;
			})
		);
	};

	const onFinish = async (values: any) => {
		const postData = { envVars: JSON.stringify(_envVars), slug: appSlug, env };

		let result;
		// console.log("postData :>> ", postData);

		if (createApi) result = await createApi(postData);
		console.log("[CREATE_ENV_VARS] result :>> ", result);

		if (!isEmpty(result)) setEnvVars(result);

		// closeDrawer();
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			className="h-full overflow-auto p-6"
			layout="vertical"
			name={`deployEnvironment.${env}.envVars`}
			form={form}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			<Space className="w-full" direction="vertical" size="small">
				<Space.Compact block>
					<Typography.Text className="w-1/2">Name</Typography.Text>
					<Typography.Text className="w-1/2">Value</Typography.Text>
					<span className="w-[32px]" />
				</Space.Compact>

				{isEmpty(_envVars) && <Empty />}

				{(_envVars || []).map((envVar, index) => (
					<Space.Compact block key={`env-var-${index}`}>
						<Form.Item
							className="mb-0 w-1/2"
							name={[`envVars[${index}]`, "name"]}
							rules={[
								{ required: true, message: `Variable name is required` },
								{
									validator: (__, value) =>
										value.indexOf(" ") === -1
											? Promise.resolve()
											: Promise.reject(new Error("Variable name should not contain spacing.")),
								},
								{
									validator: (__, value) =>
										// eslint-disable-next-line no-useless-escape
										/[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/g.test(value) === false
											? Promise.resolve()
											: Promise.reject(new Error("Variable name should not contain special character.")),
								},
							]}
							initialValue={envVar.name}
						>
							<Input
								className="!flex-auto"
								placeholder={"NAME"}
								value={envVar.name}
								onChange={(e) => updateVarNameAtIndex(index, e.currentTarget.value)}
							/>
						</Form.Item>
						<Form.Item
							className="mb-0 w-1/2"
							name={[`envVars[${index}]`, "value"]}
							rules={[{ required: true, message: `Variable value is required` }]}
							initialValue={envVar.value}
						>
							<Input
								className="!flex-auto"
								placeholder={"VALUE"}
								value={envVar.value}
								onChange={(e) => updateVarValueAtIndex(index, e.currentTarget.value)}
							/>
						</Form.Item>
						<Button tabIndex={-1} icon={<CloseOutlined />} onClick={() => deleteEnvVarAtIndex(index)} />
					</Space.Compact>
				))}
			</Space>

			<div className="py-6">
				<Button onClick={() => addEnvVar()}>+ Add variable</Button>
			</div>

			<ManualSaveController name="envVars" apiStatus={createStatus} initialValue={envVars} setValue={setEnvVars} />
		</Form>
	);
};

export default EnvVarsNewEdit;
