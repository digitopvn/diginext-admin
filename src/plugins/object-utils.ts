/* eslint-disable no-nested-ternary */

import { isEmpty } from "lodash";

/**
 * Check whether the input param is {Object}
 * @param input
 */
export const isObject = (input: any) => {
	if (typeof input === "undefined" || input === null) return false;
	return input.constructor.name === "Object";
};

/**
 * Flatten the object into 1-level-object (with key paths)
 * @example
 * {a: {b: [{c: 1}, {c: 2}]}, e: 3} -> {"a.b.0.c": 1, "a.b.1.c": 2, "e": 3}
 */
export function flattenObjectPaths(object: any = {}, initialPathPrefix = "") {
	if (!object || typeof object !== "object") return [{ [initialPathPrefix]: object }];

	const prefix = initialPathPrefix ? (Array.isArray(object) ? initialPathPrefix : `${initialPathPrefix}.`) : "";

	const _arr = Object.entries(object).flatMap(([key, val]) =>
		flattenObjectPaths(object[key], Array.isArray(object) ? `${prefix}.${key}` : `${prefix}${key}`)
	);
	// console.log("_arr :>> ", _arr);

	if (isEmpty(_arr)) return {};

	const res = _arr.reduce((acc, _path) => ({ ...acc, ..._path })) as any;
	// console.log("res :>> ", res);

	return res;
}
