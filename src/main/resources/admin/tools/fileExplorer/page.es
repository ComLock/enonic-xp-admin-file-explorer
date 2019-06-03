//──────────────────────────────────────────────────────────────────────────────
// Enonic Libs (in jar, resolved runtime)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {assetUrl} from '/lib/xp/portal';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {
	doctype, html, head, title as titleEl, body, main, ol,
	svg, symbol, path, use,
	access, build, clone
} from 'render-js/lib/class';


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
	})),
	symbol({
		id: 'home',
		viewBox: '0 0 512 512'
	}, path({
		d: 'M16 256L256 64l96 72v-32h48v72l96 80h-48v192H328V288h-96v160H64V256z',
		stroke: '#000',
		strokeWidth: '12',
		strokeLinejoin: 'round'
	}))
]);


const DOM = [
	doctype(),
	html([
		head(
			titleEl()
		), // head
		body([
			SVG_SYMBOLS,
			main()
		]) // body
	]) // html
];


export const DOWNLOAD_SVG = svg({
	height: '16',
	width: '16'
}, use({'xlink:href': '#download'}));

export const HOME_SVG = svg({
	height: '16',
	width: '16'
}, use({'xlink:href': '#home'}));

export const OL = ol({
	_s: {
		listStyleType: 'none',
		padding: '0'
	}
});
build(OL);


export default function page({
	content = '',
	title = ''
} = {}) {
	const dom = clone(DOM);
	access(dom, 'html.head.title').addContent(title);
	const href = assetUrl({path: '/favicon.ico'});
	access(dom, 'html.head').addContent(`<link rel="shortcut icon" href="${href}" type="image/x-icon">
	<link rel="icon" href="${href}" type="image/x-icon">`);
	access(dom, 'html.body.main').addContent(content);
	//log.info(toStr({dom}));
	return dom;
}
