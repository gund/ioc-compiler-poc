import { writeFileSync } from 'fs';
import * as ts from 'typescript';

export interface ImportNotation {
  path: string;
  names: string[];
}

export function isNodeExported(node: ts.Node): boolean {
  return (node.flags & ts.NodeFlags.Export) !== 0 ||
    (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}

export function isNodeOfKind(kind: ts.SyntaxKind): (node: ts.Node) => boolean {
  return node => node.kind === kind;
}

export function getClassMembers(classType: ts.Type): ts.Map<ts.Symbol> {
  if (classType.symbol.valueDeclaration.kind !==
    ts.SyntaxKind.ClassDeclaration) {
    console.log(
      `Expected class ${classType.symbol.name} to be ClassDeclaration`);
    return;
  }

  const members: ts.Map<ts.Symbol> = Object.create(null);
  const baseClasses = classType.getBaseTypes();

  if (baseClasses && baseClasses.length) {
    baseClasses.forEach(
      baseClass => Object.assign(members, getClassMembers(baseClass)));
  }

  Object.assign(members, classType.symbol.members);

  return members;
}

export function getPropertyDeclaration(symbol: ts.Symbol):
  ts.PropertyDeclaration {
  return symbol.declarations[0] as ts.PropertyDeclaration;
}

export function getNodeType(declList: ts.Node): string {
  if ((declList.flags & ts.NodeFlags.Const) !== 0) {
    return 'const';
  } else if ((declList.flags & ts.NodeFlags.Let) !== 0) {
    return 'let';
  } else {
    return 'var';
  }
}

export function stripStringExpressionName(expr: ts.Expression): string {
  const name = expr.getText();
  if (expr.kind === ts.SyntaxKind.StringLiteral) {
    return name.replace(/\'/g, '');
  } else {
    return name;
  }
}

export function getExpressionImport(
  expr: ts.Expression, checker: ts.TypeChecker, relativeTo?: string): ImportNotation {
  if (expr.kind !== ts.SyntaxKind.Identifier) {
    return null;
  }

  const symbol = checker.getSymbolAtLocation(expr);
  const type = checker.getTypeAtLocation(expr);
  const originalSymbol = (<any>type.symbol).parent as ts.Symbol;

  let fullPath = '';
  if (originalSymbol) {
    fullPath = originalSymbol.name.replace(/\"/g, '');
  } else {
    fullPath = (<ts.Identifier>expr).getSourceFile().fileName;
  }

  const name = expr.getText();
  let path = fullPath.replace('.ts', '');

  if (path.includes(relativeTo)) {
    path = path.replace(relativeTo, '.');
  }

  return {
    names: [name], path
  }
}

export function optimizeImports(imports: ImportNotation[]): ImportNotation[] {
  const importsMap: { [k: string]: string[] } = Object.create(null);

  imports.forEach(({path, names}) => {
    if (!importsMap[path]) {
      importsMap[path] = [...names];
    } else {
      importsMap[path].push(...names);
    }
  });

  return Object.keys(importsMap).map(path => ({
    path,
    names: importsMap[path].filter(
      (name, i, arr) => arr.indexOf(name) === i)
  }));
}

export function renderImports(imports: ImportNotation[]): string {
  const optimizedImports = optimizeImports(imports);
  const importTpl = `import {$names} from '$path';`;

  return optimizedImports
    .map(
    ({path, names}) => importTpl.replace('$names', names.join(', '))
      .replace('$path', path))
    .join('\n');
}

export function renderProviders(providers: string[], name: string, varType: string): string {
  const startStr = `${varType} ${name} = [\n  `;
  const endStr = `\n];`;
  return startStr + providers.join(',\n  ') + endStr;
}

export function renderImportsAndProviders(file: string, imports: string, providers: string) {
  const content = `${imports}\n\n${providers}\n`;
  writeFileSync(file, content);
}

const isNodeVariableStatement = isNodeOfKind(ts.SyntaxKind.VariableStatement);

export function getExportedVarOfType(stmts: ts.NodeArray<ts.Statement>, type: string): ts.VariableStatement {
  const vars = stmts.filter((node: ts.VariableStatement) =>
    isNodeExported(node) &&
    isNodeVariableStatement(node) &&
    node.declarationList.declarations[0].type.getText() === type);

  if (!vars.length) {
    throw Error(`No exported variables of type '${type}' found`);
  }

  if (vars.length > 1) {
    throw Error(`More than one variable of type '${type}' found`);
  }

  return vars.shift() as ts.VariableStatement;
}
