"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["Left"] = 1] = "Left";
    MouseButtons[MouseButtons["Middle"] = 2] = "Middle";
    MouseButtons[MouseButtons["Right"] = 4] = "Right";
    MouseButtons[MouseButtons["None"] = 8] = "None";
})(MouseButtons || (MouseButtons = {}));
class Input {
    constructor(scene) {
        this.mouseButtons = MouseButtons.None;
        this.inputMappings = {};
        this.scene = scene;
        this.keyIsPressed = this.keyIsPressed.bind(this);
        this.mousePosition = new three_1.Vector2(0, 0);
    }
    mapMouse(inputMouseButton) {
        return Math.pow(2, inputMouseButton);
    }
    setup() {
        document.addEventListener("keydown", (e) => {
            var _a;
            if (!this.keyIsPressed(e.key.toLowerCase()))
                (_a = this.scene) === null || _a === void 0 ? void 0 : _a.inputEvent(0, e.key.toLowerCase());
            this.inputMappings[e.key.toLowerCase()] = true;
        });
        document.addEventListener("keyup", (e) => {
            var _a;
            if (this.keyIsPressed(e.key.toLowerCase()))
                (_a = this.scene) === null || _a === void 0 ? void 0 : _a.inputEvent(1, e.key.toLowerCase());
            this.inputMappings[e.key.toLowerCase()] = false;
        });
        document.addEventListener("mousemove", (e) => {
            this.mousePosition = new three_1.Vector2(e.clientX, e.clientY);
        });
        document.addEventListener("mousedown", (e) => {
            this.mouseButtons |= this.mapMouse(e.button);
        });
        document.addEventListener("mouseup", (e) => {
            this.mouseButtons &= ~this.mapMouse(e.button);
        });
        window.addEventListener("blur", (e) => {
            this.inputMappings = {};
        });
    }
    getMouseButton(mouseButton) {
        if (this.mouseButtons & this.mapMouse(mouseButton))
            return true;
        return false;
    }
    getAdjustedMousePosition() {
        let mouse = new three_1.Vector2();
        mouse.x = (this.mousePosition.x / window.innerWidth) * 2 - 1;
        mouse.y = -(this.mousePosition.y / window.innerHeight) * 2 + 1;
        return mouse;
    }
    getRawHorizontal() {
        if (this.keyIsPressed("A"))
            return -1;
        if (this.keyIsPressed("D"))
            return 1;
        return 0;
    }
    getRawVertical() {
        if (this.keyIsPressed("W"))
            return 1;
        if (this.keyIsPressed("S"))
            return -1;
        return 0;
    }
    keyIsPressed(key) {
        if (key.toLowerCase() in this.inputMappings &&
            this.inputMappings[key.toLowerCase()] === true)
            return true;
        return false;
    }
}
exports.default = Input;
