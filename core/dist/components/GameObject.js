"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameObject {
    constructor(name) {
        this.lastParentName = "";
        this.instantiated = false;
        this.name = name;
        this.components = [];
        this.transform = null;
        this.threeJSScene = null;
        this.scene = null;
        this.parent = null;
        this.parentName = "";
    }
    awake() {
        this.transform = this.findComponent("TransformComponent");
        if (!this.transform)
            console.error("No transform found on : " + this.name);
        this.components.forEach((c) => {
            c.input = this.getInput();
            c.transform = this.transform;
            c === null || c === void 0 ? void 0 : c.awake();
        });
    }
    setParent(gameObject) {
        this.parent = gameObject;
    }
    getInput() {
        var _a;
        return (_a = this.scene) === null || _a === void 0 ? void 0 : _a.inputSystem;
    }
    findComponentOfType(componentName) {
        return this.findComponent(componentName);
    }
    inputEvent(type, key) {
        this.components.forEach((comp) => {
            if (type === 0)
                comp.onKeyDown(key);
            else if (type === 1)
                comp.onKeyUp(key);
        });
    }
    findComponent(name) {
        return this.components.find((e) => e.name === name) || null;
    }
    attachComponent(component) {
        this.components.push(component);
        if (this.instantiated)
            component === null || component === void 0 ? void 0 : component.awake();
    }
    update(dt, editor) {
        if (this.lastParentName !== this.parentName) {
            this.parent = this.scene.findGameObject(this.parentName);
            this.lastParentName = this.parentName;
        }
        this.components.forEach((c) => {
            c === null || c === void 0 ? void 0 : c.update(dt);
            if (editor)
                c.executeOnEditorUpdate();
        });
    }
}
exports.default = GameObject;
