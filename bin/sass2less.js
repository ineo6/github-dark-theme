const sass2less = require('less-plugin-sass2less/lib')
const fs = require('fs-extra');
const glob = require('glob');
const chalk = require('chalk');
const symbols = require('log-symbols');

const converter = new sass2less()

function persist(file, result) {
  const fileName = file.replace('.scss', '.less');

  try {
    fs.renameSync(file, fileName)

    fs.writeFileSync(fileName, result)

    console.log(symbols.success, chalk.green(file));
  } catch (err) {
    console.error(err)
  }
}

module.exports = function (scssPath) {
  const files = glob.sync(scssPath)

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const stats = fs.statSync(file);

    if (stats.isFile()) {
      try {
        const contents = fs.readFileSync(file, 'utf8');

        const result = converter.process(contents, {fileInfo: {filename: 'anything.scss'}})
        persist(file, result);
      } catch (err) {
        console.log(err)
      }
    }
  }

  files.forEach(function (file) {

  })
}
