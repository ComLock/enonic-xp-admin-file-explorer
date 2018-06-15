import {toStr} from '/lib/enonic/util';


const System = Java.type('java.lang.System');


export function get() {
    log.info(toStr({XP_HOME: System.getProperty('xp.home')}));
    return {
        body: '<html><head></head><body><h1>Hello world!</h1></body></html>',
        contentType: 'text/html; charset=utf-8'
    };
}
