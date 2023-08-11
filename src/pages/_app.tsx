import "../styles/global.scss";
import "antd/dist/reset.css";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";

// Create a client
const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
	<QueryClientProvider client={queryClient}>
		<Component {...pageProps} />
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default MyApp;
