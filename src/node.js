import path from "node:path";
import debug from "debug";

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
 */
export default class Log {
	/**
	 * 构造函数
	 * @param {*} opts {
	 *  pre: 前缀，一般是模块名称,
	 *  env: NODE_DEBUG 环境变量
	 * }
	 */
	constructor(opts) {
		let { env } = opts;
		env = env ?? "";
		const ds = {}; // debugs
		ds.debug = debug(`${env}`);
		ds.info = debug(`${env}:info`);
		ds.err = debug(`${env}:err`);
		ds.warn = debug(`${env}:warn`);

		// 仅最后调用生效，覆盖环境变量
		if (ds.debug.enabled) debug.enable("*");
		else if (ds.info.enabled)
			debug.enable(`${env}:info,${env}:err,${env}:warn`);
		else debug.enable(`${env}:err,${env}:warn`);

		this.ds = ds;
	}

	/**
	 *
	 * @param  {...any} args
	 */
	debug(...args) {
		const first = args?.at(0);
		const last = args?.at(-1);
		if (typeof first === "string") {
			args[0] = `${first}`;
			this.ds.debug(...args);
		} else if (typeof first === "object" && typeof last === "string")
			this.ds.debug(`${last}:%O`, first);
		// args[0] = `${this.pre}:${args[0]}`
		// console.debug(...args)
		// console.debug(this.pre, ...args)
	}

	/**
	 *
	 * @param  {...any} args
	 */
	error(...args) {
		const first = args?.at(0);
		const last = args?.at(-1);
		if (typeof first === "string") {
			args[0] = ` ${first}`;
			this.ds.err(...args);
		} else if (typeof first === "object" && typeof last === "string")
			this.ds.err(` ${last}:%O`, first);
	}

	/**
	 *
	 * @param  {...any} args
	 */
	err(...args) {
		const first = args?.[0];
		if (first?.message || first?.msg) {
			args[0] = { exp: first.message || first.msg };
			if (first?.code) args[0].exp += ` code:${first.code}`;
		}
		this.error(...args);
	}

	/**
	 *
	 * @param  {...any} args
	 */
	warn(...args) {
		const first = args?.at(0);
		const last = args?.at(-1);
		if (typeof first === "string") this.ds.warn(...args);
		else if (typeof first === "object" && typeof last === "string")
			this.ds.warn(`${last}:%O`, first);
	}

	/**
	 *
	 * @param  {...any} args
	 */
	info(...args) {
		const first = args?.at(0);
		const last = args?.at(-1);
		if (typeof first === "string") this.ds.info(...args);
		else if (typeof first === "object" && typeof last === "string")
			this.ds.info(`${last}:%O`, first);
	}
}

/**
 * 标准日志输出或构建模块日志类实例，用于模块中带[m:xxx]标记日志输出
 * 启用 {f:fn} 标记时，需在函数尾部清除f（log({f:''})），否则会溢出到其他函数
 * @param {...any} args - params
 * returns {pino & (...args) => void}
 */
function log(...args) {
	const last = args.at(-1);

	// 全局日志
	if (args.length !== 1 || !last?.env) return;

	const { env } = last;
	// 唯一 env 属性，则构造新的 log 实例，这种写法，能被jsDoc识别子属性
	const lg = new Log({ env });

	/** @param {*} args2 */
	const R = (...args2) => lg.debug(...args2);
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
 * @param {string} file
 * @returns
 */
function name(file) {
	const baseName = path.basename(file);
	return baseName.replace(path.extname(baseName), "");
}

export { name, log };
