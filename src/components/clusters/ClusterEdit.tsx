import { Button, Form, Space, theme } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { useAuth } from "@/api/api-auth";
import { useClusterCreateApi, useClusterSlugApi, useClusterUpdateApi } from "@/api/api-cluster";
import type { ICluster } from "@/api/api-types";
import SmartCodeEditor from "@/commons/smart-form/SmartCodeEditor";
import SmartInput from "@/commons/smart-form/SmartInput";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";
import SmartTextArea from "@/commons/smart-form/SmartTextArea";
import SmartSelect from "@/commons/smart-form/SmartSelect";
import { useCloudProviderListApi } from "@/api/api-cloud-provider";

type ClusterEditProps = { data?: ICluster; isNew?: boolean };

const ClusterEdit = (props: ClusterEditProps = {}) => {
	const { data } = props;

	const [user, reload] = useAuth();

	const { drawerVisibility } = useDrawerProvider();
	const [, { deleteQuery }] = useRouterQuery();

	const [form] = Form.useForm<ICluster>();
	const [fieldsStatus, setFieldsStatus] = useState();

	const [{ cluster_slug }] = useRouterQuery();

	// clusters
	const { data: cluster } = useClusterSlugApi(cluster_slug, { populate: "owner,provider" });
	const [updateApi, updateStatus] = useClusterUpdateApi({ filter: { id: cluster?._id } });
	const [createApi, createStatus] = useClusterCreateApi();
	// console.log("cluster :>> ", cluster);

	// providers
	const { data: { list: providers = [] } = {} } = useCloudProviderListApi();
	console.log("providers :>> ", providers);

	const isNew = typeof cluster === "undefined";

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { closeDrawer } = useDrawerProvider();

	const onFinish = async (values: any) => {
		console.log(isNew ? "[NEW]" : "[UPDATE]", "Submit:", values);
		const postData = { ...values };

		let result: ICluster | undefined;
		if (isNew) {
			result = await createApi(postData);
			console.log("[NEW] result :>> ", result);

			closeDrawer();
		} else {
			const statuses: any = {};
			Object.entries(postData).forEach(([field, value]) => {
				if (cluster && value !== (cluster as any)[field]) {
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
	// 	if (drawerVisibility?.lv1 === false) deleteQuery(["type", "cluster_slug"]);
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
				<SmartInput label="Cluster name" name="name" value={cluster?.name} status={fieldsStatus} isNew={isNew} />
				<SmartInput label="Short name" name="shortName" value={cluster?.shortName} status={fieldsStatus} isNew={isNew} />

				<SmartSelect
					isNew={isNew}
					style={{ width: 250 }}
					label="Cloud Provider"
					name="provider"
					value={cluster?.provider?._id}
					options={providers.map((provider) => {
						return { label: provider.name || "", value: provider._id };
					})}
					status={fieldsStatus}
				/>

				<SmartInput label="Primary IP" name="primaryIP" value={cluster?.primaryIP} status={fieldsStatus} isNew={isNew} />
				<SmartInput label="Primary domain" name="primaryDomain" value={cluster?.primaryDomain} status={fieldsStatus} isNew={isNew} />
				<SmartInput label="Project ID (Google)" name="projectID" value={cluster?.projectID} status={fieldsStatus} isNew={isNew} />
				<SmartInput label="Region (Google)" name="region" value={cluster?.region} status={fieldsStatus} isNew={isNew} />
				<SmartInput label="Zone (Google)" name="zone" value={cluster?.zone} status={fieldsStatus} isNew={isNew} />

				<SmartCodeEditor
					lang={["yaml"]}
					label="KubeConfig (YAML)"
					name="kubeConfig"
					value={cluster?.kubeConfig}
					initialValue={cluster?.kubeConfig}
					status={fieldsStatus}
					isNew={isNew}
				/>

				<SmartTextArea
					isNew={isNew}
					label="API Access Token"
					name="apiAccessToken"
					value={cluster?.apiAccessToken}
					initialValue={cluster?.apiAccessToken}
					status={fieldsStatus}
				/>

				<SmartCodeEditor
					lang={["json"]}
					label="Service Account (JSON)"
					name="serviceAccount"
					value={cluster?.serviceAccount}
					initialValue={cluster?.serviceAccount}
					status={fieldsStatus}
					isNew={isNew}
				/>
			</div>

			<div className="fixed bottom-0 px-6 py-3 w-full" style={{ backgroundColor: colorBgContainer }}>
				<Space>
					<Form.Item>
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

export default ClusterEdit;
