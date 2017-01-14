import {SOME_TOKEN} from './interface-providers';
import {Test1Mobile} from './test1';
import {Test2Mobile} from './test2';

const TOKENS = [
  {provide: SOME_TOKEN, useClass: Test1Mobile, deps: [], multi: true},
  {provide: '123', useFactory: Test2Mobile, deps: [SOME_TOKEN, 'fff'], multi: false}
];
