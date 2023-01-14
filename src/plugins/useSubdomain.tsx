import * as React from "react";

export default function useSubdomain(position = 0) {
	const [subdomain] = React.useState(() => {
		if (typeof window === "undefined") return undefined;
		try {
			return window?.location?.hostname?.split(".")[position];
		} catch (err: any) {
			console.error(err.message);
			return undefined;
		}
	});

	return subdomain;
}
