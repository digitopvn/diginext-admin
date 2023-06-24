import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

type GtagScriptProps = {
	FB_PIXEL_ID: string;
};

export const metaPageview = () => {
	if (typeof window !== "undefined") {
		try {
			(window as any).fbq("track", "PageView");
		} catch (e) {
			console.warn("[ERROR] MetaPixel > pageview :>> ", e);
		}
	}
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const metaEvent = (name: string, options = {}) => {
	if (typeof window !== "undefined")
		try {
			(window as any).fbq("track", name, options);
		} catch (e) {
			console.warn("[ERROR] MetaPixel > event :>> ", e);
		}
};

const MetaPixelScript = (props: GtagScriptProps) => {
	const { FB_PIXEL_ID } = props;

	const router = useRouter();

	useEffect(() => {
		// This pageview only triggers the first time (it's important for Pixel to have real information)
		metaPageview();

		router.events.on("routeChangeComplete", metaPageview);
		return () => {
			router.events.off("routeChangeComplete", metaPageview);
		};
	}, [router.events]);

	return (
		<>
			{/* Global Site Code Pixel - Facebook Pixel */}
			<Script
				id="fb-pixel"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
					!function(f,b,e,v,n,t,s)
					{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
					n.callMethod.apply(n,arguments):n.queue.push(arguments)};
					if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
					n.queue=[];t=b.createElement(e);t.async=!0;
					t.src=v;s=b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t,s)}(window, document,'script',
					'https://connect.facebook.net/en_US/fbevents.js');
					fbq('init', ${FB_PIXEL_ID});
				`,
				}}
			/>
		</>
	);
};

export default MetaPixelScript;
