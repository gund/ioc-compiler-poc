import {SOME_TOKEN} from './interface-providers';
import {Test1Worker} from './test1';
import {Test2Worker} from './test2';

const TOKENS = [
  {provide: SOME_TOKEN, useClass: Test1Worker, deps: [], multi: true},
  {provide: '123', useFactory: Test2Worker, deps: [SOME_TOKEN, 'fff'], multi: false}
];
