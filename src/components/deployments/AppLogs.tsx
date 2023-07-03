import { CloseCircleOutlined } from "@ant-design/icons";
import { Empty, Skeleton, theme, Timeline } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
import React from "react";
import sanitizeHtml from "sanitize-html";
// eslint-disable-next-line import/no-extraneous-dependencies
import isURL from "validator/lib/isURL";

import { useAppDeployEnvironmentLogsApi } from "@/api/api-app";
import { useRouterQuery } from "@/plugins/useRouterQuery";

const io = require("socket.io-client");

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const failedKeyword = "command failed with exit code 1";

// eslint-disable-next-line no-control-regex
const stripAnsiCodes = (str: any) =>
	sanitizeHtml(`${str}`.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ""));

export const AppLogs = ({ slug }: { slug?: string }) => {
	const [query] = useRouterQuery();
	const { app: appSlug = slug, env } = query;

	// api
	// console.log("build_slug :>> ", build_slug);
	const { data: logData = {}, status } = useAppDeployEnvironmentLogsApi(appSlug, { filter: { env } });
	console.log({ logData });

	const pods = Object.keys(logData) || [];
	const firstPod = pods.filter((pod) => pod.indexOf(appSlug) > -1)[0];
	const podLogs = firstPod ? logData[firstPod] : "";
	console.log({ podLogs });

	const displayedData = stripAnsiCodes(podLogs);
	// console.log("displayedData :>> ", displayedData);

	const lines: any[] = displayedData
		.split("\n")
		.map((line: any, i: number) => line.toString())
		.filter((line) => line !== "0");
	console.log("lines :>> ", lines);

	const {
		token: { colorText },
	} = theme.useToken();

	return (
		<div style={{ color: colorText }}>
			{status === "loading" && <Skeleton active />}

			{lines.length === 0 ? (
				<Empty />
			) : (
				<Timeline
					items={lines
						.filter((m) => m !== "")
						.reverse()
						.map((message, index) => {
							const msg = `${message}`;
							if (msg.toLowerCase().indexOf("error") > -1)
								return {
									dot: <CloseCircleOutlined className="text-red-600" />,
									children: <span className="text-red-600">{parser(`${message}`)}</span>,
								};

							if (msg.indexOf("http://") > -1 || msg.indexOf("https://")) {
								const words = msg.split(" ");
								const msgWithLink = words
									.map((m) =>
										isURL(m, { require_protocol: true }) ? `<a href="${m}" target="_blank" style="color: #008dff">${m}</a>` : m
									)
									.join(" ");
								return { children: parser(msgWithLink) };
							}

							return { children: parser(`${message}`) };
						})}
				/>
			)}
		</div>
	);
};
