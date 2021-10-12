import yup from "yup";

/**
 * Represents the object shape of a serialized component for the purposes of the
 * server api
 */
export const serializedComponent = yup.object().shape({
  name: yup.string().defined(),
});

/**
 * Represents the object shape of a serialized scene for the purposes of the
 * server api
 */
export const serializedScene = yup.object().shape({
  name: yup.string().defined(),
  components: yup.array().of(serializedComponent).defined(),
});
