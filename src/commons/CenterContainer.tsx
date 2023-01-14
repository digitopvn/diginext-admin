import type { HTMLAttributes } from "react";

const CenterContainer = (props: { children?: any; className?: HTMLAttributes<any> | string }) => {
	return <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${props.className}`}>{props.children}</div>;
};

export default CenterContainer;
