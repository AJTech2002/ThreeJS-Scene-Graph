import ControllableComponent from "../game-logic/ControllableComponent";

export default class MemoryStore {

    public memoryStore: any = {};

    public verbose: boolean = false;

    public availableVariables: string[] = [];
    public readOnlyVariables: string[] = [];
    //public availableMethods: string[] = [];

    constructor() {
        this.memoryStore = {};
    }

    createVariable(varName: string, varDefaultValue: string) {
        if (this.verbose)
            console.log("CREATE", this.memoryStore);
        this.memoryStore[varName] = varDefaultValue;
    }

    registerThis(component: any) {
        this.memoryStore['this'] = component;
    }

    registerFunction(functionName: string) {
        if (('this' in this.memoryStore)) {
            this.availableVariables.push(functionName);
            this.readOnlyVariables.push(functionName);
        }
    }

    registerVariable(variableName: string, readOnly: boolean = false) {
        if (('this' in this.memoryStore)) {
            this.availableVariables.push(variableName);
            if (readOnly) this.readOnlyVariables.push(variableName);
        }
    }

    findVariable(varName: string) {
        return this.memoryStore[varName];
    }

    variableExists(varName: string) {
        if (varName in this.memoryStore) return true;
        else return false;
    }

    setVariable(varName: string, newValue: string) {
        this.memoryStore[varName] = newValue;
        if (this.verbose)
            console.log("SET", this.memoryStore);
    }

    log() {
        console.log(this.memoryStore);
    }

}