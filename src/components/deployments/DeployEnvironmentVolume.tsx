import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Input, InputNumber, List, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

import { useAppDeployEnvironmentAddVolume, useAppDeployEnvironmentRemoveVolume } from "@/api/api-app";
import type { DeployEnvironmentVolume } from "@/api/api-types";
import { useRouterQuery } from "@/plugins/useRouterQuery";

export type DeployEnvironmentVolumeManagerProps = {
	values?: DeployEnvironmentVolume[];
	defaultValues?: DeployEnvironmentVolume[];
	onChange?: (values?: DeployEnvironmentVolume[]) => void;
};

const defaultDiskSize = 5;

const DeployEnvironmentVolumeManager = (props: DeployEnvironmentVolumeManagerProps) => {
	const { values, defaultValues, onChange } = props;
	const [query, { setQuery }] = useRouterQuery();
	const { notification } = App.useApp();

	const [_values, setValues] = useState(values ?? defaultValues ?? []);
	const [valueToBeAdded, setValueToBeAdded] = useState<Pick<DeployEnvironmentVolume, "name" | "size" | "mountPath">>({
		name: "",
		size: "",
		mountPath: "",
	});

	// APIs
	const [addVolumeApi] = useAppDeployEnvironmentAddVolume({ filter: { slug: query.app, env: query.env } });
	const [removeVolumeApi] = useAppDeployEnvironmentRemoveVolume();

	// functions
	const addVolume = (newValue: Pick<DeployEnvironmentVolume, "name" | "size" | "mountPath">) => {
		if (!newValue.name) return notification.error({ message: `Volume "name" is required.` });
		if (!newValue.mountPath) return notification.error({ message: `Volume "mountPath" is required.` });
		// default disk size
		// eslint-disable-next-line no-param-reassign
		if (!newValue.size) newValue.size = `${defaultDiskSize}Gi`;

		return addVolumeApi(newValue)
			.then((res) => {
				console.log("res :>> ", res);
				if (res.status) {
					const { data: newVolume } = res;
					setValues((_) => [..._, newVolume]);
				}
			})
			.catch((e) => {
				// error
			});
	};

	const removeVolumeAtIndex = (index: number) => {
		const vol = _values[index];
		if (!vol) return notification.error({ message: `Volume not found.` });

		return removeVolumeApi({ slug: query.app, env: query.env, name: vol.name })
			?.then(({ data }) => {
				// notify client
				if (data.success) notification.success({ message: `Volume ${vol.name} has been deleted.` });
				if (data.message) notification.info({ message: data.message });
				// update state
				setValues(_values.filter((item, i) => index !== i));
			})
			.catch((e) => {
				// error
				// notification.error({ message: `Something's wrong: ${e}` });
			});
	};

	useEffect(() => {
		if (onChange) onChange(_values);
	}, [_values]);

	return (
		<>
			<h3>
				Volumes{" "}
				<Tooltip title="WARNING: When using volume, high-availability of your app will be disabled, since the app's replicas will need to stay on the same server of the volume.">
					<InfoCircleOutlined />
				</Tooltip>
			</h3>
			<List
				bordered
				size="small"
				dataSource={_values ?? []}
				footer={
					<Space.Compact style={{ width: "100%" }}>
						<Input
							name="name"
							placeholder="Volume name"
							prefix={
								<Tooltip title="No spaces or special characters.">
									<InfoCircleOutlined />
								</Tooltip>
							}
							onChange={(e) => {
								if (e.currentTarget && e.currentTarget.value) setValueToBeAdded({ ...valueToBeAdded, name: e.currentTarget.value });
							}}
						/>
						<Input
							name="mountPath"
							placeholder="Mount to directory path"
							prefix={
								<Tooltip title="Location of mapped directory in this container. For example: /var/www/html">
									<InfoCircleOutlined />
								</Tooltip>
							}
							onChange={(e) => {
								if (e.currentTarget && e.currentTarget.value)
									setValueToBeAdded({ ...valueToBeAdded, mountPath: e.currentTarget.value });
							}}
						/>
						<InputNumber
							name="size"
							placeholder="Size"
							addonAfter="Gi"
							style={{ flex: "0 0 140px" }}
							defaultValue={defaultDiskSize}
							addonBefore={
								<Tooltip title="Size of the volume in Gigabyte, this cannot be changed in the future.">
									<InfoCircleOutlined />
								</Tooltip>
							}
							onChange={(value) => {
								if (value) setValueToBeAdded({ ...valueToBeAdded, size: `${value}Gi` });
							}}
						/>
						<Button
							icon={<PlusOutlined />}
							onClick={() => {
								console.log("valueToBeAdded :>> ", valueToBeAdded);
								if (valueToBeAdded) addVolume(valueToBeAdded);
							}}
						>
							Add
						</Button>
					</Space.Compact>
				}
				renderItem={(item, index) => (
					<List.Item
						key={`volume-item-${index}`}
						actions={[<Button key={`volume-delete-btn`} icon={<DeleteOutlined />} onClick={() => removeVolumeAtIndex(index)} />]}
					>
						<List.Item.Meta
							title={
								<span>
									{item.name} ({item.size})
								</span>
							}
							description={`Mount to: ${item.mountPath} (Node: ${item.node})`}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default DeployEnvironmentVolumeManager;
