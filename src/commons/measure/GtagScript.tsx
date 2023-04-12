import { isEmpty } from "lodash";
import Script from "next/script";

type GtagScriptProps = {
	gaIds: string[];
};

const GtagScript = (props: GtagScriptProps) => {
	const { gaIds } = props;

	if (isEmpty(gaIds)) return null;

	return (
		<>
			{/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${gaIds[0]}`} strategy="afterInteractive" />
			<Script id="google-analytics" strategy="afterInteractive">
				{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                
                ${gaIds.map((gaId) => `gtag('config', '${gaId}');\n`)}
                `}
			</Script>
		</>
	);
};

export default GtagScript;
