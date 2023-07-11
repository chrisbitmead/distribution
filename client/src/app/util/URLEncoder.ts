
export class URLEncoder {
    private args = {};

    constructor(private host: string,
                private base: string) {
    }

    public addArg(name: string, val: any): void {
        if (val) {
            this.args[name] = encodeURIComponent(val.toString().trim());
        }
    }

    public make() {
        const jargs = Object.entries(this.args).map(x => x[0] + '=' + x[1]).join('&');
        let rtn = this.host + this.base;
        if (jargs) {
            rtn += '?' + jargs;
        }
        return rtn;
    }
}
