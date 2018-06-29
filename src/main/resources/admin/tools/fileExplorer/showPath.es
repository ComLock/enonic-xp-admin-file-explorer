import {readFile} from '/lib/openxp/file-system';
import showFile from './showFile';
import showDirectory from './showDirectory';


export default function showPath(path) {
	const entry = readFile(path);
	if (!entry.exists || entry.isHidden || entry.name.startsWith('.')) {
		return {status: 404};
	}
	if (entry.isDirectory) {
		return showDirectory(entry);
	}
	if (entry.isFile) {
		return showFile(entry);
	}
	throw new Error(`Path not file or directory ${path}`);
}
