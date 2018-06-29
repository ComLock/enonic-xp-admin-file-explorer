import {getContent} from '/lib/openxp/file-system';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {a, pre} from 'render-js/src/class.es';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import page from './page.es';
import parentPath from './parentPath.es';
import respond from './respond.es';


export default function showFile(file) {
	const dom = page({
		title: file.absolutePath,
		content: [
			a({href: `?path=${parentPath(file)}`}, '..'),
			pre(getContent(file, true))
		]
	});
	return respond(dom);
}
