import { SomeClass1, SomeClass2, TestInterface } from './test-interface';
import { Test1Impl } from './test1';
import { Test2Impl } from './test2';

export const TEST: TestInterface = {
  someProp: new SomeClass1(Test1Impl),
  someProp2: new SomeClass2(Test2Impl),
};
