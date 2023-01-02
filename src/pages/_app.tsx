import "../styles/global.css";
import "antd/dist/reset.css";

import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;

export default MyApp;
