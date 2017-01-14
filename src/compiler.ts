import {
  getClassMembers,
  getExportedVarOfType,
  getExpressionImport,
  getNodeType,
  getPropertyDeclaration,
  ImportNotation,
  isNodeOfKind,
  renderImports,
  renderImportsAndProviders,
  renderProviders,
  stripStringExpressionName
} from './util';
import * as ts from 'typescript';

const isNodePropertyAssignment = isNodeOfKind(ts.SyntaxKind.PropertyAssignment);

export function compileFiles(files: string[]): boolean {
  return files.every(file => {
    try {
      const path = file.substr(0, file.lastIndexOf('/')).replace(/\\/g, '/');
      console.log('Compiling file ' + file);
      compileFile(file, path);
      console.log('OK');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}

export function compileFile(fileName: string, path: string): void {
  const program = ts.createProgram([fileName],
    { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS });
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(fileName);

  const varStmt = getExportedVarOfType(sourceFile.statements, 'TestInterface');

  const declarations = varStmt.declarationList.declarations;

  if (!declarations.length) {
    throw Error('No declarations found');
  }

  const declaration = declarations[0];
  const initializer = declaration.initializer;

  if (initializer.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
    throw Error('Initializer is not an Object Literal');
  }

  const name = declaration.name;
  const varType = getNodeType(varStmt.declarationList);
  const properties = <ts.PropertyDeclaration[]>(<any>initializer)
    .properties.filter(isNodePropertyAssignment);

  if (!properties.length) {
    throw Error('No properties found');
  }

  const providers = properties.map(prop => {
    const initializer = <ts.NewExpression>prop.initializer;

    if (initializer.kind !== ts.SyntaxKind.NewExpression) {
      throw Error('Expected initializer to be NewExpression');
    }

    const expr = <ts.Identifier>initializer.expression;
    const args = <ts.NodeArray<ts.Identifier>>initializer.arguments;

    if (!args.length) {
      throw Error('No arguments provided to token class');
    }

    const valueIdentifier = args[0];
    const tokenInfo = collectTokenInfo(expr, valueIdentifier, checker);

    return generateProviderFromTokenInfo(
      tokenInfo.tokenSymbol, valueIdentifier, tokenInfo.tokenMembers, checker, path);
  });

  const imports = providers
    .reduce((arr, p) => [...arr, ...p.imports], [])
    .filter(i => !!i);

  const providersStr = renderProviders(
    providers.map(p => p.providerStr), name.getText(), varType);
  const importsStr = renderImports(imports);

  const newFile = fileName.replace('.ts', '.compiled.ts');

  renderImportsAndProviders(newFile, importsStr, providersStr);
}

export function collectTokenInfo(
  tokenClass: ts.Identifier, providedValue: ts.Identifier,
  checker: ts.TypeChecker) {
  if (tokenClass.kind !== ts.SyntaxKind.Identifier ||
    providedValue.kind !== ts.SyntaxKind.Identifier) {
    console.log('Token and Value should be Identifiers');
    return;
  }

  const tokenSymbol = checker.getSymbolAtLocation(tokenClass);
  const valueSymbol = checker.getSymbolAtLocation(providedValue);

  const tokenType = checker.getDeclaredTypeOfSymbol(tokenSymbol);
  const valueType = checker.getDeclaredTypeOfSymbol(valueSymbol);

  const tokenMembers = getClassMembers(tokenType);

  if (!tokenMembers['provide']) {
    console.log(`No 'provide' property found`);
    return;
  }
  if (!tokenMembers['provideAs']) {
    console.log(`No 'provideAs' property found`);
    return;
  }
  if (!tokenMembers['deps']) {
    console.log(`No 'deps' property found`);
    return;
  }
  if (!tokenMembers['multi']) {
    console.log(`No 'multi' property found`);
    return;
  }

  Object.keys(tokenMembers)
    .map(name => tokenMembers[name])
    .filter(
    member => !member.valueDeclaration ||
      member.valueDeclaration.kind !==
      ts.SyntaxKind.PropertyDeclaration)
    .forEach(member => delete tokenMembers[member.name]);

  return {
    tokenSymbol, valueSymbol, tokenMembers
  }
}

export function generateProviderFromTokenInfo(
  tokenSymbol: ts.Symbol, valueIdentifier: ts.Identifier,
  tokenMembers: ts.Map<ts.Symbol>, checker: ts.TypeChecker, path: string) {
  const provideSymbol = tokenMembers['provide'];
  const provideAsSymbol = tokenMembers['provideAs'];
  const depsSymbol = tokenMembers['deps'];
  const multiSymbol = tokenMembers['multi'];

  const provideDecl = getPropertyDeclaration(provideSymbol);
  const provideAsDecl = getPropertyDeclaration(provideAsSymbol);
  const depsDecl = getPropertyDeclaration(depsSymbol);
  const multiDecl = getPropertyDeclaration(multiSymbol);

  const provideStr = provideDecl.initializer.getText();
  const provideAsStr = stripStringExpressionName(provideAsDecl.initializer);
  const depsStr = depsDecl.initializer.getText();
  const multiStr = multiDecl.initializer.getText();
  const valueStr = valueIdentifier.getText();

  const providerStr = `
    {provide: ${provideStr}, ${provideAsStr}: ${valueStr}, deps: ${depsStr
    }, multi: ${multiStr}}
  `.trim();

  const imports = [provideDecl.initializer, valueIdentifier];

  const depsInitializer = depsDecl.initializer;
  if (depsInitializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
    imports.push(...(<any>depsInitializer).elements);
  }

  return { providerStr, imports: getImportsFor(imports, checker, path) };
}

export function getImportsFor(
  expressions: ts.Expression[], checker: ts.TypeChecker, path: string): ImportNotation[] {
  return expressions.map(expr => getExpressionImport(expr, checker, path));
}
