import { RequestHandler } from 'express';

export interface RouteDefinition {
  path: string;
  requestMethod: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
  methodName: string | symbol;
  middlewares?: RequestHandler[];
}
