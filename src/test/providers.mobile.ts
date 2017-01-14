import { SomeClass1, SomeClass2, ProviderTokens } from './interface-providers';
import { Test1Mobile } from './test1';
import { Test2Mobile } from './test2';

export const TOKENS: ProviderTokens = {
  token1: new SomeClass1(Test1Mobile),
  token2: new SomeClass2(Test2Mobile),
};
