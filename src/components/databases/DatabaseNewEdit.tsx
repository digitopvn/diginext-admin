import { useState } from "react";

import { useCloudDatabaseCreateApi, useCloudDatabaseSlugApi, useCloudDatabaseUpdateApi } from "@/api/api-cloud-database";
import type { CloudDatabaseType, ICloudDatabase } from "@/api/api-types";
import { cloudDatabaseList } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type DatabaseNewEditProps = { data?: ICloudDatabase; isNew?: boolean };

const DatabaseNewEdit = (props: DatabaseNewEditProps = {}) => {
	const [{ database }] = useRouterQuery();

	// APIs
	const useSlugApi = useCloudDatabaseSlugApi(database, { populate: "owner" });
	const { data: db } = useSlugApi;
	const useUpdateApi = useCloudDatabaseUpdateApi({ filter: { id: db?._id } });
	const useCreateApi = useCloudDatabaseCreateApi();

	// providers
	const [databaseType, setDatabaseType] = useState<CloudDatabaseType>();

	const smartFormConfigs: SmartFormElementProps[] = [
		{ type: "input", label: "Name", name: "name", placeholder: "Give your database a name" },
		{
			type: "select",
			label: "Database type",
			name: "type",
			displayKey: "type", // the magic is here 😅...
			options: cloudDatabaseList.map((dbType) => {
				return { label: dbType || "", value: dbType };
			}),
			onChange: (value) => setDatabaseType(value),
		},

		// Fastest way
		{
			type: "input",
			label: "Connection URI",
			name: "url",
			placeholder: databaseType === "mongodb" ? "mongodb://..." : "postgresql://...",
			visible: databaseType === "mongodb" || databaseType === "postgresql",
		},

		// Alternative way
		{ type: "input", label: "Host", name: "host", placeholder: "10.10.10.10", visible: !db?.url },
		{ type: "input", label: "Port", name: "port", placeholder: "27017", visible: !db?.url },
		{ type: "input", label: "User", name: "user", placeholder: "root", visible: !db?.url },
		{ type: "password", label: "Pass", name: "pass", visible: !db?.url },
		{ type: "input", label: "Auth database", name: "authDb", placeholder: "admin", visible: !db?.url },
	];

	return (
		<SmartForm
			name="database"
			formType={props.isNew ? "new" : "edit"}
			api={{ useSlugApi, useUpdateApi, useCreateApi }}
			configs={smartFormConfigs}
		/>
	);
};

export default DatabaseNewEdit;
