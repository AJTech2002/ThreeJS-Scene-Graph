import GameComponent from './GameComponent';
import { Matrix4, Quaternion } from 'three';
export default class TransformComponent extends GameComponent {

    constructor(name, gameObject, componentProps) {
        super(name, gameObject, componentProps);

        this.position = this.props.position.clone();
        this.rotation = this.props.rotation.clone();
        this.scale = this.props.scale.clone();

        this.updateTransform();

    }

    updateTransform() {
        this.matrix = new Matrix4();
        let quat = new Quaternion().setFromEuler(this.rotation.clone());
        this.matrix.compose(this.position.clone(), quat.clone(), this.scale.clone());
    }

    update() {
        this.updateTransform();

        if (this.gameObject.parent) {
            this.matrix.copy(this.matrix.premultiply(this.gameObject.parent.transform.matrix));
        }
    }
}