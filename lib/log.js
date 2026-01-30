import debug from 'debug';
import path from 'path';
import { fileURLToPath } from 'url';
let Log = class Log {
    /**
   *
   * @param  {...any} args
   */ debug(...args) {
        const first = args == null ? void 0 : args[0];
        const last = args == null ? void 0 : args[args.length - 1];
        if (typeof first === 'string') {
            args.shift();
            this.dgs.debug(first, ...args);
        } else if (typeof first === 'object' && typeof last === 'string') this.dgs.debug(`${last}:%O`, first);
    // args[0] = `${this.pre}:${args[0]}`
    // console.debug(...args)
    // console.debug(this.pre, ...args)
    }
    /**
   *
   * @param  {...any} args
   */ error(...args) {
        const first = args == null ? void 0 : args[0];
        const last = args == null ? void 0 : args[args.length - 1];
        if (typeof first === 'string') {
            args.shift();
            this.dgs.err(` ${first}`, ...args);
        } else if (typeof first === 'object' && typeof last === 'string') this.dgs.err(` ${last}:%O`, first);
    }
    /**
   *
   * @param  {...any} args
   */ err(...args) {
        const first = args == null ? void 0 : args[0];
        if ((first == null ? void 0 : first.message) || (first == null ? void 0 : first.msg)) {
            args[0] = {
                exp: first.message || first.msg
            };
            if (first == null ? void 0 : first.code) args[0].exp += ` code:${first.code}`;
        }
        this.error(...args);
    }
    /**
   *
   * @param  {...any} args
   */ warn(...args) {
        const first = args == null ? void 0 : args[0];
        const last = args == null ? void 0 : args[args.length - 1];
        if (typeof first === 'string') {
            args.shift();
            this.dgs.warn(first, ...args);
        } else if (typeof first === 'object' && typeof last === 'string') this.dgs.warn(`${last}:%O`, first);
    }
    /**
   *
   * @param  {...any} args
   */ info(...args) {
        const first = args == null ? void 0 : args[0];
        const last = args == null ? void 0 : args[args.length - 1];
        // const dg = debug('ab')
        // dg()
        if (typeof first === 'string') {
            args.shift();
            this.dgs.info(first, ...args);
        } else if (typeof first === 'object' && typeof last === 'string') this.dgs.info(`${last}:%O`, first);
    }
    /**
   * 构造函数
   * @param {*} opts {
   *  pre: 前缀，一般是模块名称,
   *  env: NODE_DEBUG 环境变量
   * }
   */ constructor(opts){
        let { env } = opts;
        env = env != null ? env : '';
        const dgs = {} // debugs
        ;
        dgs.debug = debug(`${env}`);
        dgs.info = debug(`${env}:info`);
        dgs.err = debug(`${env}:err`);
        dgs.warn = debug(`${env}:warn`);
        // 仅最后调用生效，覆盖环境变量
        if (dgs.debug.enabled) debug.enable('*');
        else if (dgs.info.enabled) debug.enable(`${env}:info,${env}:err,${env}:warn`);
        else debug.enable(`${env}:err,${env}:warn`);
        this.dgs = dgs;
    }
};
/**
 * debug日志封装,
 * 使用方法：
 * import {log as Log, filename} from './log.js'
 * const log = Log({env: `wia:${filename(__filename)}`})
 * log('hello')
 * log({a: 1, b: 2}, 'fun')
 * log.error/err/info/warn
 * $env:DEBUG=* 全开
 * $env:DEBUG=*:log 全开
 * $env:DEBUG=*:info log 不开，其他全开
 * warn 和 err 一直打开！
 */ export { Log as default };
/**
 * 标准日志输出或构建模块日志类实例，用于模块中带[m:xxx]标记日志输出
 * 启用 {f:fn} 标记时，需在函数尾部清除f（log({f:''})），否则会溢出到其他函数
 * @param {...any} args - params
 * returns {pino & (...args) => void}
 */ function log(...args) {
    const last = args == null ? void 0 : args[args.length - 1];
    // 全局日志
    if (args.length !== 1 || !(last == null ? void 0 : last.env)) return;
    const { env } = last;
    // 唯一 env 属性，则构造新的 log 实例，这种写法，能被jsDoc识别子属性
    const lg = new Log({
        env
    });
    /** @param {*} args2 */ const R = (...args2)=>lg.debug(...args2);
    R.debug = lg.debug.bind(lg);
    R.info = lg.info.bind(lg);
    R.warn = lg.warn.bind(lg);
    R.info = lg.info.bind(lg);
    R.error = lg.error.bind(lg);
    R.err = lg.err.bind(lg);
    return R;
}
/**
 * 获取模块文件名称
 * esm: import.meta.url or cjs: __filename
 * @param {string} file
 * @returns
 */ function name(file) {
    // import.meta.url: 'file:///D:/prj/wiajs/req/test/log.t.js'
    file = fileURLToPath(file) // fileUrl 转成路径
    ;
    const baseName = path.basename(file);
    return baseName.replace(path.extname(baseName), '');
}
export { log, name };
