import { EllipsisOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Space, theme } from "antd";
import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState } from "react";
import { useDarkMode } from "usehooks-ts";

export type IPageTitleProps = {
	children?: ReactNode;
	breadcrumbs?: { name?: string; url?: string; icon?: ReactNode }[];
	title?: string;
	actions?: ReactNode[];
};

export function Title(props: { color?: string; value?: string }) {
	const {
		token: { colorTextHeading },
	} = theme.useToken();
	const { isDarkMode } = useDarkMode();

	const { color = isDarkMode ? "white" : "black", value: title } = props;

	return (
		<h1 className="my-0 grow py-0 pt-2 text-xl font-bold" style={{ color }}>
			{title}
		</h1>
	);
}

export const PageTitle = (props: IPageTitleProps = {}) => {
	const router = useRouter();

	const {
		children,
		breadcrumbs = [],
		title = "Page Title",
		actions = [
			<Button key="workspace-setting-btn" type="default" icon={<SettingOutlined className="align-middle" />}>
				Settings
			</Button>,
			<Button key="more-btn" type="default" icon={<EllipsisOutlined className="align-middle" />}></Button>,
		],
	} = props;

	const {
		token: { colorTextHeading },
	} = theme.useToken();

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted ? (
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
			<div className=" flex w-full flex-col md:flex-row">
				<Title value={title} />
				<div>
					<Space wrap>
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
			{children}
		</div>
	) : null;
};
