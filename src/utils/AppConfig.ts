// FIXME: Update this configuration file based on your project information

import { toBool, toInt } from "diginext-utils/dist/object";
import { trimEnd } from "lodash";

export const EnvName = {
	DEVELOPMENT: "development",
	STAGING: "staging",
	CANARY: "canary",
	PRODUCTION: "production",
};

export const AppConfig = {
	site_name: "Diginext Admin",
	title: "Diginext Admin",
	description: "Welcome to an Admin Panel of Diginext.",
	locale: "en",
	tableConfig: {
		defaultPageSize: 20,
	},
};

export class Config {
	static grab = (key: string, defaultValue: string = "") => {
		const env = { ...process.env };
		console.log("process.env :>> ", process.env);
		console.log("process.env :>> ", process.env.NEXT_PUBLIC_ENV);
		return env[key] ?? defaultValue;
	};

	static get ENV() {
		return this.grab("NODE_ENV", "development").toUpperCase();
	}

	static get NEXT_PUBLIC_BASE_PATH() {
		return process.env.NEXT_PUBLIC_BASE_PATH;
	}

	static getBasePath(extendedPath = "") {
		const { NEXT_PUBLIC_BASE_PATH } = this;
		return (NEXT_PUBLIC_BASE_PATH === "" ? NEXT_PUBLIC_BASE_PATH : `/${NEXT_PUBLIC_BASE_PATH}`) + extendedPath;
	}

	static path(extendedPath = "") {
		return this.getBasePath(extendedPath);
	}

	static get PORT() {
		return toInt(this.grab("PORT")) || toInt(this.grab("NODE_PORT")) || 4000;
	}

	static get BASE_URL() {
		return trimEnd(this.grab("BASE_URL", `http://localhost:${this.PORT}`), "/");
	}

	static get NEXT_PUBLIC_ENV() {
		return process.env.NEXT_PUBLIC_ENV;
	}

	static get NEXT_PUBLIC_API_BASE_URL() {
		return trimEnd(process.env.NEXT_PUBLIC_API_BASE_URL, "/") || `http://localhost:${this.PORT}`;
	}

	static get NEXT_PUBLIC_DOMAIN() {
		return process.env.NEXT_PUBLIC_DOMAIN;
	}

	static get NEXT_PUBLIC_BASE_URL() {
		return trimEnd(process.env.NEXT_PUBLIC_BASE_URL, "/") || `http://localhost:${this.PORT}`;
	}

	static get DISABLE_INPECT_MEMORY() {
		return toBool(this.grab("DISABLE_INPECT_MEMORY"));
	}

	static get SECONDS_INPECT_MEMORY() {
		return toInt(this.grab("SECONDS_INPECT_MEMORY"));
	}

	static get CORS_WHITELIST() {
		return process.env.CORS_WHITELIST
			? process.env.CORS_WHITELIST.split(";")
			: ["localhost", "192.168", "127.0", "digitop.vn", "diginext.site", "diginext.vn"];
	}
}

// Extensions
export const isDev = () => Config.NEXT_PUBLIC_ENV === EnvName.DEVELOPMENT;
export const isStaging = () => Config.NEXT_PUBLIC_ENV === EnvName.STAGING;
export const isProd = () => Config.NEXT_PUBLIC_ENV === EnvName.PRODUCTION;
export const isCanary = () => Config.NEXT_PUBLIC_ENV === EnvName.CANARY;
