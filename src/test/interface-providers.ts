import { Test1 } from './test1';
import { Test2 } from './test2';

export interface Type<T> extends Function { new (...args: any[]): T; }

export interface ProviderTokens {
  token1: SomeClass1;
  token2: SomeClass2;
}

export const SOME_TOKEN = new Object();

export abstract class ProviderToken<T> {
  abstract provide: any;
  provideAs = 'useClass';
  deps = [];
  multi = false;
  constructor(public value: Type<T>) { }
}

export class SomeClass1 extends ProviderToken<Test1> {
  provide = SOME_TOKEN;
  multi = true;
}

export class SomeClass2 extends ProviderToken<Test2> {
  provide = '123';
  provideAs = 'useFactory';
  deps = [SOME_TOKEN, 'fff']
}
