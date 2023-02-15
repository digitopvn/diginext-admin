export const isObject = (input: any) => {
	if (typeof input === "undefined" || input === null) return false;
	return input.constructor.name === "Object";
};
