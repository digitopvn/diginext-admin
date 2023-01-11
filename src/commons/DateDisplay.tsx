import { Tooltip } from "antd";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import React from "react";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const DateDisplay = (props: { children?: ReactNode; date?: string | Date } = {}) => {
	const { date } = props;
	return (
		<Tooltip title={dayjs(date).format("LLL")}>
			<span>{date ? (dayjs(date) as any).fromNow() : "-"}</span>
		</Tooltip>
	);
};
