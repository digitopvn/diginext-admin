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
	site_name: "DXUP",
	title: "DXUP",
	description: "Welcome to the Dashboard of DXUP.",
	locale: "en",
	tableConfig: {
		defaultPageSize: 50,
	},
};

export class Config {
	static grab = (key: string, defaultValue: string = "") => {
		const env = { ...process.env };
		return env[key] ?? defaultValue;
	};

	static get DX_SITE() {
		return this.NEXT_PUBLIC_ENV === "development" ? "http://localhost:4000" : "https://diginext.site";
	}

	static get ENV() {
		return this.grab("NODE_ENV", "development").toUpperCase();
	}

	static get NEXT_PUBLIC_BASE_PATH() {
		return process.env.NEXT_PUBLIC_BASE_PATH || "";
	}

	static getBasePath(extendedPath = "") {
		const { NEXT_PUBLIC_BASE_PATH } = this;
		return (NEXT_PUBLIC_BASE_PATH === "" ? NEXT_PUBLIC_BASE_PATH : `/${NEXT_PUBLIC_BASE_PATH}`) + extendedPath;
	}

	static path(extendedPath = "") {
		return this.getBasePath(extendedPath);
	}

	static get NEXT_PUBLIC_ENV() {
		return process.env.NEXT_PUBLIC_ENV || "development";
	}

	static get NEXT_PUBLIC_API_BASE_URL() {
		if (typeof window !== "undefined") {
			if (window.location.origin.indexOf("localhost") > -1 && process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
			return window.location.origin;
		}
		return "/";
	}

	static get NEXT_PUBLIC_DOMAIN() {
		return process.env.NEXT_PUBLIC_DOMAIN;
	}

	static get NEXT_PUBLIC_BASE_URL() {
		return typeof window !== "undefined" ? window.location.origin : trimEnd(process.env.NEXT_PUBLIC_BASE_URL || "", "/") || "/";
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
