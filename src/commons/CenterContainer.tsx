import type { HTMLAttributes } from "react";

const CenterContainer = (props: { children?: any; className?: HTMLAttributes<any> | string }) => {
	return <div className={`absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 ${props.className}`}>{props.children}</div>;
};

export default CenterContainer;
