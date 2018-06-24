//import {toStr} from '/lib/enonic/util';
import {
	dirsInDirectory,
	filesInDirectory,
	getContent,
	readFile
} from '/lib/openxp/file-system';
import initRouter from '/lib/router';
/*import {
	getHomeToolUrl // Available from 6.14
} from '/lib/xp/admin';*/
import {hasRole} from '/lib/xp/auth';
import {serviceUrl} from '/lib/xp/portal';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {
	doctype, html, head, title, body, main, ol, li, a, pre,
	svg, symbol, path, use,
	style,
	build, clone, access, render
} from 'render-js/src/class.es';


//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const router = initRouter();

const STYLE_OL = {
	listStyleType: 'none'
};

/*const DIR_SVG = svg({
	version: '1',
	viewBox: '0 0 48 48',
	xmlns: 'http://www.w3.org/2000/svg'
}, [
	path({fill: '#FFA000', d: 'M40 12H22l-4-4H8c-2 0-4 2-4 4v8h40v-4c0-2-2-4-4-4z'}),
	path({fill: '#FFCA28', d: 'M40 12H8c-2 0-4 2-4 4v20c0 2 2 4 4 4h32c2 0 4-2 4-4V16c0-2-2-4-4-4z'})
]);

const FILE_SVG = svg({xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792" version="1"}) ><path d="M1267 933v64q0 14-9 23t-23 9H531q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23zm0-256v64q0 14-9 23t-23 9H531q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23zm-896 608h1024V517H979q-40 0-68-28t-28-68V5H371v1280zm640-896h299L1011 90v299zm512 128v800q0 40-28 68t-68 28H339q-40 0-68-28t-28-68V-27q0-40 28-68t68-28h544q40 0 88 20t76 48l408 408q28 28 48 76t20 88z" fill="currentColor"/></svg>*/

const SVG_SYMBOLS = svg({
	style: 'display: none',
	xmlns: 'http://www.w3.org/2000/svg'
}, [
	symbol({
		id: 'download',
		viewBox: '0 -256 1792 1792'
	}, path({
		d: 'M1407 503q17 41-14 70l-448 448q-18 19-45 19t-45-19L407 573q-31-29-14-70 17-39 59-39h256V16q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39zm293 217q14 0 23 9t9 23v576q0 14-9 23t-23 9H100q-14 0-23-9t-9-23V752q0-14 9-23t23-9h192q14 0 23 9t9 23v352h1152V752q0-14 9-23t23-9h192z',
		fill: 'currentColor'
	}))
]);

const DOM = [
	doctype(),
	html([
		head(
			title()
		), // head
		body([
			SVG_SYMBOLS,
			main()
		]) // body
	]) // html
];

const OL = ol({_s: STYLE_OL});
build(OL);

const DOWNLOAD_SVG = svg({
	height: '16',
	width: '16'
}, use({'xlink:href': '#download'}));


//──────────────────────────────────────────────────────────────────────────────
// Private functions
//──────────────────────────────────────────────────────────────────────────────
function sortByName(x, y) {
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


function showDirectory(req) {
	//log.info(toStr({req}));

	const dom = clone(DOM);
	const mainAccess = access(dom, 'html.body.main');

	const aPath = `/${req.pathParams.path || ''}`;
	let parentPath = '';
	if (req.pathParams.path) {
		const pathParts = req.pathParams.path.split('/');
		pathParts.pop();
		parentPath = pathParts.length ? `/${pathParts.join('/')}` : '';
	}

	const entry = readFile(aPath);
	if (entry.isFile) {
		//listAccess.addContent(li(a({href: `${getHomeToolUrl()}/${parentPath}`}, '..')));
		mainAccess.addContent(a({href: `/app/${app.name}${parentPath}`}, '../'));
		mainAccess.addContent(pre(getContent(entry, true)));
	} else if (entry.isDirectory) {
		const dirs = dirsInDirectory(aPath)
			.filter(e => !e.hidden)
			.filter(e => !e.name.startsWith('.'))
			.sort(sortByName); //log.info(toStr({dirs}));
		const files = filesInDirectory(aPath)
			.filter(e => !e.hidden)
			.filter(e => !e.name.startsWith('.'))
			.sort(sortByName); //log.info(toStr({files}));

		const list = clone(OL);
		const listAccess = access(list);
		if (req.pathParams.path) { // aka not root
			//listAccess.addContent(li(a({href: `${getHomeToolUrl()}/${parentPath}`}, '..')));
			listAccess.addContent(li(a({href: `/app/${app.name}${parentPath}`}, '../')));
		}
		const downloadServiceUrl = serviceUrl({service: 'download'});
		listAccess.addContent(
			dirs.concat(files).map((e) => {
				const entryLink = a({href: `${req.path}/${e.name}`}, `${e.name}${e.isDirectory ? '/' : ''}`);
				if (e.isFile) {
					const downloadFileLink = e.isFile ? a({href: `${downloadServiceUrl}?path=${e.absolutePath}`}, DOWNLOAD_SVG) : '';
					return li([entryLink, '&nbsp;', downloadFileLink]);
				}
				return li(entryLink);
			}) // map
		);

		mainAccess.addContent(list);
	} // else isDir

	access(dom, 'html.head').addContent(style({type: 'text/css'}, render(dom).css.join('')));
	return {
		//applyFilters: true,
		body: render(dom).html/*,
		pageContributions: {
			headEnd: [
				style({type: 'text/css'}, r.css.join(''))
			]
		},
		postProcess: true*/
	}; // return
} // function showDirectory


//──────────────────────────────────────────────────────────────────────────────
// Routes
//──────────────────────────────────────────────────────────────────────────────
router.filter((req, next) => {
	if (hasRole('system.admin')) { return next(req); }
	return { status: 401 };
});


// NOTE does not catch paths that ends with a / in 6.11.0 fixed in 6.12.1?
// https://github.com/enonic/xp/issues/5674
router.get('/', req => showDirectory(req));
router.get('/{path:.+}', req => showDirectory(req));


//──────────────────────────────────────────────────────────────────────────────
// Public functions
//──────────────────────────────────────────────────────────────────────────────
export function all(req) {
	return router.dispatch(req);
}
