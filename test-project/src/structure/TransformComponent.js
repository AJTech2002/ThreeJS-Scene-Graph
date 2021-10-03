import GameComponent from './GameComponent';

export default class TransformComponent extends GameComponent {

    constructor(name, gameObject, componentProps) {
        super(name, gameObject, componentProps);

        this.position = this.props.position;
        this.rotation = this.props.rotation;
        this.scale = this.props.scale;
    }



}