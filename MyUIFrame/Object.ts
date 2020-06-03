type SlotFunc = (args : any[])=>void;

export class Object_{
    connect(sign:string,slot : (args : any[])=>void){
        let funcs = this.eventMap.get(sign);
        if(funcs === undefined){
            let funcs = new Array<SlotFunc>();
            funcs.push(slot);
            this.eventMap.set(sign,funcs);
        }
        else{
            funcs.push(slot);
        }
    }
    disconnect(sign:string){
        this.eventMap.delete(sign);
    }

    callFunc(key:string,args:any[]){
        let funcs = this.eventMap.get(key);
        if(funcs !== undefined){
            for(let func of funcs)
                func(args);
        }
    }

    
    eventMap = new Map<string,SlotFunc[]>();
    VAO !:WebGLVertexArrayObject;
}