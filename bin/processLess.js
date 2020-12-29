const {parse} = require('gonzales-pe');
const fs = require('fs');
const chalk = require('chalk');

const ignoreList = ['extensions/!ext.scss'];

function replaceImport(ast) {
  let nextShouldRemove = false;

  ast.traverseByTypes(['atrule', 'declarationDelimiter'], function (node, index, parent) {

    if (node.is('atrule')) {
      const atKeyWord = node.first('atkeyword').first('ident');
      if (atKeyWord.content !== 'import') {
        return;
      }

      const importNode = node.first('string');
      const importString = importNode.content;

      if (ignoreList.indexOf(importString.replace(/'/g, '')) >= 0) {
        ast.removeChild(index);
        nextShouldRemove = true;
      } else {
        importNode.content = importString.replace('.scss', '.less');
      }
    } else if (node.is('declarationDelimiter') && nextShouldRemove) {
      ast.removeChild(index);

      nextShouldRemove = false;
    }
  });

  return ast;
}

function processImport(lessFile) {
  const content = fs.readFileSync(lessFile).toString();

  if (content && content.length > 0) {

    let astTree;

    try {
      astTree = parse(content, {
        syntax: 'less'
      })
    } catch (e) {
      console.log(chalk.red(`parse error: ${e}`));
      return;
    }

    try {
      astTree = replaceImport(astTree);

      return astTree;
    } catch (e) {
      console.log(chalk.red(`transform error: ${e}`));
    }
  }
}

module.exports = function (file) {
  const ast = processImport(file);

  if (ast) {
    fs.writeFileSync(file, ast.toString());
  }
}
