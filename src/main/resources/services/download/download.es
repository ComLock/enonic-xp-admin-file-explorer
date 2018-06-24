import {
	getContent,
	readFile
} from '/lib/openxp/file-system';
import {hasRole} from '/lib/xp/auth';


export function get(req) {
	if (!hasRole('system.admin')) { return { status: 401 }; }
	const file = readFile(req.params.path);
	if (file.exists && file.isFile) {
		return {
			body: getContent(file),
			headers: {
				'Content-Disposition': `attachment; filename="${file.name}"`
			}
		};
	}
	return {
		status: 404
	};
}
