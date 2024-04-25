#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../src/genDiffMain.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1>')
  .arguments('<filepath2>')
  .action((filepath1, filepath2) => {
    const result = genDiff(filepath1, filepath2, program.opts().format);
    console.log(result);
  });

program.parse();
