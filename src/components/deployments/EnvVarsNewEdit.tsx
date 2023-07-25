import { CloseOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Form, Input, notification, Skeleton, Space, Typography } from "antd";
import { isNumberString } from "class-validator";
import { isArray, isEmpty, uniqueId } from "lodash";
import { useEffect, useState } from "react";

import { useAppEnvVarsUpdateApi, useAppSlugApi } from "@/api/api-app";
import type { KubeEnvironmentVariable } from "@/api/api-types";
import ManualSaveController from "@/commons/smart-form/ManualSaveController";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const formatEnvVarName = (name: string) => {
	let formatName = name.replace(/\s+/g, "_");
	formatName = formatName.replace(/^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/gi, "");
	// console.log("formatName :>> ", `"${formatName}"`);
	return formatName.toUpperCase();
};

interface DisplayEnvVar extends KubeEnvironmentVariable {
	id: string;
}

const EnvVarsNewEdit = () => {
	const [{ env, project: projectSlug, app: appSlug }] = useRouterQuery();

	// const [createApi, createStatus] = useAppEnvVarsCreateApi();
	const [updateApi, updateApiStatus] = useAppEnvVarsUpdateApi();
	const { data: app = {}, status } = useAppSlugApi(appSlug, { populate: "project,owner,workspace" });

	const envVars = !isEmpty(app) ? (app.deployEnvironment || {})[env]?.envVars || [] : [];

	const [_envVars, _setEnvVars] = useState<DisplayEnvVar[]>([]);
	const [form] = Form.useForm();

	// This function to use for clearing forms
	const setEnvVars = (values: DisplayEnvVar[] = []) => _setEnvVars([...values]);

	useEffect(() => {
		const initialEnvVars: DisplayEnvVar[] = [];
		if (isArray(envVars)) {
			initialEnvVars.push(...envVars.map((envVar, i) => ({ id: uniqueId(), ...envVar })));
		} else if (!isArray(envVars) && typeof envVars[0] !== "undefined") {
			// sometime the "envVars" is an {Object}...
			Object.entries(envVars).forEach(([, val]) => {
				if ((val as any).name && (val as any).value) {
					const envVar: DisplayEnvVar = { id: uniqueId(), name: (val as any).name, value: (val as any).value };
					initialEnvVars.push(envVar);
				}
			});
		}

		// console.log("envVars :>> ", envVars);
		// console.log("initialEnvVars :>> ", initialEnvVars);

		setEnvVars(initialEnvVars);
	}, [JSON.stringify(envVars)]);

	// useEffect(() => console.log("_envVars :>> ", _envVars), [_envVars]);

	const isVarNameExisted = (name: string) => {
		const count = _envVars.filter((_var) => _var.name === name).length;
		return count > 1;
	};

	const deleteEnvVarByID = (id: string) => _setEnvVars((_arr) => _arr.filter((item, i) => id !== item.id));

	const addEnvVarField = (value: DisplayEnvVar = { id: uniqueId(), name: "", value: "" }) => _setEnvVars((_arr) => [..._arr, value]);

	const updateVarNameByID = (id: string, name: string = "") => {
		_setEnvVars((_arr) =>
			_arr.map((v, i) => {
				if (v.id === id) return { id, name, value: v.value || "" };
				return v;
			})
		);
	};

	const updateVarValueByID = (id: string, value: string = "") => {
		_setEnvVars((_arr) =>
			_arr.map((v, i) => {
				if (v.id === id) return { id, name: v.name || "", value };
				return v;
			})
		);
	};

	/**
	 * Submit the form
	 */
	const onFinish = async (values: any) => {
		let result;
		// console.log("_envVars :>> ", _envVars);

		// validate
		try {
			_envVars.forEach((envVar) => {
				if (isEmpty(envVar.name)) throw new Error(`Variable's name should not be empty`);
				if (isNumberString(envVar.name)) throw new Error(`Variable's name (${envVar.name}) should not be a number`);
				if (isVarNameExisted(envVar.name)) throw new Error(`Variable's name (${envVar.name}) should be unique.`);
			});

			// if (createApi) result = await createApi(postData);
			if (updateApi && app.slug) result = await updateApi({ slug: app.slug, env, envVars: _envVars });
			// console.log("[UPDATE_ENV_VARS] result :>> ", result);
		} catch (e: any) {
			notification.error({ message: e.toString() });
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<>
			{status === "loading" && <Skeleton active />}
			{status === "error" && <Alert message="Unable to get data at the moment." type="error" showIcon />}
			{status === "success" && (
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
							<Space.Compact block key={`env-var-${envVar.id}`}>
								<Input
									key={`env-var-name-input-${envVar.id}`}
									className="!flex-auto"
									placeholder="NAME"
									status={isEmpty(envVar.name) || isNumberString(envVar.name) || isVarNameExisted(envVar.name) ? "error" : ""}
									value={envVar.name}
									onChange={(e) => (e.currentTarget.value ? updateVarNameByID(envVar.id, e.currentTarget.value) : null)}
								/>
								<Input
									key={`env-var-value-input-${envVar.id}`}
									className="!flex-auto"
									placeholder="VALUE"
									value={envVar.value}
									onChange={(e) => updateVarValueByID(envVar.id, e.currentTarget.value)}
								/>
								<Button tabIndex={-1} icon={<CloseOutlined />} onClick={() => deleteEnvVarByID(envVar.id)} />
							</Space.Compact>
						))}
					</Space>

					<div className="py-6">
						<Button onClick={() => addEnvVarField()}>+ Add variable</Button>
					</div>

					<ManualSaveController name="envVars" apiStatus={updateApiStatus} initialValue={envVars} setValue={setEnvVars} />
				</Form>
			)}
		</>
	);
};

export default EnvVarsNewEdit;
