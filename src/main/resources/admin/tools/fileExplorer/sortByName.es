export default function sortByName(x, y) {
	const nameA = x.name.toUpperCase(); // ignore upper and lowercase
	const nameB = y.name.toUpperCase(); // ignore upper and lowercase
	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	// names must be equal
	return 0;
}
