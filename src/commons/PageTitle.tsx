import { EllipsisOutlined, HomeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Space } from "antd";
import type { ReactNode } from "react";

export const PageTitle = (props: { children?: ReactNode } = {}) => {
	return (
		<div className="border-b border-gray-300 px-6 py-4">
			<Breadcrumb>
				<Breadcrumb.Item href="">
					<HomeOutlined className="align-middle" />
				</Breadcrumb.Item>
				<Breadcrumb.Item href="">
					<span>Projects</span>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Application</Breadcrumb.Item>
			</Breadcrumb>
			<div className=" flex w-full flex-row">
				<h1 className="my-0 grow py-0 pt-2 text-xl font-bold">Page Title</h1>
				<div>
					<Space>
						<Button type="default" icon={<SettingOutlined className="align-middle" />}>
							Settings
						</Button>
						<Button type="primary" icon={<PlusOutlined className="align-middle" />}>
							New Project
						</Button>
						<Button type="default" icon={<EllipsisOutlined className="align-middle" />}></Button>
					</Space>
				</div>
			</div>
		</div>
	);
};
