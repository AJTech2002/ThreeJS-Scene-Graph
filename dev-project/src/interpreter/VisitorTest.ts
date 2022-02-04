import MemoryStore from "./ReferenceMemoryStore";
import Visitor from "./Visitor";
import { parse, defaultOptions } from "acorn";

export default class VisitorTest {

    public memoryStore: MemoryStore = new MemoryStore();
    public visitor: Visitor;
    public privateVariable: string = "privateVar";
    public publicVariable: string = "publicVar";

    constructor() {



        this.memoryStore.registerThis(this);
        this.memoryStore.registerVariable("publicVariable");
        this.memoryStore.registerFunction("printA");

        this.visitor = new Visitor(this.memoryStore);

        this.test();

    }

    printA() {
        console.log("A");
    }


    test() {
        let code: string =
            "this.printA();"

        let parsed: any = parse(code, defaultOptions);
        console.log(parsed);
        this.visitor.visitNode(parsed);
    }

}