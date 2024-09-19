import 'reflect-metadata';
import { CONTROLLER_METADATA_KEY } from '../constants/controller';

const Controller = function Controller(basePath: string = ''): ClassDecorator {
  return function ControllerDecorator(target) {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, basePath, target);
  };
};

export default Controller;
