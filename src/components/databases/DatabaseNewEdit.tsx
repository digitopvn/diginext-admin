import { useState } from "react";

import { useCloudDatabaseCreateApi, useCloudDatabaseSlugApi, useCloudDatabaseUpdateApi } from "@/api/api-cloud-database";
import type { CloudDatabaseType } from "@/api/api-types";
import { type ICluster as ICloudDatabase, cloudDatabaseList } from "@/api/api-types";
import SmartForm from "@/commons/smart-form/SmartForm";
import type { SmartFormElementProps } from "@/commons/smart-form/SmartFormTypes";
import { useRouterQuery } from "@/plugins/useRouterQuery";

type DatabaseNewEditProps = { data?: ICloudDatabase; isNew?: boolean };

const DatabaseNewEdit = (props: DatabaseNewEditProps = {}) => {
	const [{ database }] = useRouterQuery();

	// clusters
	const useSlugApi = useCloudDatabaseSlugApi(database, { populate: "owner" });
	const { data: db } = useSlugApi;

	const useUpdateApi = useCloudDatabaseUpdateApi({ filter: { id: db?._id } });
	const useCreateApi = useCloudDatabaseCreateApi();
	// console.log("cluster :>> ", cluster);

	// providers
	// const { data: { list: providers = [] } = {} } = useCloudProviderListApi();
	const [databaseType, setDatabaseType] = useState<CloudDatabaseType>();
	// console.log("providers :>> ", providers);

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
		{ type: "input", label: "Host", name: "host", placeholder: "10.10.10.10", visible: typeof db?.url === "undefined" },
		{ type: "input", label: "Port", name: "port", placeholder: "27017", visible: typeof db?.url === "undefined" },
		{ type: "input", label: "User", name: "user", placeholder: "root", visible: typeof db?.url === "undefined" },
		{ type: "password", label: "Pass", name: "pass", visible: typeof db?.url === "undefined" },
		{ type: "input", label: "Auth database", name: "authDb", placeholder: "admin", visible: typeof db?.url === "undefined" },
	];

	return <SmartForm name="database" api={{ useSlugApi, useUpdateApi, useCreateApi }} configs={smartFormConfigs} />;
};

export default DatabaseNewEdit;
