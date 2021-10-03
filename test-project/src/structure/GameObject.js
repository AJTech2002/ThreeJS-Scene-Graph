export default class GameObject {

    constructor(name) {
        this.instantiated = false;
        this.name = name;
        this.components = [];

        this.parentName = "";
        this.parent = null;
    }

    awake() {

        this.transform = this.findComponent("TransformComponent");

        if (!this.transform) console.error("No transform found on : " + this.name);

        this.components.forEach((c) => {
            c?.awake();
        });
    }

    setParent(gameObject) {
        console.log(gameObject);
        this.parent = gameObject;
    }

    findComponent(name) {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].name === name) return this.components[i];
        }

        return null;
    }

    attachComponent(component) {
        this.components.push(component);
        if (this.instantiated) component?.awake();
    }

    update(dt) {
        this.components.forEach((c) => {
            c?.update(dt);
        });
    }

}