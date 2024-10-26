"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameComponent {
    constructor(name, gameObject, componentProps) {
        this.input = undefined;
        this.transform = null;
        this.name = name;
        this.gameObject = gameObject;
        this.props = componentProps;
    }
    awake() { }
    update(dt) { }
    onKeyDown(key) { }
    onKeyUp(key) { }
    // We can use this loop in the editor to match props to props
    executeOnEditorUpdate() { }
}
exports.default = GameComponent;
