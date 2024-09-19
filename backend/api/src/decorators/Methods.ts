import 'reflect-metadata';
import { RequestHandler } from 'express';
import { RouteDefinition } from '../types/controller';
import { ROUTES_METADATA_KEY } from '../constants/controller';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

function createMethodDecorator(method: HttpMethod) {
  return function methodDecorator(path: string = '', ...middlewares: RequestHandler[]): MethodDecorator {
    return function routeDecorator(target, propertyKey) {
      if (!Reflect.hasMetadata(ROUTES_METADATA_KEY, target.constructor)) {
        Reflect.defineMetadata(ROUTES_METADATA_KEY, [], target.constructor);
      }

      const routes = Reflect.getMetadata(ROUTES_METADATA_KEY, target.constructor) as RouteDefinition[];

      routes.push({
        requestMethod: method,
        path,
        methodName: propertyKey,
        middlewares,
      });

      Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target.constructor);
    };
  };
}

export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');
export const Put = createMethodDecorator('put');
export const Delete = createMethodDecorator('delete');
export const Patch = createMethodDecorator('patch');
export const Options = createMethodDecorator('options');
export const Head = createMethodDecorator('head');
