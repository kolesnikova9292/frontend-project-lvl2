#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { startResult } from './formatters/index.js';
import parsing from './parsing.js';

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const extension1 = path.extname(fileName1);
  const extension2 = path.extname(fileName2);

  const file1 = path.resolve(fileName1);
  const file2 = path.resolve(fileName2);

  if (extension1 === '.json' && extension2 === '.json') {
    const data = fs.readFileSync(file1, 'utf8');
    const data1 = fs.readFileSync(file2, 'utf8');
    const json1 = JSON.parse(data);
    const json2 = JSON.parse(data1);

    const resultObject = parsing(json1, json2, formatter, startResult(formatter));

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

    const resultObject = parsing(doc, doc2, formatter, startResult(formatter));

    if (formatter === 'plain') {
      return resultObject.slice(0, -1);
    }

    return resultObject;
  }
  return null;
}
