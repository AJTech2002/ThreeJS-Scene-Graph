import yup from "yup";
import { serializedComponent, serializedScene } from "./validation";

/**
 * A serialized component for the purposes of the server api
 */
export type SerializedComponent = yup.InferType<typeof serializedComponent>;

/**
 * A serialized scene for the purposes of the server api
 */
export type SerializedScene = yup.InferType<typeof serializedScene>;
