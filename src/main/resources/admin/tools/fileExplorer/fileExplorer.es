//import {toStr} from '/lib/enonic/util';
import {
    //filesInDirectory,
    getContent,
    readFile
} from '/lib/openxp/file-system';


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


export function get() {
    //const files = filesInDirectory(XP_HOME); //log.info(toStr({files}));

    let listItemsHtml = '';

    [
        '/etc/hosts',
        'c:\\Windows\\System32\\Drivers\\etc\\hosts',
        `${JAVA_HOME}/lib/security/java.security`
    ].forEach((path) => {
        const file = readFile(path);
        if (file.exists) {
            listItemsHtml += `<li>${path}<pre>${getContent(file, true).split('\n')
                .filter(l => !l.startsWith('#'))
                .filter(l => !l.match(/^\s*$/))
                .join('\n')}</pre></li>`;
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
            listItemsHtml += `<li>${fileAbsolutePathName}: <pre>${stripped}</pre></li>`;
        }
    });

    return {
        body: `<html>
    <head></head>
    <body>
        <h1>File Explorer</h1>
        <ul>${listItemsHtml}</ul>
    </body>
</html>`,
        contentType: 'text/html; charset=utf-8'
    };
}
