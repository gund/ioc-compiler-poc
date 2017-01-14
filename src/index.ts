import { compileFiles } from './compiler';

const done = compileFiles([
  __dirname + '/test/providers.browser.ts',
  __dirname + '/test/providers.web-worker.ts',
  __dirname + '/test/providers.mobile.ts',
]);

if (done) {
  console.log('Compilation completed!');
} else {
  console.log('Compilation failed!');
}
