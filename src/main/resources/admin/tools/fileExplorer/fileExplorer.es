//import {toStr} from '/lib/enonic/util';
import {
	getContent,
	readFile
} from '/lib/openxp/file-system';

//──────────────────────────────────────────────────────────────────────────────
// Node modules (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import {clone, addContent, h1, li, a, table, tr, th, td, pre} from 'render-js/src/class.es';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (resolved and webpacked buildtime)
//──────────────────────────────────────────────────────────────────────────────
import page, {OL} from './page.es';
import respond from './respond.es';
import showPath from './showPath.es';


//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const System = Java.type('java.lang.System');

const XP_HOME = System.getProperty('xp.home'); //log.info(toStr({XP_HOME}));
const JAVA_HOME = System.getProperty('java.home'); //log.info(toStr({JAVA_HOME}));

const DIR_CONFIG = `${XP_HOME}/config`;
const CORE_CONFIG_FILES = [
	'com.enonic.xp.blobstore.cfg',
	'com.enonic.xp.blobstore.file.cfg',
	'com.enonic.xp.elasticsearch.cfg',
	'com.enonic.xp.mail.cfg',
	'com.enonic.xp.market.cfg',
	'com.enonic.xp.media.cfg',
	'com.enonic.xp.repo.cfg',
	'com.enonic.xp.server.deploy.cfg',
	'com.enonic.xp.server.shell.cfg',
	'com.enonic.xp.server.trace.cfg',
	'com.enonic.xp.server.udc.cfg',
	'com.enonic.xp.web.dos.cfg',
	'com.enonic.xp.web.jetty.cfg',
	'com.enonic.xp.web.vhost.cfg',
	'logback.xml',
	'system.properties'
];


//──────────────────────────────────────────────────────────────────────────────
// Public functions
//──────────────────────────────────────────────────────────────────────────────
export function get(req) {
	//log.info(toStr({req}));
	if (req.params.path) {
		return showPath(req.params.path);
	}

	const list = clone(OL);
	['/', 'C:/', 'D:/'].forEach((path) => {
		const dir = readFile(path);
		if (dir.exists) {
			addContent(list, li(a({href: `?path=${dir.absolutePath}`}, path)));
		}
	}); // forEach

	const aTable = table({
		border: '1',
		cellpadding: '0',
		cellspacing: '0'
	});
	[
		'/etc/hosts',
		'c:\\Windows\\System32\\Drivers\\etc\\hosts',
		`${JAVA_HOME}/lib/security/java.security`
	].forEach((path) => {
		const file = readFile(path);
		if (file.exists) {
			//log.info(toStr({file}));
			addContent(aTable, tr([
				th(path),
				td(pre(getContent(file, true).split('\n')
					.filter(l => !l.startsWith('#'))
					.filter(l => !l.match(/^\s*$/))
					.join('\n')))
			]));
		}
	});

	CORE_CONFIG_FILES.forEach((filename) => {
		const fileAbsolutePathName = `${DIR_CONFIG}/${filename}`; //log.info(toStr({fileAbsolutePathName}));

		const file = readFile(fileAbsolutePathName); //log.info(toStr({file}));
		if (file.exists) {
			const content = getContent(file, true); //log.info(toStr({content}));
			//files[filename] = content;
			const stripped = content
				.split('\n')
				.filter(l => !l.startsWith('#'))
				.filter(l => !l.match(/^\s*$/))
				.join('\n')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			addContent(aTable, tr([
				th(fileAbsolutePathName),
				td(pre(stripped))
			]));
		}
	});

	const dom = page({
		title: 'File Explorer',
		content: [
			h1('File Explorer'),
			list,
			aTable
		]
	});
	return respond(dom);
}
