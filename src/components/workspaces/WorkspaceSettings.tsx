import dayjs from "dayjs";
import React from "react";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const WorkspaceSettings = () => {
	return (
		<div className="px-4 py-6">
			<h2>(Coming soon)</h2>
		</div>
	);
};
