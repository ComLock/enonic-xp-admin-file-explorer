export default function parentPath(entry) {
	return entry.absolutePath.replace(new RegExp(entry.name + '$'), ''); // eslint-disable-line prefer-template
	//return entry.absolutePath.replace(`${entry.name}$`, '');
}
