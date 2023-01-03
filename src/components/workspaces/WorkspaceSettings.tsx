import dayjs from "dayjs";
import React from "react";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const WorkspaceSettings = () => {
	return (
		<div>
			<h1>Workspace Settings</h1>
		</div>
	);
};
