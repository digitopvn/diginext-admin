import { App, theme, Timeline } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { useBuildLogsApi } from "@/api/api-build";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Config } from "@/utils/AppConfig";

const io = require("socket.io-client");

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const { useApp } = App;

interface DataType {
	id?: string;
	key?: React.Key;
	children?: DataType[];
}

const failedKeyword = "command failed with exit code 1";

// eslint-disable-next-line no-control-regex
const stripAnsiCodes = (str: any) => `${str}`.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "") as string;

export const BuildLogs = ({ slug }: { slug?: string }) => {
	const router = useRouter();
	const root = useApp();

	const [query] = useRouterQuery();
	const { build_slug } = query;

	// api

	const { data: logData = "", isLoading } = useBuildLogsApi({ filter: { slug: slug ?? build_slug } });
	console.log({ logData });

	const displayedData = stripAnsiCodes(logData);

	const lines: any[] = displayedData.split("\n").map((line: any, i: number) => line.toString());

	// socket

	const SOCKET_ROOM = build_slug;
	const SOCKET_URL = Config.NEXT_PUBLIC_API_BASE_URL;

	const [messages, setMessages] = useState<string[]>(["Connecting..."]);
	const [status, setStatus] = useState<"failed" | "in_progress" | "success">("in_progress"); // failed, in_progress, success
	const [isFinished, setIsFinished] = useState(false);

	const {
		token: { colorText },
	} = theme.useToken();

	// effects

	useEffect(() => {
		console.log("lines :>> ", lines);
		if (isEmpty(logData)) return;
		setMessages(lines);
	}, [lines.length]);

	useEffect(() => {
		const buildLog = logData.toString().toLowerCase();

		// check whether the build was finished yet or not...
		if (buildLog.indexOf("finished deploying") > -1 || buildLog.indexOf(failedKeyword) > -1 || buildLog.indexOf("[error]") > -1)
			setIsFinished(true);

		// display result...
		if (buildLog.indexOf("finished deploying") > -1) setStatus("success");
		if (buildLog.indexOf(failedKeyword) > -1 || buildLog.indexOf("[error]") > -1) setStatus("failed");

		//
		const socket = io(SOCKET_URL, { transports: ["websocket"] });

		socket.on("connect", () => {
			console.log("connected:", socket.connected); // false

			// Join to the room:
			socket.emit("join", { room: SOCKET_ROOM });

			// Listen on the server:
			socket.on("message", ({ action, message }: { action: string; message: string }) => {
				// print out the message
				if (message) {
					setMessages((oldMsgs) => [...oldMsgs, message]);

					// if build failed keyword detected -> mark as BUILD FAILED
					if (message?.toLowerCase().indexOf(failedKeyword) > -1 || message?.toLowerCase().indexOf("[error]") > -1) {
						setStatus("failed");
						setIsFinished(true);
					}
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
			setMessages((oldMsgs) => [...oldMsgs, "Disconnected with build server."]);
		});

		return () => {
			socket.disconnect();
			setMessages([]);
		};
	}, []);

	return (
		<div style={{ color: colorText }}>
			<Timeline>
				{messages
					.filter((m) => m !== "")
					.map((message, index) =>
						`${message}`.toLowerCase().indexOf("error") > -1 ? (
							<Timeline.Item key={`message-${index}`} className="text-red-600">
								{parser(`${message}`)}
							</Timeline.Item>
						) : (
							<Timeline.Item key={`message-${index}`}>{parser(`${message}`)}</Timeline.Item>
						)
					)}
			</Timeline>

			{status === "failed" && <h2 className="text-xl text-red-600">Build lỗi rồi má ơi!</h2>}
			{status === "success" && <h2 className="text-xl text-green-600">Build thành công rồi, đỉnh quá idol ơi!</h2>}
		</div>
	);
};
