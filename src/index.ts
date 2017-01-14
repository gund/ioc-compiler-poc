import { isAbsolute, resolve } from 'path';
import { COMPILED_POSTFIX, compileFiles } from './compiler';
import * as glob from 'glob';

const rootDir = process.cwd();

glob('**/providers.*.ts', (e, files) => {
  if (e) {
    console.error(e);
    return;
  }

  const resolvedFiles = files
    .filter(file => !file.includes(COMPILED_POSTFIX + '.ts'))
    .map(file => isAbsolute(file) ? file : resolve(rootDir, file));

  const done = compileFiles(resolvedFiles);

  if (done) {
    console.log('Compilation completed!');
    process.exit(0);
  } else {
    console.log('Compilation failed!');
    process.exit(1);
  }
});
