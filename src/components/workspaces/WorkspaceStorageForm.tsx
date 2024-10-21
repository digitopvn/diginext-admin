import { LoadingOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Select } from "antd";
import React, { useEffect } from "react";

import { useTestWorkspaceUploadApi, useWorkspaceUpdateApi } from "@/api/api-workspace";
import { useWorkspace } from "@/providers/useWorkspace";

const CLOUD_STORAGE_PROVIDERS = ["cloudflare", "aws_s3", "do_space", "google"] as const;
export type CloudStorageProvider = (typeof CLOUD_STORAGE_PROVIDERS)[number];

export type ICloudStorage = {
	provider: CloudStorageProvider;
	/**
	 * Cloud storage bucket name
	 */
	bucket: string;
	/**
	 * Cloud storage region
	 */
	region: string;
	/**
	 * Object's origin endpoint url (no cache)
	 * eg: https://storage.googleapis.com
	 */
	endpoint: string;
	/**
	 * Object's origin base url (with cache)
	 * eg: https://cdn-your-domain.com
	 */
	baseUrl: string;
	/**
	 * Object's origin base path
	 * eg: /my-project
	 */
	basePath: string;
	/**
	 * Access key
	 */
	accessKey: string;
	/**
	 * Secret key
	 */
	secretKey: string;
};

export const WorkspaceStorageForm = () => {
	const workspace = useWorkspace();
	const { message } = App.useApp();
	const [form] = Form.useForm();

	const [workspaceUpdate, workspaceUpdateStatus] = useWorkspaceUpdateApi({ filter: { _id: workspace?._id }, enabled: !!workspace?._id });
	const [testWorkspaceUpload, testWorkspaceUploadStatus] = useTestWorkspaceUploadApi();
	const handleSubmit = async (values: ICloudStorage) => {
		console.log(values);

		try {
			await workspaceUpdate?.({ "settings.cloud_storage": values });
			message.success("Cloud storage updated successfully");
		} catch (e) {
			console.error(e);
			message.error("Failed to update cloud storage");
		}
	};

	const handleSubmitFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	useEffect(() => {
		// workspaceUpdate?.({ "settings.cloud_storage": "undefined" });
	}, []);

	return (
		<div>
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				className="max-w-xl"
				onFinish={handleSubmit}
				onFinishFailed={handleSubmitFailed}
			>
				<Form.Item
					label="Cloud Storage"
					name="provider"
					rules={[{ required: true, message: "Cloud Storage is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.provider}
				>
					<Select options={CLOUD_STORAGE_PROVIDERS.map((provider) => ({ label: provider, value: provider }))} />
				</Form.Item>

				<Form.Item
					label="Access Key"
					name="accessKey"
					rules={[{ required: true, message: "Access Key is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.accessKey}
				>
					<Input type="password" />
				</Form.Item>

				<Form.Item
					label="Secret Key"
					name="secretKey"
					rules={[{ required: true, message: "Secret Key is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.secretKey}
				>
					<Input type="password" />
				</Form.Item>

				<Form.Item
					label="Bucket"
					name="bucket"
					rules={[{ required: true, message: "Bucket is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.bucket}
				>
					<Input />
				</Form.Item>

				<Form.Item label="Region" name="region" initialValue={workspace?.settings?.cloud_storage?.region}>
					<Input />
				</Form.Item>

				<Form.Item
					label="Origin Endpoint"
					name="endpoint"
					rules={[{ required: true, message: "Origin Endpoint is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.endpoint}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Base URL"
					name="baseUrl"
					rules={[{ required: true, message: "Base URL is required" }]}
					initialValue={workspace?.settings?.cloud_storage?.baseUrl}
				>
					<Input />
				</Form.Item>

				<Form.Item label="Base Path" name="basePath" initialValue={workspace?.settings?.cloud_storage?.basePath ?? ""}>
					<Input />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						{workspaceUpdateStatus === "loading" ? (
							<>
								<LoadingOutlined /> Saving...
							</>
						) : (
							"Save"
						)}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
