import dayjs from "dayjs";
import { isEmpty } from "lodash";
import React from "react";

import { useAuth } from "@/api/api-auth";
import CenterContainer from "@/commons/CenterContainer";
import CopyCode from "@/commons/CopyCode";

const localizedFormat = require("dayjs/plugin/localizedFormat");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const UserProfile = () => {
	const [user] = useAuth();

	const workspace = user?.activeWorkspace;

	return user ? (
		<CenterContainer className="max-w-md ">
			{workspace && (
				<div className="text-center">
					<p>Your ACCESS TOKEN:</p>
					<CopyCode value={!isEmpty(user) ? (user?.token as any)?.access_token : ""} />
				</div>
			)}
		</CenterContainer>
	) : (
		<>Loading...</>
	);
};
