import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { theme, Timeline } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
// eslint-disable-next-line import/no-extraneous-dependencies
import isURL from "validator/lib/isURL";

import { useBuildSlugApi } from "@/api/api-build";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Config } from "@/utils/AppConfig";

const io = require("socket.io-client");

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const failedKeyword = "command failed with exit code 1";

// eslint-disable-next-line no-control-regex
const stripAnsiCodes = (str: any) =>
	sanitizeHtml(`${str}`.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ""));

export const BuildLogs = ({ slug }: { slug?: string }) => {
	const [query] = useRouterQuery();
	const { build_slug } = query;

	// api
	// console.log("build_slug :>> ", build_slug);
	const { data: build } = useBuildSlugApi(build_slug);
	const logData = build?.logs || "";
	// console.log({ logData });

	const displayedData = stripAnsiCodes(logData);
	// console.log("displayedData :>> ", displayedData);

	const lines: any[] = displayedData.split("\n").map((line: any, i: number) => line.toString());
	// console.log("lines :>> ", lines);

	// socket

	const SOCKET_ROOM = build_slug;
	const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : Config.NEXT_PUBLIC_API_BASE_URL;
	console.log("SOCKET_URL :>> ", SOCKET_URL);

	const [messages, setMessages] = useState<string[]>(["Connecting..."]);
	const [status, setStatus] = useState<"failed" | "in_progress" | "success">("in_progress"); // failed, in_progress, success
	const [isFinished, setIsFinished] = useState(false);

	const {
		token: { colorText },
	} = theme.useToken();

	// effects

	useEffect(() => {
		// console.log("lines :>> ", lines);
		if (isEmpty(logData)) return;
		setMessages(lines);
	}, [lines.length]);

	useEffect(() => {
		const buildLog = logData?.toString().toLowerCase() || "";

		// check whether the build was finished yet or not...
		if (build?.status === "failed" || build?.status === "success") setIsFinished(true);

		// display result...
		if (build?.status === "success") setStatus("success");
		if (build?.status === "failed") setStatus("failed");

		// no need to connect to socket if the room is not available:
		if (!SOCKET_ROOM) return () => false;

		console.log(`[socket] connecting to "${SOCKET_ROOM}" room...`);
		const socket = io(SOCKET_URL, { transports: ["websocket"] });

		socket.on("connect", () => {
			console.log("[socket] connected:", socket.connected, `(ROOM: ${SOCKET_ROOM})`);

			// Join to the room:
			socket.emit("join", { room: SOCKET_ROOM });

			// Listen on the server:
			socket.on("message", ({ action, message }: { action: string; message: string }) => {
				console.log("[socket] message:", { action, message });

				// print out the message
				if (message) {
					setMessages((oldMsgs) => [...oldMsgs, stripAnsiCodes(message)]);

					// if build failed keyword detected -> mark as BUILD FAILED
					if (message?.toLowerCase().indexOf(failedKeyword) > -1 || message?.toLowerCase().indexOf("[error]") > -1) {
						setStatus("failed");
						setIsFinished(true);
					}
				}

				if (action === "failed") {
					setStatus("failed");
					setIsFinished(true);
				}

				// if build success keyword detected -> mark as BUILD SUCCEED
				if (action === "end") {
					socket.disconnect();
					setIsFinished(true);
					setStatus("success");
				}
			});
		});

		socket.on("disconnect", () => {
			console.log("[socket] disconnected !");
			setMessages((oldMsgs) => [...oldMsgs, "Disconnected with build server."]);
		});

		return () => {
			if (socket.connected) {
				console.log("[socket] disconnecting...");
				socket.disconnect();
			}
			setMessages([]);
		};
	}, [build?.status, logData, SOCKET_ROOM]);

	return (
		<div style={{ color: colorText }}>
			{status === "failed" && (
				<h3 className="text-xl text-blue-600">
					<LoadingOutlined /> Building...
				</h3>
			)}

			{status === "failed" && <h2 className="text-xl text-red-600">Build failed.</h2>}

			{status === "success" && <h2 className="text-xl text-green-600">Congrats, your build process has been finished successfully!</h2>}

			<Timeline
				items={messages
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
		</div>
	);
};
