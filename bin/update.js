#!/usr/bin/env node
'use strict'

const path = require('path');
const chalk = require('chalk');
const fsExtra = require('fs-extra');
const fs = require('fs');
const os = require('os');
const ora = require('ora');
const download = require('download-git-repo');
const sass2less = require('./sass2less');
const processLess = require('./processLess');

const cwd = process.cwd();
const origin = 'poychang/github-dark-theme';

const branch = "#master";

const targetPath = path.join(cwd, 'lib');

const tmpDirPrefix = path.join(os.tmpdir(), '.tmp');

const tmpDir = fs.mkdtempSync(tmpDirPrefix);

const spinner = ora(`downloading ${origin}...`);
spinner.start();

download(`${origin}${branch}`, tmpDir, {clone: false}, function (err) {
  spinner.stop();
  if (err) {
    console.log(chalk.red(`Failed to download repo https://github.com/${origin}${branch}`, err));
  } else {
    console.log(chalk.green(`Success to download repo https://github.com/${origin}${branch}`));

    try {
      fsExtra.copySync(path.join(tmpDir, 'src/theme'), path.join(targetPath));

      //remove
      fsExtra.removeSync(path.join(targetPath, 'extensions'))

      sass2less(path.join(targetPath, '*.scss'));

      // convert sass to less
      processLess(path.join(targetPath, 'app.less'))

      console.log(chalk.green('Done!'));
    } catch (e) {
      console.log(e.message);
    }
  }
})
