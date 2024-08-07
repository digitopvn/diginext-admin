/* eslint-disable no-nested-ternary */
import {
	ArrowDownOutlined,
	BuildOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	CodeOutlined,
	DatabaseOutlined,
	ExclamationCircleOutlined,
	GlobalOutlined,
	LoadingOutlined,
	RedoOutlined,
	StopOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useInterval, useScroll, useSize } from "ahooks";
import { Button, notification, Space, Tag, theme } from "antd";
import dayjs from "dayjs";
import parser from "html-react-parser";
// eslint-disable-next-line import/no-extraneous-dependencies
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import sanitizeHtml from "sanitize-html";

// eslint-disable-next-line import/no-extraneous-dependencies
import { useBuildRerunApi, useBuildSlugApi, useBuildStopApi } from "@/api/api-build";
import { useDeployFromAppApi, useDeployFromSourceApi } from "@/api/api-deploy";
import { useReleaseListApi } from "@/api/api-release";
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
	const router = useRouter();
	const [query] = useRouterQuery();
	const { build_slug, env } = query;

	// APIs
	const { data: build = {}, refetch: refetchBuildApi } = useBuildSlugApi(build_slug);
	const logData = build?.logs || "";
	const displayedData = stripAnsiCodes(logData);

	// action APIs
	const [rerunBuildApi, rerunBuildStatus] = useBuildRerunApi();
	const [buildAndDeployFromSourceApi, buildAndDeployFromSourceStatus] = useDeployFromSourceApi();
	const [buildAndDeployFromAppApi, buildAndDeployFromAppStatus] = useDeployFromAppApi();
	const [stopBuildApi, stopBuildStatus] = useBuildStopApi();

	// build info
	const { status: buildStatus } = build || {};

	// log text lines
	const lines: any[] = displayedData.split("\n").map((line: any, i: number) => line.toString());

	// socket
	const SOCKET_ROOM = build_slug;
	const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : Config.NEXT_PUBLIC_API_BASE_URL;

	// build
	const [messages, setMessages] = useState<string[]>(["Connecting..."]);
	const [status, setStatus] = useState<"start" | "building" | "failed" | "success">("building"); // build status: "start" | "building" | "failed" | "success"
	const [deployStatus, setDeployStatus] = useState<"pending" | "in_progress" | "failed" | "success" | "cancelled">("in_progress"); // deploy status: "pending" | "in_progress" | "failed" | "success" | "cancelled"
	const [isFinished, setIsFinished] = useState(false);
	const [wrap, setWrap] = useState(false);
	const [buildDuration, setBuildDuration] = useState("0");

	// releases
	const { data: releaseReq, refetch: refetchReleaseApi } = useReleaseListApi({
		filter: { build: build?._id },
		enabled: typeof build !== "undefined" && status === "success",
	});
	const { list: releaseList = [] } = releaseReq || {};
	const release = releaseList[0];

	// scroll to bottom
	const bottomEl = useRef<any>(null);
	const frameRef = useRef<any>(null);
	const scroll = useScroll(frameRef);
	const contentRef = useRef<any>(null);
	const contentSize = useSize(contentRef);

	const preventScrollBottom = typeof window === "undefined" ? false : (scroll?.top || 0) > (contentSize?.height || 0) - (window?.innerHeight || 0);

	// text color
	const {
		token: { colorText },
	} = theme.useToken();

	const scrollToBottom = () => {
		if (!preventScrollBottom) bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
	};

	const rerunBuildAndDeploy = () => {
		if (!build.branch || !build.appSlug || typeof env === "undefined") {
			notification.error({ message: `Unable to re-run the build & deploy process: invalid build.` });
			return;
		}

		// call API
		buildAndDeployFromAppApi({
			appSlug: build.appSlug,
			gitBranch: build.branch,
			deployParams: { env: env.toString(), deployInBackground: true },
		})
			.then((res) => {
				if (res.status) {
					notification.success({ message: `Build & deploy process have been re-ran, redirecting...` });
					router.push(res.data.logURL);
				} else {
					notification.error({ message: res.messages.join(", ") });
				}
			})
			.catch((e) => notification.error({ message: `Unable to re-run the build & deploy process: ${e}` }));
	};

	const rerunBuild = () => {
		// console.log("build :>> ", build);
		if (!build) {
			notification.error({ message: `Build not found.` });
			return;
		}
		if (!build.branch || !build.appSlug) {
			notification.error({ message: `Unable to re-run the build: invalid build (missing git branch).` });
			return;
		}

		// call API
		rerunBuildApi({ buildWatch: false })
			.then((res) => {
				if (res.status) {
					notification.success({ message: `Build has been re-ran, redirecting...` });
					router.push(res.data.logURL);
				} else {
					notification.error({ message: res.messages.join(", ") });
				}
			})
			.catch((e) => notification.error({ message: `Unable to re-run the build: ${e}` }));

		notification.info({ message: `This feature is under development.` });
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
		// console.log("logData :>> ", logData);
		// console.log("lines :>> ", lines);
		if (!logData) return;
		setMessages(lines);
	}, [lines.length]);

	useEffect(() => {
		scrollToBottom();
	}, [messages.length]);

	useEffect(() => {
		const buildLog = logData?.toString().toLowerCase() || "";

		// display build status
		setStatus(build?.status || "start");

		// display deploy status
		if (env) {
			setDeployStatus(build.deployStatus || "pending");
			if (build.deployStatus !== "pending" && build.deployStatus !== "in_progress") setIsFinished(true);
		} else {
			if (build?.status !== "building") setIsFinished(true);
			setDeployStatus("cancelled");
		}

		// no need to connect to socket if the room is not available:
		if (!SOCKET_ROOM) return () => false;

		// console.log(`[socket] connecting to "${SOCKET_ROOM}" room...`);
		const socket = io(SOCKET_URL, { transports: ["websocket"] });

		socket.on("connect", () => {
			// console.log("[socket] connected:", socket.connected, `(ROOM: ${SOCKET_ROOM})`);

			// Join to the room:
			socket.emit("join", { room: SOCKET_ROOM });

			// Listen on the server:
			socket.on("message", ({ action, message }: { action: string; message: string }) => {
				// console.log("[socket] message:", { action, message });

				// print out the message
				if (message) {
					setMessages((oldMsgs) => [...oldMsgs, stripAnsiCodes(message)]);

					// if build failed keyword detected -> mark as BUILD FAILED
					if (message?.toLowerCase().indexOf(failedKeyword) > -1 || message?.toLowerCase().indexOf("[error]") > -1) {
						setStatus("failed");
						setIsFinished(true);
						refetchBuildApi(); // <-- reload build api to get build's info
					}
				}

				if (action === "failed") {
					setStatus("failed");
					setIsFinished(true);
					refetchBuildApi(); // <-- reload build api to get build's info
				}

				// if build success keyword detected -> mark as BUILD SUCCEED
				if (action === "end") {
					socket.disconnect();
					setIsFinished(true);
					setStatus("success");
					refetchBuildApi(); // <-- reload build api to get build's info
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
				refetchBuildApi(); // <-- reload build api to get build's info
			}
			// setMessages([]);
		};
	}, [build?.status, build?.deployStatus, release?.status, logData, SOCKET_ROOM]);

	// mount
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted ? (
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
					<Tag key="cli-version" color="gold" icon={<CodeOutlined />}>
						CLI: {build?.cliVersion || "-"}
					</Tag>,
					<Tag key="server-version" color="gold" icon={<DatabaseOutlined />}>
						Server: {build?.serverVersion || "-"}
					</Tag>,
					<Tag key="server-location" color="gold" icon={<GlobalOutlined />}>
						Location: {build?.serverLocation || "-"}
					</Tag>,
					<Tag key="duration" color="gold" icon={<ClockCircleOutlined />}>
						Duration: {buildDuration}
					</Tag>,
					<Tag
						key="status"
						color={status === "success" ? "green" : status === "building" ? "blue" : status === "failed" ? "red" : "default"}
						icon={
							status === "success" ? (
								<CheckCircleOutlined />
							) : status === "building" ? (
								<LoadingOutlined />
							) : status === "failed" ? (
								<ExclamationCircleOutlined />
							) : (
								<></>
							)
						}
					>
						Build: {status}
					</Tag>,
					<Tag
						key="deployStatus"
						color={
							deployStatus === "success"
								? "green"
								: deployStatus === "in_progress"
								? "blue"
								: deployStatus === "failed"
								? "red"
								: deployStatus === "cancelled"
								? "yellow"
								: "default"
						}
						icon={
							deployStatus === "success" ? (
								<CheckCircleOutlined />
							) : deployStatus === "in_progress" ? (
								<LoadingOutlined />
							) : deployStatus === "failed" || deployStatus === "cancelled" ? (
								<ExclamationCircleOutlined />
							) : (
								<></>
							)
						}
					>
						Deploy: {deployStatus || "N/A"}
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

			<div className="flex-auto overflow-x-auto overflow-y-scroll" ref={frameRef}>
				<pre
					className="no-scrollbar bg-black p-4 pt-6 text-neutral-200"
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
									.map((word) => {
										let _word = word;
										if (word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
											_word = `<a href="${word.replace(/"/gi, "")}" target="_blank" style="color: #008dff">${word.replace(
												/"/gi,
												""
											)}</a>`;
										}
										return _word;
									})
									.join(" ");

								return <p key={`log-line-${index}`}>{parser(msgWithLink)}</p>;
							}

							return <p key={`log-line-${index}`}>{parser(`${message}`)}</p>;
						})}
					<p ref={bottomEl}></p>
				</pre>
			</div>

			<div className="flex-col px-4 py-2 md:flex">
				<div className="flex-auto">
					{/* BUILD STATUS */}
					{status === "building" && (
						<h3 className="text-xl text-blue-600">
							<LoadingOutlined /> Build: In progress.
						</h3>
					)}
					{status === "failed" && (
						<h2 className="text-xl text-red-600">
							<ExclamationCircleOutlined /> Build: Failed.
						</h2>
					)}
					{status === "success" && (
						<h2 className="text-xl text-green-600">
							<CheckCircleOutlined /> Build: Success.
						</h2>
					)}

					{/* DEPLOY STATUS */}
					{deployStatus === "cancelled" ? (
						<h3 className="text-xl text-yellow-600">
							<ClockCircleOutlined /> Deploy: Cancelled.
						</h3>
					) : deployStatus === "in_progress" ? (
						<h3 className="text-xl text-blue-600">
							<LoadingOutlined /> Deploy: In progress.
						</h3>
					) : deployStatus === "failed" ? (
						<h3 className="text-xl text-red-600">
							<ExclamationCircleOutlined /> Deploy: Failed.
						</h3>
					) : deployStatus === "success" ? (
						<h3 className="text-xl text-green-600">
							<CheckCircleOutlined /> Deploy: Success.
						</h3>
					) : deployStatus === "pending" ? (
						<h3 className="text-xl">
							<ClockCircleOutlined /> Deploy: Wait for building.
						</h3>
					) : (
						<h3 className="text-xl">
							<ClockCircleOutlined /> Deploy: N/A.
						</h3>
					)}

					{/* Congrats, your build process has been finished successfully! */}
				</div>

				{/* Go to bottom */}
				<div className="flex gap-2">
					{/* RE-RUN BUILD & DEPLOY PROCESS */}
					{buildStatus === "building" && (
						<Button icon={<StopOutlined />} onClick={() => stopBuildApi({ slug: build_slug })}>
							STOP
						</Button>
					)}
					{buildStatus !== "building" && typeof env !== "undefined" && (
						<Button icon={<RedoOutlined />} onClick={() => rerunBuildAndDeploy()}>
							RE-RUN
						</Button>
					)}
					{buildStatus !== "building" && (
						<Button icon={<RedoOutlined />} onClick={() => rerunBuild()}>
							RE-BUILD
						</Button>
					)}
					<Button onClick={() => setWrap(!wrap)}>{wrap ? "UNWRAP" : "WRAP"}</Button>
					<Button icon={<ArrowDownOutlined />} onClick={() => scrollToBottom()} />
				</div>
			</div>
		</div>
	) : null;
};
