import {SOME_TOKEN} from './interface-providers';
import {Test1Browser} from './test1';
import {Test2Browser} from './test2';

const TOKENS = [
  {provide: SOME_TOKEN, useClass: Test1Browser, deps: [], multi: true},
  {provide: '123', useFactory: Test2Browser, deps: [SOME_TOKEN, 'fff'], multi: false}
];
