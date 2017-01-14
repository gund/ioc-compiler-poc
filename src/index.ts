import { compileFiles } from './compiler';

const done = compileFiles([
  __dirname + '/test/test-program.ts'
]);

if (done) {
  console.log('Compilation completed!');
} else {
  console.log('Compilation failed!');
}
