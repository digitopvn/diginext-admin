import { EllipsisOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Space } from "antd";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export type IPageTitleProps = {
	children?: ReactNode;
	breadcrumbs?: { name?: string; url?: string; icon?: ReactNode }[];
	title?: string;
	actions?: ReactNode[];
};

export const PageTitle = (props: IPageTitleProps = {}) => {
	const router = useRouter();
	const {
		breadcrumbs = [],
		title = "Page Title",
		actions = [
			<Button key="workspace-setting-btn" type="default" icon={<SettingOutlined className="align-middle" />}>
				Settings
			</Button>,
			<Button key="more-btn" type="default" icon={<EllipsisOutlined className="align-middle" />}></Button>,
		],
	} = props;

	return (
		<div className="border-b border-gray-300 px-6 py-4">
			<Breadcrumb>
				<Breadcrumb.Item href={`${router.basePath}/`} key="breadcrumb-home">
					<HomeOutlined />
				</Breadcrumb.Item>
				{breadcrumbs.map((item, i) => (
					<Breadcrumb.Item href={item.url} key={`breadcrumb-${i}`}>
						{item.icon}
						<span>{item.name}</span>
					</Breadcrumb.Item>
				))}
			</Breadcrumb>
			<div className=" flex w-full flex-row">
				<h1 className="my-0 grow py-0 pt-2 text-xl font-bold">{title}</h1>
				<div>
					<Space>
						{actions}
						{/* <Button type="default" icon={<SettingOutlined className="align-middle" />}>
							Settings
						</Button>
						<Button type="primary" icon={<PlusOutlined className="align-middle" />}>
							New Project
						</Button>
						<Button type="default" icon={<EllipsisOutlined className="align-middle" />}></Button> */}
					</Space>
				</div>
			</div>
		</div>
	);
};
