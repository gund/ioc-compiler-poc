import {SOME_TOKEN} from './test-interface';
import {Test1Impl} from './test1';
import {Test2Impl} from './test2';

const TEST = [
  {provide: SOME_TOKEN, useClass: Test1Impl, deps: [], multi: true},
  {provide: '123', useFactory: Test2Impl, deps: [SOME_TOKEN, 'fff'], multi: false}
];
