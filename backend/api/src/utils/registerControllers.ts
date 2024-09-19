import { Application, RequestHandler } from 'express';
import 'reflect-metadata';
import { RouteDefinition } from '../types/controller';
import { CONTROLLER_METADATA_KEY, ROUTES_METADATA_KEY } from '../constants/controller';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
type Controller = new () => object;

function isHttpMethod(method: string): method is HttpMethod {
  return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method);
}

export default function registerControllers(
  app: Application,
  controllers: Controller[],
  basePathPrefix: string = '',
): void {
  controllers.forEach((ControllerClass) => {
    const instance = new ControllerClass();
    const controllerBasePath: string = Reflect.getMetadata(CONTROLLER_METADATA_KEY, ControllerClass) || '';
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_METADATA_KEY, ControllerClass) || [];

    routes.forEach((route) => {
      const { requestMethod, path, methodName, middlewares = [] } = route;
      const fullPath = `${basePathPrefix}/${controllerBasePath}${path}`;

      if (isHttpMethod(requestMethod) && typeof instance[methodName as keyof object] === 'function') {
        const routeHandler = instance[methodName as keyof object] as RequestHandler;
        const routeMiddlewares = middlewares as RequestHandler[];

        app[requestMethod](fullPath, ...routeMiddlewares, routeHandler.bind(instance));

        console.log(`Registered route: [${requestMethod.toUpperCase()}] ${fullPath}`);
      } else {
        console.warn(`Invalid route configuration for ${fullPath}`);
      }
    });
  });
}
