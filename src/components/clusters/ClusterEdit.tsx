import { Form } from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "@/api/api-auth";
import { useClusterCreateApi, useClusterSlugApi, useClusterUpdateApi } from "@/api/api-cluster";
import type { ICluster } from "@/api/api-types";
import AutoSendInput from "@/commons/auto-form/AutoSendInput";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useDrawerProvider } from "@/providers/DrawerProvider";

type ClusterEditProps = { data?: ICluster; isNew?: boolean };

const ClusterEdit = (props: ClusterEditProps = {}) => {
	const { data } = props;

	const [user, reload] = useAuth();

	const { drawerVisibility } = useDrawerProvider();
	const [, { deleteQuery }] = useRouterQuery();

	const [form] = Form.useForm<ICluster>();
	const [fieldsStatus, setFieldsStatus] = useState();

	const [{ cluster_slug }] = useRouterQuery();
	const { data: cluster } = useClusterSlugApi({ populate: "owner", filter: { slug: cluster_slug } });
	const [updateApi, updateStatus] = useClusterUpdateApi({ id: cluster?._id });
	const [createApi, createStatus] = useClusterCreateApi();

	console.log("cluster :>> ", cluster);
	const isNew = typeof cluster === "undefined";

	const onFinish = async (values: any) => {
		console.log(isNew ? "[NEW]" : "[EDIT]", "Submit:", values);
		const postData = { ...values };

		let result: ICluster | undefined;
		if (isNew) {
			result = await createApi(postData);
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

			setFieldsStatus(statuses);

			result = await updateApi(postData);
		}
		console.log("result :>> ", result);
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
		const fields = Object.keys(fieldsStatus);
		const statuses: any = {};
		fields.forEach((field) => {
			statuses[field] = updateStatus;
		});
		setFieldsStatus(statuses);
	}, [updateStatus]);

	return (
		<div>
			<Form
				layout="vertical"
				// name="edit"
				// initialValues={initialValues}
				form={form}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<AutoSendInput label="Cluster name" name="name" value={cluster?.name} status={fieldsStatus} />
				<AutoSendInput label="Short name" name="shortName" value={cluster?.shortName} status={fieldsStatus} />
				{/* <AutoSendInput label="Primary domain" name="name" updateApi={updateApi} status={status} />
				<AutoSendInput label="Provider" name="name" updateApi={updateApi} status={status} /> */}
			</Form>
		</div>
	);
};

export default ClusterEdit;
