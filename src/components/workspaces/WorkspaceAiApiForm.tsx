import { LoadingOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Switch } from "antd";
import React, { useState } from "react";
import * as z from "zod";

import { useWorkspaceUpdateApi } from "@/api/api-workspace";
import { useWorkspace } from "@/providers/useWorkspace";

// Zod schema for AI API form validation
const aiApiSchema = z.object({
	enabled: z.boolean(),
	model: z.string().optional(),
	apiBaseUrl: z.string().url({ message: "Invalid URL format" }).optional(),
	apiKey: z.string().optional(),
});

export type IAiApi = z.infer<typeof aiApiSchema>;

export const WorkspaceAiApiForm = () => {
	const workspace = useWorkspace();
	const { message } = App.useApp();
	const [form] = Form.useForm<IAiApi>();

	// Use state for enabled flag
	const [isEnabled, setIsEnabled] = useState(workspace?.settings?.ai?.enabled ?? false);

	const [workspaceUpdate, workspaceUpdateStatus] = useWorkspaceUpdateApi({
		filter: { _id: workspace?._id },
		enabled: !!workspace?._id,
	});

	const onSubmit = async (values: IAiApi) => {
		console.log("WorkspaceAiApiForm > handleSubmit > values :>>", values);

		try {
			await workspaceUpdate?.({ "settings.ai": { ...values, enabled: isEnabled } });
			message.success("AI API settings updated successfully");
		} catch (e) {
			console.error(e);
			message.error("Failed to update AI API settings");
		}
	};

	return (
		<div>
			<Form
				form={form}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				className="max-w-xl"
				onFinish={onSubmit}
				initialValues={{
					model: workspace?.settings?.ai?.model,
					apiBaseUrl: workspace?.settings?.ai?.apiBaseUrl,
					apiKey: workspace?.settings?.ai?.apiKey,
				}}
			>
				<Form.Item name="enabled" label="Enable AI">
					<Switch checked={isEnabled} onChange={(checked) => setIsEnabled(checked)} />
				</Form.Item>

				<Form.Item
					name="model"
					label="AI Model"
					rules={[
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!isEnabled) {
									return Promise.resolve();
								}
								if (!value) {
									return Promise.reject(new Error("AI Model is required when enabled"));
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<Input placeholder="Enter AI model (e.g., gpt-3.5-turbo)" disabled={!isEnabled} />
				</Form.Item>

				<Form.Item
					name="apiBaseUrl"
					label="API Base URL"
					rules={[
						{ type: "url", message: "Invalid URL format" },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!isEnabled) {
									return Promise.resolve();
								}
								if (!value) {
									return Promise.reject(new Error("API Base URL is required when enabled"));
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<Input placeholder="https://api.openai.com/v1" disabled={!isEnabled} />
				</Form.Item>

				<Form.Item
					name="apiKey"
					label="API Key"
					rules={[
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!isEnabled) {
									return Promise.resolve();
								}
								if (!value) {
									return Promise.reject(new Error("API Key is required when enabled"));
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<Input type="password" placeholder="Enter your AI API key" disabled={!isEnabled} />
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
