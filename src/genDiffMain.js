#!/usr/bin/env node
import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { startResult } from './formatters/index.js';
import parsing from './parsing.js';

const getDataByType = (fileName) => {
  const dateType = path.extname(fileName).slice(1);
  const filePath = path.resolve(fileName);
  const data = fs.readFileSync(filePath, 'utf8');

  if (dateType === 'json') {
    return JSON.parse(data);
  }
  if (dateType === 'yaml' || dateType === 'yml') {
    return yaml.load(data);
  }
  return null;
};

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const resultObject = parsing(
      getDataByType(fileName1),
      getDataByType(fileName2),
      formatter,
      startResult(formatter)
  );
  if (formatter === 'plain') {
    return resultObject.slice(0, -1);
  }

  return resultObject;
}
