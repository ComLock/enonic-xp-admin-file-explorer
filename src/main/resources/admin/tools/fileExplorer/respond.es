//──────────────────────────────────────────────────────────────────────────────
// Enonic Libs (in jar, resolved runtime)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';


//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {style, access, render} from 'render-js/src/class.es';


export default function respond(dom) {
	//log.info(toStr({dom}));
	access(dom, 'html.head').addContent(style({type: 'text/css'}, render(dom).css.join('')));
	return {
		body: render(dom).html,
		contentType: 'text/html; charset=utf-8'
	};
}
