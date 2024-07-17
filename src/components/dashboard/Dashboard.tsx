import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";

import { useAuth } from "@/api/api-auth";
import { useStatsApi } from "@/api/api-stats";

export const Dashboard = () => {
	const [user] = useAuth();
	const { activeWorkspace: workspace } = user || {};

	const { data: response } = useStatsApi();
	const { data: stats } = response || {};

	return (
		<div className="px-4 py-6">
			<Typography.Title level={1}>{workspace?.name} Workspace</Typography.Title>

			<Row gutter={[16, 16]}>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic prefix={<UserOutlined />} title="Users" value={stats?.all.users} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Projects" value={stats?.all.projects} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Apps" value={stats?.all.apps} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Clusters" value={stats?.all.clusters} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Databases" value={stats?.all.databases} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Database backups" value={stats?.all.db_backups} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Gits" value={stats?.all.gits} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Container Registries" value={stats?.all.registries} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Frameworks" value={stats?.all.frameworks} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Builds" value={stats?.all.builds} />
					</Card>
				</Col>
				<Col span={4} xs={12} md={6}>
					<Card bordered={false}>
						<Statistic title="Releases" value={stats?.all.releases} />
					</Card>
				</Col>
			</Row>
		</div>
	);
};
