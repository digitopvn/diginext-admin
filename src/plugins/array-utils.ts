export function filterDuplicatedItems(array: string[]) {
	const uniqueArray: string[] = array.filter((value, index, self) => {
		return self.indexOf(value) === index;
	});
	return uniqueArray;
}

export function filterUniqueItems<T>(arr: T[]): T[] {
	return [...new Set(arr)];
}
