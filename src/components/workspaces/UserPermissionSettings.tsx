import { App, Button, Form, Select, Typography } from "antd";
import React from "react";

import { useAppListApi } from "@/api/api-app";
import { useCloudDatabaseListApi } from "@/api/api-cloud-database";
import { useClusterListApi } from "@/api/api-cluster";
import { useFrameworkListApi } from "@/api/api-framework";
import { useGitProviderListApi } from "@/api/api-git-provider";
import { useProjectListApi } from "@/api/api-project";
import { useContainerRegistryListApi } from "@/api/api-registry";
import type { IUser } from "@/api/api-types";
import { useUserUpdatePermissionsApi } from "@/api/api-user";
import { useRouterQuery } from "@/plugins/useRouterQuery";

export interface UserPermissionProps {
	user?: IUser;
}

const UserPermissionSettings = (props?: UserPermissionProps) => {
	const { user } = props || {};

	// context
	const { notification } = App.useApp();
	const [{ user: userSlug }] = useRouterQuery();

	// projects
	const { data: projectResponse } = useProjectListApi({ pagination: { page: 1, size: 1000 } });
	const { list: projects = [] } = projectResponse || {};

	// apps
	const { data: appResponse } = useAppListApi({ pagination: { page: 1, size: 1000 } });
	const { list: apps = [] } = appResponse || {};

	// gits
	const { data: gitResponse } = useGitProviderListApi({ pagination: { page: 1, size: 1000 } });
	const { list: gits = [] } = gitResponse || {};

	// frameworks
	const { data: frameworkResponse } = useFrameworkListApi({ pagination: { page: 1, size: 1000 } });
	const { list: frameworks = [] } = frameworkResponse || {};

	// clusters
	const { data: clusterResponse } = useClusterListApi({ pagination: { page: 1, size: 1000 } });
	const { list: clusters = [] } = clusterResponse || {};

	// databases
	const { data: databaseResponse } = useCloudDatabaseListApi({ pagination: { page: 1, size: 1000 } });
	const { list: databases = [] } = databaseResponse || {};

	// registries
	const { data: registriesResponse } = useContainerRegistryListApi({ pagination: { page: 1, size: 1000 } });
	const { list: registries = [] } = registriesResponse || {};

	// API
	const [updateApi, updateStatus] = useUserUpdatePermissionsApi();

	// handlers
	const handleSubmitOk = (values: any) => {
		if (!userSlug) return;

		// console.log("values :>> ", values);
		const updateData: { resource: { [name: string]: string }; userSlug: string } = {
			userSlug,
			resource: {},
		};
		Object.entries(values).forEach(([key, val]) => {
			if (val) updateData.resource[key] = (val as string[]).join(",");
		});
		console.log("updateData :>> ", updateData);

		updateApi(updateData)?.then(() => {
			notification.success({ message: `User's access permissions have been updated.` });
		});
	};

	const handleSubmitFailed = (e: any) => {
		console.error(e);
	};

	return (
		<div className="px-6">
			<Typography.Title level={4}>Access Permissions</Typography.Title>
			<Form name="access-permissions" layout="vertical" onFinishFailed={handleSubmitFailed} onFinish={handleSubmitOk}>
				<Form.Item className="mb-2" name="projects" label="Projects" initialValue={user?.allowAccess?.projects} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select projects"
						options={projects?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
						// tagRender={({ label, value, closable, onClose }) => (
						// 	<Tag color="blue" closable={closable} onClose={onClose}>
						// 		{label}
						// 	</Tag>
						// )}
					/>
				</Form.Item>
				<Form.Item className="mb-2" name="apps" label="Apps" initialValue={user?.allowAccess?.apps} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select apps"
						options={apps?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>
				<Form.Item className="mb-2" name="gits" label="Gits" initialValue={user?.allowAccess?.gits} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select gits"
						options={gits?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>
				<Form.Item className="mb-2" name="frameworks" label="Frameworks" initialValue={user?.allowAccess?.frameworks} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select frameworks"
						options={frameworks?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>
				<Form.Item className="mb-2" name="clusters" label="Clusters" initialValue={user?.allowAccess?.clusters} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select clusters"
						options={clusters?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>
				<Form.Item className="mb-2" name="databases" label="Databases" initialValue={user?.allowAccess?.databases} shouldUpdate>
					<Select
						mode="multiple"
						placeholder="Please select databases"
						options={databases?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>
				<Form.Item
					className="mb-2"
					name="container_registries"
					label="Container Registries"
					initialValue={user?.allowAccess?.container_registries}
					shouldUpdate
				>
					<Select
						mode="multiple"
						placeholder="Please select container registries"
						options={registries?.map((item) => ({ label: `${item.name} (${item.slug})`, value: item._id }))}
					/>
				</Form.Item>

				<div className="flex gap-2">
					<Form.Item noStyle>
						<Button htmlType="submit" type="primary">
							Save
						</Button>
					</Form.Item>
					<Button danger>Reset permissions</Button>
				</div>
			</Form>
		</div>
	);
};

export default UserPermissionSettings;
