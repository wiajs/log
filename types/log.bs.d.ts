export default log;
declare function log(...args: any[]): {
    (...args2: any): void;
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    trace: (...args: any[]) => void;
    error: (...args: any[]) => void;
    err: (...args: any[]) => void;
};
declare namespace log {
    function err(...args: any[]): void;
    function error(...args: any[]): void;
    function warn(...args: any[]): void;
    function info(...args: any[]): void;
    function debug(...args: any[]): void;
    function trace(...args: any[]): void;
}
