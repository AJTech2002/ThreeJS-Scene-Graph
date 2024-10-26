
            import RotateCube from './game-logic/RotateCube';
import * as RotateCubeProps from './component-props/RotateCube.props.json';
            import { DefaultComponentProps, DefaultComponents } from '@razor/core';

            export const Components = {RotateCube, ...DefaultComponents};
           export const ComponentProperties = { RotateCubeProps, ...DefaultComponentProps };

            export const returnProperty = (component, property) => {
                return ComponentProperties[component + "Props"].default[property];
            }

            export const getPropertiesOfComponent = (component) => {
                // Get the keys
                var obj = ComponentProperties[component + "Props"].default;
                return Object.keys(obj);
            }
        