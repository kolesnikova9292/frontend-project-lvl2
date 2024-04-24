import fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import buildTree from './buildTree.js';
import formatTree from './formatters/index.js';

const parsedDataByType = (data, dateType) => {
  if (dateType === 'json') {
    return JSON.parse(data);
  }
  if (dateType === 'yaml' || dateType === 'yml') {
    return yaml.load(data);
  }
  return null;
};

const getParsedData = (fileName) => {
  const dateType = path.extname(fileName).slice(1);
  const filePath = path.resolve(fileName);
  const data = fs.readFileSync(filePath, 'utf8');
  return parsedDataByType(data, dateType);
};

export default function genDiffMain(fileName1, fileName2, formatter = 'stylish') {
  const resultObject = buildTree(
    getParsedData(fileName1),
    getParsedData(fileName2),
  );

  //console.log(resultObject)

  return formatTree(resultObject, formatter);
}
