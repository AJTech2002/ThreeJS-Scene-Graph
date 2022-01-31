import GameObject from "./GameObject";

export default class RaycastHit {
    public intersection: THREE.Intersection | null = null;
    public gameObject: GameObject | null = null;
}