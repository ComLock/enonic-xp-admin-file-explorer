import {getContent} from '/lib/openxp/file-system';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {ol, li, a, pre} from 'render-js/lib/class';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import page, {HOME_SVG} from './page.es';
import parentPath from './parentPath.es';
import respond from './respond.es';


export default function showFile(file) {
	const dom = page({
		title: `${file.absolutePath} : File Explorer`,
		content: [
			ol({
				_s: {
					listStyleType: 'none',
					padding: '0'
				}
			}, [
				li(a({href: '?'}, HOME_SVG)),
				li(a({href: `?path=${parentPath(file)}`}, '..'))
			]),
			pre(getContent(file, true))
		]
	});
	return respond(dom);
}
