import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Select, Space } from "antd";
import React, { useEffect } from "react";

import { useClusterListApi } from "@/api/api-cluster";
import type { DeployBuildV2Result } from "@/api/api-deploy";
import { usePromoteDeployEnvironmentApi } from "@/api/api-deploy";
import type { ApiResponse, IApp } from "@/api/api-types";

const PromoteDeployEnvironmentModal = (props: {
	app: IApp;
	fromEnv: string;
	toEnv?: string;
	next?: (data?: ApiResponse<DeployBuildV2Result>) => void;
}) => {
	const { app, fromEnv, toEnv, next } = props;

	const antdApp = App.useApp();
	const { notification } = antdApp;

	const targetDeployEnv = toEnv ? app.deployEnvironment?.[toEnv] : undefined;
	const _allEnvs = Object.keys(app.deployEnvironment || {});

	// FIXME: page size -> all or pagination?
	// fetch clusters
	const { data: dataCluster, status: clusterListApiStatus } = useClusterListApi({ pagination: { size: 50 } });
	const { list: clusters } = dataCluster || {};

	const [promoteToDeployEnvApi, promoteToEnvApiStatus] = usePromoteDeployEnvironmentApi();
	const [selectedCluster, setSelectedCluster] = React.useState<string | undefined>();
	const [targetEnv, setTargetEnv] = React.useState<string>(toEnv || "");
	const [allEnvs, setAllEnvs] = React.useState<string[]>(_allEnvs);

	const onFinish = async (values: any) => {
		console.log("PromoteDeployEnvironmentModal > Submit:", values);

		const response = await promoteToDeployEnvApi({
			appSlug: app.slug!,
			fromEnv,
			env: toEnv || values.newEnv || values.toEnv,
			clusterSlug: values.cluster,
		});

		console.log("PromoteDeployEnvironmentModal > Response :>> ", response);

		if (response.status) {
			notification.success({
				message: "Successfully!",
				description: `App has been promoted to ${toEnv} environment.`,
			});
		}

		if (next) next(response);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
		// notification.error({
		// 	message: "Promote deploy environment failed",
		// 	description: errorInfo.errorFields[0]?.errors[0],
		// });
	};

	useEffect(() => {
		if (clusterListApiStatus === "success") {
			const targetCluster = clusters?.find((item) => item.slug === targetDeployEnv?.cluster);
			setSelectedCluster(targetCluster?.slug);
		}
	}, [clusterListApiStatus]);

	return (
		<Form
			name="promote-deploy-environment"
			style={{ width: "100%", maxWidth: 600 }}
			layout="vertical"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
			preserve={false}
		>
			{!toEnv && (
				<Space>
					<Form.Item
						label="Select a target deploy environment"
						name="toEnv"
						// rules={[{ required: true, message: "Please select a target deploy environment." }]}
						// initialValue={targetEnv}
					>
						<Select
							showSearch
							disabled={targetEnv !== ""}
							size="large"
							placeholder="Select a target deploy environment"
							filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
							onSelect={(value) => console.log(`Selected "${value}"`)}
							options={(allEnvs || []).map((item) => ({
								label: item,
								value: item,
							}))}
						/>
					</Form.Item>
					<Form.Item label="New deploy environment" name="newEnv">
						<Input
							size="large"
							onChange={(e) => {
								setTargetEnv(e.currentTarget.value);
							}}
						/>
					</Form.Item>
				</Space>
			)}
			<Form.Item
				label="Select target cluster"
				name="cluster"
				rules={[{ required: true, message: "Please select your cluster." }]}
				initialValue={selectedCluster}
				required
			>
				<Select
					showSearch
					size="large"
					placeholder="Select target cluster"
					filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
					defaultValue={selectedCluster}
					options={clusters?.map((item) => ({
						label: item.name,
						value: item.slug,
					}))}
				/>
			</Form.Item>

			<Form.Item noStyle>
				<Button
					type="primary"
					size="large"
					htmlType="submit"
					style={{ width: "100%" }}
					icon={promoteToEnvApiStatus === "success" ? <CheckOutlined /> : <ArrowRightOutlined />}
					loading={promoteToEnvApiStatus === "loading"}
				>
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default PromoteDeployEnvironmentModal;
