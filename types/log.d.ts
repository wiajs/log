export default class Log {
    constructor(opts: any);
    dgs: {
        debug: debug.Debugger;
        info: debug.Debugger;
        err: debug.Debugger;
        warn: debug.Debugger;
    };
    debug(...args: any[]): void;
    error(...args: any[]): void;
    err(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
}
import debug from 'debug';
export function name(file: string): string;
export function log(...args: any[]): {
    (...args2: any): void;
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    err: (...args: any[]) => void;
};
