import { Test1 } from './test1';
import { Test2 } from './test2';

export interface Type<T> extends Function { new (...args: any[]): T; }

export interface TestInterface {
  someProp: SomeClass1;
  someProp2: SomeClass2;
}

export const SOME_TOKEN = new Object();

export abstract class BaseClass<T> {
  abstract provide: any;
  provideAs = 'useClass';
  deps = [];
  multi = false;
  constructor(public value: Type<T>) { }
}

export class SomeClass1 extends BaseClass<Test1> {
  provide = SOME_TOKEN;
  multi = true;
}

export class SomeClass2 extends BaseClass<Test2> {
  provide = '123';
  provideAs = 'useFactory';
  deps = [SOME_TOKEN, 'fff']
}
