/* eslint-disable no-nested-ternary */
import {
	ArrowDownOutlined,
	BuildOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	LoadingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useInterval, useScroll, useSize } from "ahooks";
import { Button, Space, Tag, theme } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { isEmpty } from "lodash";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import sanitizeHtml from "sanitize-html";

// eslint-disable-next-line import/no-extraneous-dependencies
import { useBuildSlugApi } from "@/api/api-build";
import { PageTitle } from "@/commons/PageTitle";
import { useRouterQuery } from "@/plugins/useRouterQuery";
import { Config } from "@/utils/AppConfig";

const humanrizerLang = new HumanizeDurationLanguage();
const humanrizer = new HumanizeDuration(humanrizerLang);

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
	const { data: build } = useBuildSlugApi(build_slug);
	const logData = build?.logs || "";
	const displayedData = stripAnsiCodes(logData);
	// console.log("displayedData :>> ", displayedData);

	const lines: any[] = displayedData.split("\n").map((line: any, i: number) => line.toString());

	// socket
	const SOCKET_ROOM = build_slug;
	const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : Config.NEXT_PUBLIC_API_BASE_URL;
	console.log("SOCKET_URL :>> ", SOCKET_URL);

	const [messages, setMessages] = useState<string[]>(["Connecting..."]);
	const [status, setStatus] = useState<"failed" | "in_progress" | "success">("in_progress"); // failed, in_progress, success
	const [isFinished, setIsFinished] = useState(false);
	const [wrap, setWrap] = useState(false);
	const [buildDuration, setBuildDuration] = useState("0");

	const bottomEl = useRef<any>(null);
	const frameRef = useRef<any>(null);
	const scroll = useScroll(frameRef);
	const contentRef = useRef<any>(null);
	const contentSize = useSize(contentRef);
	// console.log("contentSize :>> ", contentSize);
	// console.log("scroll :>> ", scroll);
	const preventScrollBottom = (scroll?.top || 0) > (contentSize?.height || 0) - (window?.innerHeight || 0);
	// console.log("preventScrollBottom :>> ", preventScrollBottom);

	const {
		token: { colorText },
	} = theme.useToken();

	const scrollToBottom = () => {
		if (!preventScrollBottom) bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
	};

	// effects

	useInterval(
		() => {
			if (build?.startTime) setBuildDuration(humanrizer.humanize(dayjs(build.startTime).diff(dayjs()), { round: true }));
			if (build?.duration) setBuildDuration(humanrizer.humanize(build?.duration || 0, { round: true }));
		},
		build?.duration ? undefined : 1000
	);

	useEffect(() => {
		if (build?.duration) setBuildDuration(humanrizer.humanize(build?.duration || 0, { round: true }));
	}, [build?.duration]);

	useEffect(() => {
		if (isEmpty(logData)) return;
		setMessages(lines);
	}, [lines.length]);

	useEffect(() => {
		scrollToBottom();
	}, [messages.length]);

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
		<div style={{ color: colorText }} className="flex h-full flex-col">
			{/* Page title & desc here */}
			<PageTitle
				title={`Build Logs: ${build_slug}`}
				breadcrumbs={[
					{ name: "Builds", url: "/build" },
					{ name: `Project "${build?.projectSlug}"` },
					{ name: `App "${build?.appSlug}"` },
					build?.env ? { name: `Env "${build?.env}"` } : {},
				]}
				actions={[
					<Tag key="cli-version" color="gold" icon={<ClockCircleOutlined />}>
						CLI: {build?.cliVersion || "unknown"}
					</Tag>,
					<Tag key="duration" color="gold" icon={<ClockCircleOutlined />}>
						Duration: {buildDuration}
					</Tag>,
					<Tag
						key="status"
						color="green"
						icon={
							build?.status === "success" ? (
								<CheckCircleOutlined />
							) : build?.status === "building" ? (
								<LoadingOutlined />
							) : build?.status === "failed" ? (
								<ExclamationCircleOutlined />
							) : (
								<></>
							)
						}
					>
						{build?.status}
					</Tag>,
				]}
			>
				<Space wrap className="mt-2">
					<Tag key="created-date" color="geekblue" icon={<CalendarOutlined />}>
						{dayjs(build?.createdAt).format("LLL")}
					</Tag>
					<Tag key="created-by" color="magenta" icon={<UserOutlined />}>
						{build?.createdBy}
					</Tag>
					{build?.status === "success" && (
						<Link href={`https://${build?.image}:${build?.tag}`} target="_blank">
							<Tag key="image-tag" color="volcano" icon={<BuildOutlined />}>
								click to view image url
							</Tag>
						</Link>
					)}
				</Space>
			</PageTitle>

			<div className="flex-auto overflow-auto" ref={frameRef}>
				<pre
					className="no-scrollbar bg-black p-4 pt-6"
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
										<CloseCircleOutlined className="text-red-600" /> <span className="text-red-600">{parser(`${message}`)}</span>
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
			</div>

			<div className="flex px-4 py-2">
				{/* Status message */}
				<div className="flex-auto">
					{status === "in_progress" && (
						<h3 className="text-xl text-blue-600">
							<LoadingOutlined /> Building...
						</h3>
					)}

					{status === "failed" && (
						<h2 className="text-xl text-red-600">
							<ExclamationCircleOutlined /> Build failed.
						</h2>
					)}

					{status === "success" && (
						<h2 className="text-xl text-green-600">
							<CheckCircleOutlined /> Congrats, your build process has been finished successfully!
						</h2>
					)}
				</div>

				{/* Go to bottom */}
				<div className="flex gap-2">
					<Button onClick={() => setWrap(!wrap)}>{wrap ? "UNWRAP" : "WRAP"}</Button>
					<Button icon={<ArrowDownOutlined />} onClick={() => scrollToBottom()} />
				</div>
			</div>
		</div>
	);
};
