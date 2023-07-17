import { toNumber } from "lodash";

import type { ResourceQuotaSize } from "@/api/api-types";

const originalCPU = 20;
const originalMemory = 128;

function getQuotaByScale(origin: number, scale: number) {
	let result = origin;
	for (let i = 1; i < scale; i++) result *= 2;
	return result;
}

export const getContainerResourceBySize = (size: ResourceQuotaSize) => {
	if (size === "none") return {};
	const scale = toNumber(size.substring(0, size.length - 1));
	return {
		requests: {
			cpu: `${getQuotaByScale(originalCPU, scale)}m`,
			memory: `${getQuotaByScale(originalMemory, scale)}Mi`,
		},
		limits: {
			cpu: `${getQuotaByScale(originalCPU, scale)}m`,
			memory: `${getQuotaByScale(originalMemory, scale)}Mi`,
		},
	};
};
