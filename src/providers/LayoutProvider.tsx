import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type ILayoutContext = {
	sidebarCollapsed: boolean;
	toggleSidebar?: (open?: boolean) => void;
};

export const LayoutContext = createContext<ILayoutContext>({ sidebarCollapsed: false });

const LayoutProvider = (props: { children?: ReactNode } = {}) => {
	const [sidebarCollapsed, setSidebarOpened] = useState(false);

	const toggleSidebar = (open?: boolean) => {
		if (typeof open !== "undefined") return setSidebarOpened(open);
		return setSidebarOpened((_opened) => !_opened);
	};

	return <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>{props.children}</LayoutContext.Provider>;
};

export const useLayoutProvider = () => {
	const context = useContext(LayoutContext);
	return context;
};

export default LayoutProvider;
