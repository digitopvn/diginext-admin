import { useRouter } from "next/router";
import type { HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import { useDarkMode } from "usehooks-ts";

const DiginextLogo = (props: { className?: HTMLAttributes<any> | string; useTagline?: boolean }) => {
	const router = useRouter();
	const { isDarkMode } = useDarkMode();

	const [src, setSrc] = useState(`${router.basePath}/assets/images/diginext_logo_white.svg`);

	useEffect(() => {
		setSrc(isDarkMode ? `${router.basePath}/assets/images/diginext_logo_white.svg` : `${router.basePath}/assets/images/diginext_logo.svg`);
	}, [isDarkMode]);

	return (
		<div className="text-center">
			<div className={`mx-auto my-5 w-64 text-center ${props.className}`}>
				<img src={src} alt="Diginext Logo" />
			</div>
			{props.useTagline && <div className="mb-6">Build faster. Deploy easier. More flexible.</div>}
		</div>
	);
};

export default DiginextLogo;
