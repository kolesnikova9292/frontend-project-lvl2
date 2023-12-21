#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { startResult } from './src/formatters/index.js';
import parsing from './src/parsing.js';

export default function genDiff(fileName1, fileName2, formatter = 'stylish', replacer = ' ', spacesCount = 1, result = startResult(formatter), step = 1) {
  const extension1 = path.extname(fileName1);
  const extension2 = path.extname(fileName2);

  const file1 = path.resolve(fileName1);
  const file2 = path.resolve(fileName2);

  if (extension1 === '.json' && extension2 === '.json') {
    const data = fs.readFileSync(file1, 'utf8');
    const data1 = fs.readFileSync(file2, 'utf8');
    const json1 = JSON.parse(data);
    const json2 = JSON.parse(data1);

    const resultObject = parsing(json1, json2, formatter, replacer, spacesCount, result, step);

    if (formatter === 'plain') {
      return resultObject.slice(0, -1);
    }

    return resultObject;
  }

  if ((extension1 === '.yaml' && extension2 === '.yaml') || (extension1 === '.yml' && extension2 === '.yml')) {

    const data = fs.readFileSync(file1, 'utf8');
    const data1 = fs.readFileSync(file2, 'utf8');

    const doc = yaml.load(data);
    const doc2 = yaml.load(data1);

    let resultObject = parsing(doc, doc2, formatter, replacer, spacesCount, result, step);

    if(formatter === 'plain') {
      resultObject = resultObject.slice(0, -1);
    }

    return resultObject;
  }
}

program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format <type>', 'output format', 'stylish')
    .arguments('<filepath1>')
    .arguments('<filepath2>')
    .allowUnknownOption(true)
    .action((filepath1, filepath2) => {
        const result = genDiff(filepath1, filepath2, program.opts().format);
        console.log(result);
    });

program.parse();
