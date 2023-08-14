import { ArrowDownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useScroll, useSize } from "ahooks";
import { Button, Empty, Skeleton, theme } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
import React, { useRef, useState } from "react";
import sanitizeHtml from "sanitize-html";

// eslint-disable-next-line import/no-extraneous-dependencies
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
	// console.log({ logData });

	const podNames = logData.status?.toString() === "0" ? [] : Object.keys(logData);
	// console.log("podNames :>> ", podNames);
	const firstPodName = podNames[0];
	const podLogs = firstPodName ? logData[firstPodName] : "";
	console.log({ podLogs });

	const displayedData = stripAnsiCodes(podLogs);
	// console.log("displayedData :>> ", displayedData);

	const messages: any[] = displayedData
		.split("\n")
		.map((line: any, i: number) => line.toString())
		.filter((line) => line !== "0");
	// console.log("messages :>> ", messages);

	const {
		token: { colorText },
	} = theme.useToken();

	const [wrap, setWrap] = useState(false);
	const bottomEl = useRef<any>(null);
	const frameRef = useRef<any>(null);
	const scroll = useScroll(frameRef);
	const contentRef = useRef<any>(null);
	const contentSize = useSize(contentRef);

	const scrollToBottom = () => {
		bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div style={{ color: colorText }} className="flex h-full flex-col">
			{status === "loading" && <Skeleton active />}

			<div className="flex-auto overflow-auto" ref={frameRef}>
				{messages.length <= 1 && messages[0] === "" ? (
					<Empty className="py-10" />
				) : (
					<pre
						className="no-scrollbar mb-0 bg-black p-4 pt-6"
						ref={contentRef}
						style={{
							width: wrap ? "100%" : "auto",
							whiteSpace: wrap ? "normal" : "nowrap",
						}}
					>
						{messages
							.filter((m) => m !== "")
							// .reverse()
							.map((message, index) => {
								const msg = `${message}`;
								if (msg.toLowerCase().indexOf("error") > -1)
									return (
										<p key={`log-line-${index}`}>
											<CloseCircleOutlined className="text-red-600" />{" "}
											<span className="text-red-600">{parser(`${message}`)}</span>
										</p>
									);

								if (msg.indexOf("http://") > -1 || msg.indexOf("https://") > -1) {
									// console.log("msg :>> ", msg);
									const words = msg.split(" ");
									const msgWithLink = words
										.map((m) =>
											m.indexOf("http://") > -1 || m.indexOf("https://") > -1
												? `<a href="${m}" target="_blank" style="color: #008dff">${m}</a>`
												: m
										)
										.join(" ");

									return <p key={`log-line-${index}`}>{parser(msgWithLink)}</p>;
								}

								return <p key={`log-line-${index}`}>{parser(`${message}`)}</p>;
							})}
						<p ref={bottomEl}></p>
					</pre>
				)}
			</div>

			<div className="flex p-4">
				<div className="flex-auto"></div>
				{/* Go to bottom */}
				<div className="flex gap-2">
					<Button onClick={() => setWrap(!wrap)}>{wrap ? "UNWRAP" : "WRAP"}</Button>
					<Button icon={<ArrowDownOutlined />} onClick={() => scrollToBottom()} />
				</div>
			</div>

			{/* {lines.length === 0 ? (
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
			)} */}
		</div>
	);
};
