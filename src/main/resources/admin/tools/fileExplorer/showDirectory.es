//──────────────────────────────────────────────────────────────────────────────
// Enonic Libs (in jar, resolved runtime)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {
	dirsInDirectory,
	filesInDirectory
} from '/lib/openxp/file-system';
import {serviceUrl} from '/lib/xp/portal';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {clone, access, li, a} from 'render-js/src/class.es';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import page, {OL, DOWNLOAD_SVG, HOME_SVG} from './page.es';
import parentPath from './parentPath.es';
import respond from './respond.es';
import sortByName from './sortByName.es';


//──────────────────────────────────────────────────────────────────────────────
// Default export
//──────────────────────────────────────────────────────────────────────────────
export default function showDirectory(dir) {
	//log.info(toStr({dir}));
	const dirs = dirsInDirectory(dir.absolutePath)
		.filter(e => !e.hidden)
		.filter(e => !e.name.startsWith('.'))
		.sort(sortByName); //log.info(toStr({dirs}));
	const files = filesInDirectory(dir.absolutePath)
		.filter(e => !e.hidden)
		.filter(e => !e.name.startsWith('.'))
		.sort(sortByName); //log.info(toStr({files}));

	const list = clone(OL);
	const listAccess = access(list);

	listAccess.addContent(li(a({href: '?'}, HOME_SVG)));
	if (dir.name) { // not root
		listAccess.addContent(li(a({href: `?path=${parentPath(dir)}`}, '..')));
	}

	const downloadServiceUrl = serviceUrl({service: 'download'});
	listAccess.addContent(
		dirs.map(d => li(a({href: `?path=${d.absolutePath}`}, d.name)))
			.concat(files.map(file => li([
				a({href: `?path=${file.absolutePath}`}, file.name),
				'&nbsp;',
				a({href: `${downloadServiceUrl}?path=${file.absolutePath}`}, DOWNLOAD_SVG)
			]))));
	const dom = page({
		title: `${dir.absolutePath} : File Explorer`,
		content: list
	});
	return respond(dom);
}
