import {SOME_TOKEN} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/interface-providers';
import {Test1Mobile} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/test1';
import {Test2Mobile} from '.c:/Users/malke/WebstormProjects/ts-compiler-test/src/test/test2';

const TOKENS = [
  {provide: SOME_TOKEN, useClass: Test1Mobile, deps: [], multi: true},
  {provide: '123', useFactory: Test2Mobile, deps: [SOME_TOKEN, 'fff'], multi: false}
];
