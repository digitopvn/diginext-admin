import type { ResourceQuotaSize } from "@/api/api-types";

export type ResourceQuota = {
	requests: { cpu: string | null; memory: string | null };
	limits: { cpu: string | null; memory: string | null };
};

export const containerResources: Record<ResourceQuotaSize, ResourceQuota> = {
	none: {
		requests: { cpu: null, memory: null },
		limits: { cpu: null, memory: null },
	},
	"1x": {
		requests: { cpu: "50m", memory: "128Mi" },
		limits: { cpu: "50m", memory: "128Mi" },
	},
	"2x": {
		requests: { cpu: "100m", memory: "256Mi" },
		limits: { cpu: "100m", memory: "256Mi" },
	},
	"3x": {
		requests: { cpu: "200m", memory: "512Mi" },
		limits: { cpu: "200m", memory: "512Mi" },
	},
	"4x": {
		requests: { cpu: "400m", memory: "1024Mi" },
		limits: { cpu: "400m", memory: "1024Mi" },
	},
	"5x": {
		requests: { cpu: "600m", memory: "2048Mi" },
		limits: { cpu: "600m", memory: "2048Mi" },
	},
	"6x": {
		requests: { cpu: "1000m", memory: "4096Mi" },
		limits: { cpu: "1000m", memory: "4096Mi" },
	},
	"7x": {
		requests: { cpu: "2000m", memory: "8192Mi" },
		limits: { cpu: "2000m", memory: "8192Mi" },
	},
	"8x": {
		requests: { cpu: "4000m", memory: "16384Mi" },
		limits: { cpu: "4000m", memory: "16384Mi" },
	},
	"9x": {
		requests: { cpu: "8000m", memory: "32768Mi" },
		limits: { cpu: "8000m", memory: "32768Mi" },
	},
	"10x": {
		requests: { cpu: "16000m", memory: "65536Mi" },
		limits: { cpu: "16000m", memory: "65536Mi" },
	},
};

function getQuotaByScale(origin: number, scale: number) {
	let result = origin;
	for (let i = 1; i < scale; i++) result *= 2;
	return result;
}

export const getContainerResourceBySize = (size: ResourceQuotaSize) => {
	return containerResources[size];
	// const scale = toNumber(size.substring(0, size.length - 1));
	// return {
	// 	requests: {
	// 		cpu: `${getQuotaByScale(originalCPU, scale)}m`,
	// 		memory: `${getQuotaByScale(originalMemory, scale)}Mi`,
	// 	},
	// 	limits: {
	// 		cpu: `${getQuotaByScale(originalCPU, scale)}m`,
	// 		memory: `${getQuotaByScale(originalMemory, scale)}Mi`,
	// 	},
	// };
};
