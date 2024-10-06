/**
 * 前端日志输出，封装 console日志，简化代码，支持模块或直接输出
 * 调用时，描述字符串后置，便于可选缺省，输出时，自带前置，类似 后端pino，保持前后端一致性
 * m 为模块，fn 为函数名称
 */ let Log = class Log {
    /**
	 * @param {string} m 模块
	 */ constructor(m){
        /** @type {string} 模块 */ this.m = "";
        /** @type {string} 函数 */ this.fn = "";
        this.m = m;
    }
    /**
	 * get log desc
	 * 描述字符串后置调用，前置显示
	 * @param {*[]} args
	 * @returns {string}
	 */ getDesc(args) {
        let R = "";
        try {
            const _ = this;
            const { m } = _;
            let fn = "", desc = "";
            if (args.length > 1) {
                const last = args.at(-1);
                if (typeof last === "object") {
                    ({ desc, fn } = last);
                } else if (typeof last === "string") desc = last;
                if (desc || fn) {
                    fn = fn || _.fn;
                    _.fn = fn;
                    args.pop();
                }
            }
            fn = fn || _.fn;
            if (m) desc = `${desc}[${m}${fn ? ":" + fn : ""}]`; // eslint-disable-line
            R = desc;
        } catch (e) {
            console.error(`getDesc exp:${e.message}`);
        }
        return R;
    }
    /** @param {...any} args - params */ log(...args) {
        const _ = this;
        const last = args.at(-1);
        // clear fn
        if (args.length === 1 && typeof last === "object" && last.fn) _.fn = "";
        else {
            const desc = _.getDesc(args);
            console.log(desc, ...args);
        }
    }
    /** @param {...any} args - params */ debug(...args) {
        const _ = this;
        const desc = _.getDesc(args);
        if (desc) console.log(desc, ...args);
        else console.log(...args);
    }
    /** @param {...any} args - params */ info(...args) {
        const _ = this;
        const desc = _.getDesc(args);
        if (desc) console.info(desc, ...args);
        else console.log(...args);
    }
    /** @param {...any} args - params */ warn(...args) {
        const _ = this;
        const { desc, arg } = _.getDesc(args);
        if (desc) console.warn(desc, ...arg);
        else console.log(...args);
    }
    /** @param {...any} args - params */ trace(...args) {
        const _ = this;
        const { desc, arg } = _.getDesc(args);
        if (desc) console.trace(desc, ...arg);
        else console.trace(...args);
    }
    /** @param {...any} args - params */ error(...args) {
        const _ = this;
        const desc = _.getDesc(args);
        if (desc) console.error(desc, ...args);
        else console.log(...args);
    }
    /**
	 * 用于 catch(e) log.err(e)
	 * @param {...any} args - params */ err(...args) {
        const _ = this;
        const first = args?.[0];
        if (first instanceof Error || first && first.message && first.cause && first.stack) args[0] = {
            exp: args[0].message
        };
        _.error(...args);
    }
};
function getDesc(args) {
    let desc = "";
    const last = args.at(-1);
    if (typeof last === "string") {
        desc = last;
        args.pop();
    }
    return desc;
}
/**
 * 标准日志输出或构建模块日志类实例，用于模块中带[m:xxx]标记日志输出
 * 启用 {f:fn} 标记时，需在函数尾部清除f（log({f:''})），否则会溢出到其他函数
 * @param {...any} args - params
 * returns {*}
 */ function log(...args) {
    const last = args.at(-1);
    // 全局日志
    if (args.length !== 1 || !last?.m) {
        const desc = getDesc(args);
        desc ? console.log(desc, ...args) : console.log(...args);
        return;
    }
    // 唯一 m 属性，则构造新的 log 实例，这种写法，能被jsDoc识别子属性
    const lg = new Log(last?.m);
    /** @param {*} args2 */ const R = (...args2)=>lg.log(...args2);
    R.debug = lg.debug.bind(lg);
    R.info = lg.info.bind(lg);
    R.warn = lg.warn.bind(lg);
    R.info = lg.info.bind(lg);
    R.trace = lg.trace.bind(lg);
    R.error = lg.error.bind(lg);
    R.err = lg.err.bind(lg);
    return R;
}
/**
 * 用于 catch(e) log.err(e)
 * @param {...any} args - params */ log.err = (...args)=>{
    const desc = getDesc(args);
    const first = args?.[0];
    if (first instanceof Error || first && first.message && first.cause && first.stack) args[0] = {
        exp: args[0].message
    };
    desc ? console.error(desc, ...args) : console.error(...args);
};
/**
 * @param {...any} args - params */ log.error = (...args)=>{
    const desc = getDesc(args);
    desc ? console.error(desc, ...args) : console.error(...args);
};
/**
 * @param {...any} args - params */ log.warn = (...args)=>{
    const desc = getDesc(args);
    desc ? console.warn(desc, ...args) : console.warn(...args);
};
/**
 * @param {...any} args - params */ log.info = (...args)=>{
    const desc = getDesc(args);
    desc ? console.info(desc, ...args) : console.info(...args);
};
/**
 * @param {...any} args - params */ log.debug = (...args)=>{
    const desc = getDesc(args);
    desc ? console.log(desc, ...args) : console.log(...args);
};
/**
 * @param {...any} args - params */ log.trace = (...args)=>{
    const desc = getDesc(args);
    desc ? console.trace(desc, ...args) : console.trace(...args);
};
// export default log;
export { log, Log };
