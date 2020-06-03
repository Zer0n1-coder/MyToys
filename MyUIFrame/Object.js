export class Object_ {
    constructor() {
        this.eventMap = new Map();
    }
    connect(sign, slot) {
        let funcs = this.eventMap.get(sign);
        if (funcs === undefined) {
            let funcs = new Array();
            funcs.push(slot);
            this.eventMap.set(sign, funcs);
        }
        else {
            funcs.push(slot);
        }
    }
    disconnect(sign) {
        this.eventMap.delete(sign);
    }
    callFunc(key, args) {
        let funcs = this.eventMap.get(key);
        if (funcs !== undefined) {
            for (let func of funcs)
                func(args);
        }
    }
}
