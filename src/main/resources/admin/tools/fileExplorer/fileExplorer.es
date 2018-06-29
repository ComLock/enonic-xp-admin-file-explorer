//import {toStr} from '/lib/enonic/util';
import {
	getContent,
	readFile
} from '/lib/openxp/file-system';
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
		return showPath(req.params.path)
	}

	let tableRowsHtml = '';

	[
		'/etc/hosts',
		'c:\\Windows\\System32\\Drivers\\etc\\hosts',
		`${JAVA_HOME}/lib/security/java.security`
	].forEach((path) => {
		const file = readFile(path);
		if (file.exists) {
			tableRowsHtml += `<tr><th>${path}</th><td><pre>${getContent(file, true).split('\n')
				.filter(l => !l.startsWith('#'))
				.filter(l => !l.match(/^\s*$/))
				.join('\n')}</pre></td></tr>`;
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
			tableRowsHtml += `<tr><th>${fileAbsolutePathName}</th><td><pre>${stripped}</pre></td></tr>`;
		}
	});

	return {
		body: `<html>
	<head></head>
	<body>
		<h1>File Explorer</h1>
		<table border="1" cellpadding="0" cellspacing="0">
			<tr>
				<th>Path</th>
				<th>Content</th>
			</tr>
			${tableRowsHtml}
		</table>
		<ul></ul>
	</body>
</html>`,
		contentType: 'text/html; charset=utf-8'
	};
}
