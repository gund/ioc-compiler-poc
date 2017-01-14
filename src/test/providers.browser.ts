import { SomeClass1, SomeClass2, ProviderTokens } from './interface-providers';
import { Test1Browser } from './test1';
import { Test2Browser } from './test2';

export const TOKENS: ProviderTokens = {
  token1: new SomeClass1(Test1Browser),
  token2: new SomeClass2(Test2Browser),
};
