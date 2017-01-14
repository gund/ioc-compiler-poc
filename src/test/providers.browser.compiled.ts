import {SOME_TOKEN} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/interface-providers';
import {Test1Browser} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/test1';
import {Test2Browser} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/test2';

const TOKENS = [
  {provide: SOME_TOKEN, useClass: Test1Browser, deps: [], multi: true},
  {provide: '123', useFactory: Test2Browser, deps: [SOME_TOKEN, 'fff'], multi: false}
];
