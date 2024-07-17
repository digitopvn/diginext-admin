import { HistoryOutlined } from "@ant-design/icons";
import { Command } from "cmdk";
import { useRouter } from "next/router";
import React from "react";

export type SearchItem = {
	label?: string | JSX.Element;
	value: any;
	onSelect?: (value?: string) => void;
	children?: SearchItem[];
};

export type SearchProps = {
	commands?: SearchItem[];
	onChange?: (value: any) => void;
};

const SearchBox = (props: SearchProps) => {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [selectedItems, setSelectedItems] = React.useState<SearchItem[]>([]);
	const selectedItem = selectedItems[selectedItems.length - 1];

	const onNavigate = (path: string) => {
		router.push(path);
		setOpen(false);
	};

	// Toggle the menu when ⌘K is pressed
	React.useEffect(() => {
		const down = (e: any) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((_open) => !_open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
			<Command.Input value={search} onValueChange={setSearch} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>

				{(!selectedItem ? props?.commands : selectedItem.children)?.map((cmd, i) => {
					return !cmd.children ? (
						<Command.Item
							key={`cmd-${i}`}
							onSelect={() => {
								setOpen(false);
								if (cmd.onSelect) cmd.onSelect(cmd.value);
							}}
						>
							{cmd.label}
						</Command.Item>
					) : (
						<Command.Group heading={cmd.label} key={`cmdgroup-${i}`}>
							{cmd.children.map((subCmd, k) => (
								<Command.Item
									key={`subcmd-${subCmd.label}-${k}`}
									onSelect={() => {
										if (!subCmd.children) {
											setOpen(false);
											if (subCmd.onSelect) subCmd.onSelect(subCmd.value);
										} else {
											setSearch("");
											setSelectedItems([...selectedItems, subCmd]);
										}
									}}
								>
									{subCmd.label}
								</Command.Item>
							))}
						</Command.Group>
					);
				})}

				{selectedItem && (
					<Command.Item
						onSelect={() => {
							setSelectedItems([]);
							setSearch("");
						}}
					>
						<HistoryOutlined /> Reset
					</Command.Item>
				)}

				<Command.Separator />

				<Command.Group heading="Navigation">
					<Command.Item onSelect={() => onNavigate("/")}>Dashboard</Command.Item>
					<Command.Item onSelect={() => onNavigate("/project")}>Projects & apps</Command.Item>
					<Command.Item onSelect={() => onNavigate("/build")}>Builds & deploys</Command.Item>
					<Command.Item onSelect={() => onNavigate("/framework")}>Frameworks</Command.Item>
					<Command.Item onSelect={() => onNavigate("/git")}>Git Providers</Command.Item>
					<Command.Item onSelect={() => onNavigate("/cronjob")}>Cronjobs</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/node")}>Monitoring ≫ Nodes</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/namespace")}>Monitoring ≫ Namespaces</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/service")}>Monitoring ≫ Services</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/ingress")}>Monitoring ≫ Ingresses</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/deployment")}>Monitoring ≫ Deployments</Command.Item>
					<Command.Item onSelect={() => onNavigate("/monitor/pod")}>Monitoring ≫ Pods</Command.Item>
					<Command.Item onSelect={() => onNavigate("/infrastructure/cloud-provider")}>Infrastructure ≫ Cloud Providers</Command.Item>
					<Command.Item onSelect={() => onNavigate("/infrastructure/cluster")}>Infrastructure ≫ K8S Clusters</Command.Item>
					<Command.Item onSelect={() => onNavigate("/infrastructure/database")}>Infrastructure ≫ Databases</Command.Item>
					<Command.Item onSelect={() => onNavigate("/infrastructure/registry")}>Infrastructure ≫ Container Registries</Command.Item>
					<Command.Item onSelect={() => onNavigate("/workspace/users")}>Workspace ≫ Users</Command.Item>
					<Command.Item onSelect={() => onNavigate("/workspace/teams")}>Workspace ≫ Teams</Command.Item>
					<Command.Item onSelect={() => onNavigate("/workspace/roles")}>Workspace ≫ Roles</Command.Item>
				</Command.Group>

				{/*    <Command.Item
					onSelect={() => {
						console.log("Apple");
						setOpen(false);
					}}
				>
					Apple
				</Command.Item> */}
			</Command.List>
		</Command.Dialog>
	);
};

export default SearchBox;
