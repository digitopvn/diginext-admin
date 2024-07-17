import { useSize } from "ahooks";
import { Typography } from "antd";
import dayjs from "dayjs";
import React, { useRef } from "react";

import { useClusterSlugApi } from "@/api/api-cluster";
import { useMonitorNamespaceDeleteApi } from "@/api/api-monitor-namespace";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { useLayoutProvider } from "@/providers/LayoutProvider";
import type { KubeNamespace } from "@/types/KubeNamespace";

import { DeploymentList } from "./DeploymentList";
import { IngressList } from "./IngressList";
import { PodList } from "./PodList";
import { ServiceList } from "./ServiceList";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

interface DataType extends KubeNamespace {
	key?: React.Key;
	id?: string;
	actions?: any;
}

const pageSize = 200;

export const NamespaceResources = () => {
	const { responsive } = useLayoutProvider();
	const [query] = useRouterQuery();
	const { namespace: namespaceName, cluster: clusterSlug } = query;

	// cluster
	const { data: cluster, status: clusterApiStatus } = useClusterSlugApi(clusterSlug);

	const [deleteNamespaceApi, deleteNamespaceApiStatus] = useMonitorNamespaceDeleteApi();

	const ref = useRef(null);
	const size = useSize(ref);

	return (
		<>
			{/* Page title & desc here */}
			<PageTitle title={`All resources`} breadcrumbs={[{ name: "Workspace" }, { name: namespaceName }]} actions={[]} />

			<div className="h-full flex-auto p-6" ref={ref}>
				{/* Ingress */}
				<div className="mb-4">
					<Typography.Title level={4}>Ingress</Typography.Title>
					<IngressList hideHeader autoHeight />
				</div>

				{/* Services */}
				<div className="mb-4">
					<Typography.Title level={4}>Service</Typography.Title>
					<ServiceList hideHeader autoHeight />
				</div>

				{/* Deployments */}
				<div className="mb-4">
					<Typography.Title level={4}>Deployment</Typography.Title>
					<DeploymentList hideHeader autoHeight />
				</div>

				{/* Pods */}
				<div className="mb-4">
					<Typography.Title level={4}>Pod</Typography.Title>
					<PodList hideHeader autoHeight />
				</div>
			</div>
		</>
	);
};
